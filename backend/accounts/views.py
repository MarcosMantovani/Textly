from rest_framework.generics import RetrieveAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import UserAccount, Post
from .serializers import CustomUserSerializer, PostSerializer

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_posts(request, user_id=None):
    if user_id is not None:
        # Se um ID de usuário foi fornecido na URL, filtrar os posts por esse usuário
        posts = Post.objects.filter(user_id=user_id)
    else:
        # Se nenhum ID de usuário foi fornecido na URL, retornar todos os posts
        posts = Post.objects.all()

    # Ordenar os posts do mais novo para o mais antigo
    posts = posts.order_by('-created_at')

    # Serializar os posts
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)