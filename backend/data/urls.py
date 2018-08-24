# pylint: disable=C0103

from django.urls import path

from . import views

app_name = 'data'

urlpatterns = [
    path(
        'data-management/get-overall-data',
        views.get_overall_data,
        name='get-overall-data'
    ),
]
