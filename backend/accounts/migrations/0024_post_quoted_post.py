# Generated by Django 5.0.3 on 2024-04-21 14:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0023_post_likes_alter_post_user"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="quoted_post",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="quotes",
                to="accounts.post",
            ),
        ),
    ]
