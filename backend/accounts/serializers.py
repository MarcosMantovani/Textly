from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import get_user_model
from .models import UserAccount, Post
from rest_framework import serializers


User = get_user_model()

class userCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'username', 'password')

class CustomUserSerializer(UserSerializer):
    follows = UserSerializer(many=True, read_only=True)
    followed_by = UserSerializer(many=True, read_only=True)

    class Meta(UserSerializer.Meta):
        model = UserAccount
        fields = ('id', 'email', 'username', 'name', 'follows', 'followed_by', 'date_modified')

    # Retornando usuários de follows e followed_by
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['follows'] = UserSerializer(instance.follows.all(), many=True).data
        data['followed_by'] = UserSerializer(instance.followed_by.all(), many=True).data
        return data

class PostSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'user', 'body', 'created_at')

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'name': obj.user.name
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        created_at = instance.created_at.strftime("%d/%m/%Y %H:%M")
        representation['created_at'] = created_at
        return representation