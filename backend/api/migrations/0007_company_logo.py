# Generated by Django 5.0.7 on 2024-08-12 12:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_company_phone_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='logo',
            field=models.ImageField(blank=True, upload_to='company_logos/'),
        ),
    ]
