from rest_framework import generics, permissions
from .serializers import UsuarioSerializer

class UsuarioMeView(generics.RetrieveAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
