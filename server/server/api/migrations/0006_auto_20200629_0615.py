# Generated by Django 3.0.7 on 2020-06-29 06:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_columndata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='columndata',
            name='caseId',
            field=models.CharField(max_length=2000, unique=True),
        ),
    ]