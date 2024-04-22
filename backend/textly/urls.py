from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.contrib import admin
from accounts.views import UserDetailView, follow_user, unfollow_user, get_posts, create_post, update_profile_photo, update_banner, like_post, update_bio, delete_post
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('user/follow/', follow_user, name='follow-user'),
    path('user/unfollow/', unfollow_user, name='unfollow-user'),
    path('user/update-profile-photo/', update_profile_photo, name='update-profile-photo'),
    path('user/update-banner/', update_banner, name='update-banner'),
    path('user/update-bio/', update_bio, name='update-bio'),
    path('posts/', get_posts, name='get-posts'),
    path('posts/<int:user_id>/', get_posts, name='get-posts'),
    path('create-post/', create_post, name='create-post'),
    path('like-post/', like_post, name='like-post'),
    path('delete-post/', delete_post, name='delete-post'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
