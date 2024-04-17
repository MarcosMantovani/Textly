from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from django.db.models.signals import post_save


class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, username, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have as email address')

        email = self.normalize_email(email)
        user = self.model(email=email, name=name, username=username, **extra_fields)

        user.set_password(password)
        user.save(using=self._db) # Se houver algum erro, alterar para sem parametro

        return user

    def create_superuser(self, email, name, username, password=None):
        user = self.create_user(email, name, username, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    follows = models.ManyToManyField("self",
                                    related_name="followed_by",
                                    symmetrical=False,
                                    blank=True)
    date_modified = models.DateTimeField(auto_now=True)

    objects = UserAccountManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['name', 'email']

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name

    def get_email(self):
        return self.email

    def __str__(self):
        return self.username
