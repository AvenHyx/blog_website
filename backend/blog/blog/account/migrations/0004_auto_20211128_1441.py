# Generated by Django 3.2.9 on 2021-11-28 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0003_alter_user_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.URLField(null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='privilege',
            field=models.PositiveSmallIntegerField(default=0),
        ),
    ]
