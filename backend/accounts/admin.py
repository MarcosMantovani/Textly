from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models import UserAccount


class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'name', 'email', 'is_staff']

admin.site.register(UserAccount, CustomUserAdmin)
admin.site.unregister(Group)
