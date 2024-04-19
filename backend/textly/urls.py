from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.contrib import admin
from accounts.views import UserDetailView, follow_user, unfollow_user, get_posts

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('auth/follow/', follow_user, name='follow-user'),
    path('auth/unfollow/', unfollow_user, name='unfollow-user'),
    path('auth/posts/', get_posts, name='get-posts'),
    path('auth/posts/<int:user_id>/', get_posts, name='get-posts'),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
