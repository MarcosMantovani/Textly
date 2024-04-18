from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.contrib import admin
from accounts.views import UserDetailView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
