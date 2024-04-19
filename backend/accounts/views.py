from django.http import Http404
from rest_framework.generics import RetrieveAPIView
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import UserAccount
from .serializers import CustomUserSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

class UserDetailView(RetrieveAPIView):
    queryset = UserAccount.objects.all()
    serializer_class = CustomUserSerializer

    def get_object(self):
        user_id = self.kwargs['pk']
        return self.get_queryset().get(pk=user_id)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request):
    # Obter o usuário atualmente autenticado
    user_to_follow = request.user

    # Obter o ID do usuário a ser seguido do corpo da solicitação
    user_to_be_followed_id = request.data.get('user_to_be_followed_id', None)

    if user_to_be_followed_id is None:
        return Response({"message": "The user ID to be followed was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Obter o usuário a ser seguido a partir do ID fornecido
        user_to_be_followed = UserAccount.objects.get(id=user_to_be_followed_id)
    except UserAccount.DoesNotExist:
        return Response({"message": "User to be followed not found."}, status=status.HTTP_404_NOT_FOUND)

    # Adicionar o usuário a ser seguido ao campo 'follows' do usuário que está seguindo
    user_to_follow.follows.add(user_to_be_followed)

    return Response({"message": "User followed successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_user(request):
    # Obter o usuário atualmente autenticado
    user_to_follow = request.user

    # Obter o ID do usuário a ser seguido do corpo da solicitação
    user_to_be_unfollowed_id = request.data.get('user_to_be_unfollowed_id', None)

    if user_to_be_unfollowed_id is None:
        return Response({"message": "The user ID to be unfollowed was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Obter o usuário a ser seguido a partir do ID fornecido
        user_to_be_followed = UserAccount.objects.get(id=user_to_be_unfollowed_id)
    except UserAccount.DoesNotExist:
        return Response({"message": "User to be unfollowed not found."}, status=status.HTTP_404_NOT_FOUND)

    # Adicionar o usuário a ser seguido ao campo 'follows' do usuário que está seguindo
    user_to_follow.follows.remove(user_to_be_followed)

    return Response({"message": "User unfollowed successfully."}, status=status.HTTP_200_OK)