# Generated by Django 4.2.7 on 2024-11-26 12:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0002_classschedule_room_danceclass_difficulty_and_more'),
        ('attendance', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='attendance',
            options={'verbose_name': '출석', 'verbose_name_plural': '출석 관리'},
        ),
        migrations.AlterUniqueTogether(
            name='attendance',
            unique_together=set(),
        ),
        migrations.AlterField(
            model_name='makeupclass',
            name='original_class',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='original_makeup_classes', to='classes.classschedule', verbose_name='원래 수업'),
        ),
        migrations.AddConstraint(
            model_name='attendance',
            constraint=models.UniqueConstraint(fields=('student', 'dance_class', 'date'), name='unique_daily_attendance'),
        ),
    ]
