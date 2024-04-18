from rest_framework.generics import RetrieveAPIView
from rest_framework import permissions
from .models import UserAccount
from .serializers import CustomUserSerializer

class UserDetailView(RetrieveAPIView):
    queryset = UserAccount.objects.all()
    serializer_class = CustomUserSerializer

    def get_object(self):
        user_id = self.kwargs['pk']
        return self.get_queryset().get(pk=user_id)
