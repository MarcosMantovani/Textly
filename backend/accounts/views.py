from rest_framework.generics import RetrieveAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from .models import UserAccount, Post
from .serializers import CustomUserSerializer, PostSerializer, SearchedUsersSerializer
from django.utils import timezone
from django.db.models import Q

class UserDetailView(RetrieveAPIView):
    queryset = UserAccount.objects.all()
    serializer_class = CustomUserSerializer

    def get_object(self):
        user_id = self.kwargs['pk']
        return self.get_queryset().get(pk=user_id)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request):
    # Obtendo o usuário atualmente autenticado
    user_to_follow = request.user

    # Obtendo o ID do usuário a ser seguido do corpo da solicitação
    user_to_be_followed_id = request.data.get('user_to_be_followed_id', None)

    if user_to_be_followed_id is None:
        return Response({"message": "The user ID to be followed was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Obtendo o usuário a ser seguido a partir do ID fornecido
        user_to_be_followed = UserAccount.objects.get(id=user_to_be_followed_id)
    except UserAccount.DoesNotExist:
        return Response({"message": "User to be followed not found."}, status=status.HTTP_404_NOT_FOUND)

    # Adicionando o usuário a ser seguido ao campo follows do usuário que está seguindo
    user_to_follow.follows.add(user_to_be_followed)

    return Response({"message": "User followed successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_user(request):
    # Obtendo o usuário atualmente autenticado
    user_to_follow = request.user

    # Obtendo o ID do usuário a parar de ser seguido do corpo da solicitação
    user_to_be_unfollowed_id = request.data.get('user_to_be_unfollowed_id', None)

    if user_to_be_unfollowed_id is None:
        return Response({"message": "The user ID to be unfollowed was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Obtendo o usuário a parar de ser seguido a partir do ID fornecido
        user_to_be_followed = UserAccount.objects.get(id=user_to_be_unfollowed_id)
    except UserAccount.DoesNotExist:
        return Response({"message": "User to be unfollowed not found."}, status=status.HTTP_404_NOT_FOUND)

    # Removendo o usuário a parar de ser seguido do campo follows do usuário que estava seguindo
    user_to_follow.follows.remove(user_to_be_followed)

    return Response({"message": "User unfollowed successfully."}, status=status.HTTP_200_OK)

class PostPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

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

    # Aplicar paginação aos resultados
    paginator = PostPagination()
    result_page = paginator.paginate_queryset(posts, request)

    # Serializando os posts
    serializer = PostSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_followed_users_posts(request):
    # Obtendo o usuário atualmente autenticado
    user = request.user

    # Obtendo os IDs dos usuários seguidos pelo usuário atual
    followed_user_ids = user.follows.all().values_list('id', flat=True)

    # Filtrando os posts dos usuários seguidos
    posts = Post.objects.filter(user_id__in=followed_user_ids)

    # Ordenando os posts do mais novo para o mais antigo
    posts = posts.order_by('-created_at')

    # Aplicando paginação aos resultados
    paginator = PostPagination()
    result_page = paginator.paginate_queryset(posts, request)

    # Serializando os posts
    serializer = PostSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    # Obtendo o usuário atualmente autenticado
    user = request.user

    # Obtendo os dados do corpo da solicitação
    body = request.data.get('body', None)
    image = request.data.get('image', None)
    quoted_post_id = request.data.get('quoted_post_id', None)

    if body is None:
        return Response({"message": "The post body was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Criando o post
    if quoted_post_id:
        try:
            quoted_post = Post.objects.get(id=quoted_post_id)
        except Post.DoesNotExist:
            return Response({"message": "Quoted post not found."}, status=status.HTTP_404_NOT_FOUND)
        
        post = Post.objects.create(user=user, body=body, quoted_post=quoted_post)
    else:
        post = Post.objects.create(user=user, body=body)

    # Se uma imagem foi fornecida, atribua-a ao post
    if image:
        post.image = image
        post.save()

    # Serializando o post criado para retornar todas as informações, incluindo a quoted_post
    serializer = PostSerializer(post)

    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile_photo(request):
    # Obtendo o usuário atualmente autenticado
    user = request.user

    # Verificando se a solicitação inclui uma imagem
    if 'profile_photo' not in request.FILES:
        return Response({"message": "No profile photo provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Atualizando a foto de perfil do usuário
    user.profile_photo = request.FILES['profile_photo']
    user.save()

    return Response({"message": "Profile photo updated successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_banner(request):
    # Obtendo o usuário atualmente autenticado
    user = request.user

    # Verificando se a solicitação inclui uma imagem
    if 'banner' not in request.FILES:
        return Response({"message": "No banner provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Atualizando a foto de perfil do usuário
    user.banner = request.FILES['banner']
    user.save()

    return Response({"message": "banner updated successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request):
    # Obtendo o usuário atualmente autenticado
    user = request.user

    # Obtendo o ID do post a ser curtido ou descurtido do corpo da solicitação
    post_id = request.data.get('post_id', None)

    if post_id is None:
        return Response({"message": "The post ID was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Obtendo o post pelo ID fornecido
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"message": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    if user in post.likes.all():
        # Se o usuário já curtiu o post, remova o like
        post.likes.remove(user)
        action = "unliked"
    else:
        # Se o usuário não curtiu o post, adicione o like
        post.likes.add(user)
        action = "liked"

    # Retorna uma mensagem informando se o post foi curtido ou descurtido
    return Response({"message": f"Post {action} successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_bio(request):
    # Obtendo o usuário atualmente autenticado
    user = request.user

    # Obtendo a nova bio do corpo da solicitação
    new_bio = request.data.get('bio', None)

    if new_bio is None:
        return Response({"message": "The bio was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Atualizando a bio do usuário
    user.bio = new_bio
    user.save()

    return Response({"message": "Bio updated successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_post(request):
    # Obtendo o usuário atualmente autenticado
    user = request.user

    # Obtendo o ID do post a ser deletado do corpo da solicitação
    post_id = request.data.get('post_id', None)

    if post_id is None:
        return Response({"message": "The post ID was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Obtendo o post pelo ID fornecido
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"message": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    # Verificando se o usuário tem permissão para deletar o post
    if user != post.user:
        return Response({"message": "You do not have permission to delete this post."}, status=status.HTTP_403_FORBIDDEN)

    # Deletando o post
    post.delete()

    return Response({"message": "Post deleted successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_post(request):
    # Obtendo o usuário atualmente autenticado
    user = request.user

    # Obtendo os dados do corpo da solicitação
    post_id = request.data.get('post_id', None)
    body = request.data.get('body', None)
    image = request.data.get('image', None)

    if post_id is None:
        return Response({"message": "The post ID was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Obtendo o post pelo ID fornecido
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"message": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    # Verificando se o usuário é o autor do post
    if user != post.user:
        return Response({"message": "You do not have permission to edit this post."}, status=status.HTTP_403_FORBIDDEN)

    # Atualizando os campos do post
    if body:
        post.body = body
    if image == "same":
        # Mantendo a mesma imagem do post
        pass
    elif image is not None:
        post.image = image
    elif 'image' not in request.FILES:
        # Se nenhum novo arquivo de imagem for enviado, remover a imagem existente do post
        post.image = None

    # Marcando o post como editado
    post.edited = True

    # Atualizando o timestamp de edição
    post.created_at = timezone.now()

    # Salvando as alterações no post
    post.save()

    # Serializando o post atualizado
    serializer = PostSerializer(post)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_posts(request, search_text=None):
    # Obtendo todos os posts
    posts = Post.objects.all()

    if search_text:
        # Filtrando os posts pelo trecho de texto fornecido
        posts = posts.filter(body__icontains=search_text)

    # Ordenando os posts do mais novo para o mais antigo
    posts = posts.order_by('-created_at')

    # Aplicar paginação aos resultados
    paginator = PostPagination()
    result_page = paginator.paginate_queryset(posts, request)

    # Serializando os posts
    serializer = PostSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request, search_text=None):
    # Obtendo todos os usuários
    users = UserAccount.objects.all()

    if search_text:
        # Filtrando os usuários pelo nome de usuário e nome real
        users = users.filter(Q(username__icontains=search_text) | Q(name__icontains=search_text))

    # Removendo usuários duplicados
    users = users.distinct()

    # Aplicar paginação aos resultados
    paginator = PostPagination()  # Aqui você precisa ajustar para a sua classe de paginação de usuário, se houver uma diferente.
    result_page = paginator.paginate_queryset(users, request)

    # Serializando os usuários
    serializer = SearchedUsersSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_name(request):
    # Obtendo o usuário atualmente autenticado
    user = request.user

    # Obtendo o novo nome do corpo da solicitação
    new_name = request.data.get('name', None)

    if new_name is None:
        return Response({"message": "The name was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Atualizando o nome do usuário
    user.name = new_name
    user.save()

    return Response({"message": "Name updated successfully."}, status=status.HTTP_200_OK)
