from django.contrib import admin
from django.urls import path ,include

# from django.conf.urls import url, include



# router1 = routers.DefaultRouter()
# router1.register(r'', views.UPDATEGENEANNOTATIONViewSet, basename="update_GeneAnnotation")

#用來決定網址名稱
urlpatterns = [
    path("admin/", admin.site.urls),
    path('proteomes/',include('proteomes_app.urls')),
]


