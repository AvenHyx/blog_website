# Generated by Django 3.2.9 on 2021-12-22 23:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_alter_articles_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='comments',
            name='type',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
