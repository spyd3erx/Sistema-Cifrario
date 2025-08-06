from rest_framework import viewsets, permissions
from serviciosocial.models import HorasRegistradas
from serviciosocial.serializers import HorasSupervisorSerializer
from django.db.models import Q

class HorasSupervisorViewSet(viewsets.ModelViewSet):
    serializer_class = HorasSupervisorSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'patch']

    def get_queryset(self):
        supervisor = self.request.user.supervisor
        return HorasRegistradas.objects.filter(
            servicio_social__supervisor_servicio_social__supervisor=supervisor
        )