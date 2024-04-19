from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import get_user_model
from .models import UserAccount, Post
from rest_framework import serializers


User = get_user_model()

class userCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'username', 'password')

class CustomSoaiclUsersSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = UserAccount
        fields = ('id', 'username', 'name', 'profile_photo')

class CustomUserSerializer(UserSerializer):
    follows = CustomSoaiclUsersSerializer(many=True, read_only=True)
    followed_by = CustomSoaiclUsersSerializer(many=True, read_only=True)

    class Meta(UserSerializer.Meta):
        model = UserAccount
        fields = ('id', 'email', 'username', 'name', 'profile_photo', 'banner', 'follows', 'followed_by', 'date_modified')

class PostUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ('id', 'name', 'username', 'profile_photo')

class PostSerializer(serializers.ModelSerializer):
    user = PostUserSerializer()

    class Meta:
        model = Post
        fields = ('id', 'user', 'body', 'created_at')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        created_at = instance.created_at.strftime("%d/%m/%Y %H:%M")
        representation['created_at'] = created_at
        return representation