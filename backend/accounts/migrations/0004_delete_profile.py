# Generated by Django 5.0.3 on 2024-04-16 00:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_profile"),
    ]

    operations = [
        migrations.DeleteModel(
            name="Profile",
        ),
    ]