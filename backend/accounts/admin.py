from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models import UserAccount


class CustomUserAdmin(UserAdmin):
    model = UserAccount
    list_display = ['username', 'name', 'email', 'id', 'is_staff']

    fieldsets = (
        (None, {'fields': ('username', 'name', 'email', 'password')}),
        ('Profile', {'fields': ('follows', 'get_followed_by',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    readonly_fields = ('get_followed_by',)

    def get_followed_by(self, obj):
        return ", ".join([user.username for user in obj.followed_by.all()])
    get_followed_by.short_description = 'Followed by'

admin.site.unregister(Group)
admin.site.register(UserAccount, CustomUserAdmin)
