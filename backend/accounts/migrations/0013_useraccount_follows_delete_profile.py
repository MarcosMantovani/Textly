# Generated by Django 5.0.3 on 2024-04-16 17:46

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0012_alter_profile_date_modified_alter_profile_user"),
    ]

    operations = [
        migrations.AddField(
            model_name="useraccount",
            name="follows",
            field=models.ManyToManyField(
                blank=True, related_name="followed_by", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.DeleteModel(
            name="Profile",
        ),
    ]
