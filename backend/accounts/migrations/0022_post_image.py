# Generated by Django 5.0.3 on 2024-04-19 23:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0021_useraccount_banner"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to="images"),
        ),
    ]
