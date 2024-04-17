from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import get_user_model
from .models import UserAccount
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
