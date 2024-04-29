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
from PIL import Image
from io import BytesIO
import io


def reduce_image_quality(image, max_size=(1024, 1024)):
    # Checking the format of the image
    format_lower = image.name.lower()
    if not (format_lower.endswith('.jpg') or format_lower.endswith('.jpeg') or format_lower.endswith('.png')):
        raise ValueError("Unsupported image format. Only JPEG and PNG formats are supported.")

    # Open the image using Pillow
    img = Image.open(image)

    # Redimensionar a imagem mantendo a proporção original
    img.thumbnail(max_size)

    # Resize the image while maintaining the original aspect ratio
    img_buffer = io.BytesIO()

    # Save the resized image to the byte buffer
    img.save(img_buffer, format=img.format)

    # Move the cursor of the byte buffer to the beginning
    img_buffer.seek(0)

    return img_buffer

def resize_profile_photo(image):
    # Open the image using Pillow
    img = Image.open(image)

    # Get the original dimensions of the image
    width, height = img.size

    # Calculate the final dimensions of the resized image
    if width > height:
        # If the width is greater than the height, resize the image to have a height of 265px
        new_width = int((265 / height) * width)
        new_height = 265
    else:
        # If the height is greater than the width, resize the image to have a width of 265px
        new_width = 265
        new_height = int((265 / width) * height)

    # Resize the image while maintaining the original aspect ratio
    resized_img = img.resize((new_width, new_height))

    # Create a new image with a white background and dimensions of 265x265 pixels
    background = Image.new('RGB', (265, 265), (255, 255, 255))

    # Calculate the centering coordinates to paste the resized image onto the white background image
    x_offset = (265 - new_width) // 2
    y_offset = (265 - new_height) // 2

    # Paste the resized image onto the white background image
    background.paste(resized_img, (x_offset, y_offset))

    return background

def resize_banner(image_file):
    # Open the image using Pillow
    img = Image.open(image_file)

    # Calculate the width and height proportions of the original image
    width_ratio = 1024 / img.width
    height_ratio = 512 / img.height

    # Calculate the maximum scale factor to ensure maximum content preservation
    scale_factor = max(width_ratio, height_ratio)

    # Resize the image according to the maximum scale factor
    new_width = int(img.width * scale_factor)
    new_height = int(img.height * scale_factor)
    resized_img = img.resize((new_width, new_height))

    # Create a new image with a white background and dimensions of 1024x576 pixels
    background = Image.new('RGB', (1024, 512), (255, 255, 255))

    # Calculate the centering coordinates to paste the resized image onto the white background image
    x_offset = (1024 - new_width) // 2
    y_offset = (512 - new_height) // 2

    # Paste the resized image onto the white background image
    background.paste(resized_img, (x_offset, y_offset))

    # Create a byte buffer to store the resulting image
    output_buffer = io.BytesIO()

    # Save the resulting image to the byte buffer
    background.save(output_buffer, format='JPEG')

    # Move the cursor of the byte buffer to the beginning
    output_buffer.seek(0)

    return output_buffer

class UserDetailView(RetrieveAPIView):
    queryset = UserAccount.objects.all()
    serializer_class = CustomUserSerializer

    def get_object(self):
        user_id = self.kwargs['pk']
        return self.get_queryset().get(pk=user_id)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request):
    # Getting the currently authenticated user
    user_to_follow = request.user

    # Getting the user ID to be followed from the request body
    user_to_be_followed_id = request.data.get('user_to_be_followed_id', None)

    if user_to_be_followed_id is None:
        return Response({"message": "The user ID to be followed was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Getting the user to be followed from the provided ID
        user_to_be_followed = UserAccount.objects.get(id=user_to_be_followed_id)
    except UserAccount.DoesNotExist:
        return Response({"message": "User to be followed not found."}, status=status.HTTP_404_NOT_FOUND)

    # Adding the user to be followed to the follows field of the following user
    user_to_follow.follows.add(user_to_be_followed)

    return Response({"message": "User followed successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_user(request):
    # Getting the currently authenticated user
    user_to_follow = request.user

    # Getting the ID of the user to unfollow from the request body
    user_to_be_unfollowed_id = request.data.get('user_to_be_unfollowed_id', None)

    if user_to_be_unfollowed_id is None:
        return Response({"message": "The user ID to be unfollowed was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Getting the user to unfollow from the provided ID
        user_to_be_followed = UserAccount.objects.get(id=user_to_be_unfollowed_id)
    except UserAccount.DoesNotExist:
        return Response({"message": "User to be unfollowed not found."}, status=status.HTTP_404_NOT_FOUND)

    # Removing the user to unfollow from the follows field of the following user
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
        # If a user ID is provided in the URL, filter the posts by that user
        posts = Post.objects.filter(user_id=user_id)
    else:
        # If no user ID is provided in the URL, return all posts
        posts = Post.objects.all()

    # Sort the posts from newest to oldest
    posts = posts.order_by('-created_at')

    # Apply pagination to the results
    paginator = PostPagination()
    result_page = paginator.paginate_queryset(posts, request)

    # Serializing the posts
    serializer = PostSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_followed_users_posts(request):
    # Getting the currently authenticated user
    user = request.user

    # Getting the IDs of users followed by the current user
    followed_user_ids = user.follows.all().values_list('id', flat=True)

    # Filtering posts from followed users
    posts = Post.objects.filter(user_id__in=followed_user_ids)

    # Sorting posts from newest to oldest
    posts = posts.order_by('-created_at')

    # Applying pagination to the results
    paginator = PostPagination()
    result_page = paginator.paginate_queryset(posts, request)

    # Serializing the posts
    serializer = PostSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    # Getting the currently authenticated user
    user = request.user

    # Getting data from the request body
    body = request.data.get('body', None)
    image = request.data.get('image', None)
    quoted_post_id = request.data.get('quoted_post_id', None)

    if body is None:
        return Response({"message": "The post body was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Creating the post
    if quoted_post_id:
        try:
            quoted_post = Post.objects.get(id=quoted_post_id)
        except Post.DoesNotExist:
            return Response({"message": "Quoted post not found."}, status=status.HTTP_404_NOT_FOUND)
        
        post = Post.objects.create(user=user, body=body, quoted_post=quoted_post)
    else:
        post = Post.objects.create(user=user, body=body)

    # If an image is provided, assign it to the post
    if image:
        # Reducing the image quality
        reduced_image = reduce_image_quality(image)
        
        # Serializing the created post to return all information, including the quoted_post
        post.image.save(image.name, reduced_image, save=False)
        post.save()

    # Serializando o post criado para retornar todas as informações, incluindo a quoted_post
    serializer = PostSerializer(post)

    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile_photo(request):
    # Getting the currently authenticated user
    user = request.user

    # Checking if the request includes an image
    if 'profile_photo' not in request.FILES:
        return Response({"message": "No profile photo provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Getting the uploaded image
    profile_photo = request.FILES['profile_photo']

    # Reducing the image quality
    reduced_image = reduce_image_quality(profile_photo)

    # Cropping the image to make it square
    cropped_image = resize_profile_photo(reduced_image)

    # Saving the bytes from the temporary file to the profile_photo field
    temp_buffer = BytesIO()
    cropped_image.save(temp_buffer, format='JPEG')
    temp_buffer.seek(0)

    # Salvando os bytes do arquivo temporário no campo profile_photo
    user.profile_photo.save(profile_photo.name, temp_buffer, save=True)

    return Response({"message": "Profile photo updated successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_banner(request):
    # Getting the currently authenticated user
    user = request.user

    # Checking if the request includes an image
    if 'banner' not in request.FILES:
        return Response({"message": "No banner provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Getting the image file from the request
    banner_file = request.FILES['banner']

    # Reducing the image quality
    reduced_image = reduce_image_quality(banner_file)

    # Resizing the banner to 1024x576px
    resized_banner = resize_banner(reduced_image)

    # Saving the resized image as the user's banner
    user.banner.save(banner_file.name, resized_banner, save=True)

    return Response({"message": "Banner updated successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request):
    # Getting the currently authenticated user
    user = request.user

    # Getting the ID of the post to be liked or unliked from the request body
    post_id = request.data.get('post_id', None)

    if post_id is None:
        return Response({"message": "The post ID was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Getting the post by the provided ID
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"message": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    if user in post.likes.all():
        # If the user has already liked the post, remove the like
        post.likes.remove(user)
        action = "unliked"
    else:
        # If the user hasn't liked the post, add the like
        post.likes.add(user)
        action = "liked"

    # Return a message indicating whether the post was liked or unliked
    return Response({"message": f"Post {action} successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_bio(request):
    # Getting the currently authenticated user
    user = request.user

    # Getting the new bio from the request body
    new_bio = request.data.get('bio', None)

    if new_bio is None:
        return Response({"message": "The bio was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Updating the user's bio
    user.bio = new_bio
    user.save()

    return Response({"message": "Bio updated successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_post(request):
    # Getting the currently authenticated user
    user = request.user

    # Getting the ID of the post to be deleted from the request body
    post_id = request.data.get('post_id', None)

    if post_id is None:
        return Response({"message": "The post ID was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Getting the post by the provided ID
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"message": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    # Checking if the user has permission to delete the post
    if user != post.user:
        return Response({"message": "You do not have permission to delete this post."}, status=status.HTTP_403_FORBIDDEN)

    # Deleting the post
    post.delete()

    return Response({"message": "Post deleted successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_post(request):
    # Getting the currently authenticated user
    user = request.user

    # Getting data from the request body
    post_id = request.data.get('post_id', None)
    body = request.data.get('body', None)
    image = request.data.get('image', None)

    if post_id is None:
        return Response({"message": "The post ID was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Getting the post by the provided ID
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"message": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    # Checking if the user is the author of the post
    if user != post.user:
        return Response({"message": "You do not have permission to edit this post."}, status=status.HTTP_403_FORBIDDEN)

    # Updating the post fields
    if body:
        post.body = body
    if image == "same":
        # Keeping the same post image
        pass
    elif image is not None:
        # Reducing the image quality
        reduced_image = reduce_image_quality(image)
        
        # Saving the processed image to the image field of the Post model
        post.image.save(image.name, reduced_image, save=False)
    elif 'image' not in request.FILES:
        # If no new image file is sent, remove the existing image from the post
        post.image = None

    # Marking the post as edited
    post.edited = True

    # Updating the edit timestamp
    post.created_at = timezone.now()

    # Saving the changes to the post
    post.save()

    # Serializing the updated post
    serializer = PostSerializer(post)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_posts(request, search_text=None):
    # Getting all posts
    posts = Post.objects.all()

    if search_text:
        # Filtering posts by the provided text snippet
        posts = posts.filter(body__icontains=search_text)

    # Sorting posts from newest to oldest
    posts = posts.order_by('-created_at')

    # Applying pagination to the results
    paginator = PostPagination()
    result_page = paginator.paginate_queryset(posts, request)

    # Serializing the posts
    serializer = PostSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request, search_text=None):
    # Getting all users
    users = UserAccount.objects.all()

    if search_text:
        # Filtering users by username and real name
        users = users.filter(Q(username__icontains=search_text) | Q(name__icontains=search_text))

    # Removing duplicate users
    users = users.distinct()

    # Applying pagination to the results
    paginator = PostPagination()  # Aqui você precisa ajustar para a sua classe de paginação de usuário, se houver uma diferente.
    result_page = paginator.paginate_queryset(users, request)

    # Serializing the users
    serializer = SearchedUsersSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_name(request):
    # Getting the currently authenticated user
    user = request.user

    # Getting the new name from the request body
    new_name = request.data.get('name', None)

    if new_name is None:
        return Response({"message": "The name was not provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Updating the user's name
    user.name = new_name
    user.save()

    return Response({"message": "Name updated successfully."}, status=status.HTTP_200_OK)
