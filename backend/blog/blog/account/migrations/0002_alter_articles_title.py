# Generated by Django 3.2.9 on 2021-12-22 22:05

import account.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='articles',
            name='title',
            field=models.TextField(validators=[account.models.validate_title_length]),
        ),
    ]