from django.urls import path,re_path
from . import views

urlpatterns = [
    path('proteomes_screener/',views.proteomes_screener),
    path('proteomes_screener_table/',views.proteomes_screener_table),
]