# Generated by Django 5.0.3 on 2024-04-16 18:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0015_alter_profile_date_modified"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="useraccount",
            name="follows",
        ),
    ]
