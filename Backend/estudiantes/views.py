from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from estudiantes.models import Estudiante
from serviciosocial.models import HorasRegistradas, AsignacionServicioSocial
from serviciosocial.serializers import HorasRegistradasSerializer
from rest_framework.exceptions import ValidationError


class HorasEstudianteViewSet(viewsets.ModelViewSet):
    serializer_class = HorasRegistradasSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        estudiante = Estudiante.objects.get(user=self.request.user)
        return HorasRegistradas.objects.filter(estudiante=estudiante).order_by('-id')

    def perform_create(self, serializer):
        estudiante = Estudiante.objects.get(user=self.request.user)

        # Obtener la asignación de servicio activo
        asignacion = AsignacionServicioSocial.objects.filter(
            estudiante=estudiante
        ).first()

        if not asignacion:
            raise ValidationError({"non_field_errors": ["El estudiante no tiene servicio asignado"]})

        serializer.save(
            estudiante=estudiante,
            servicio_social=asignacion.servicio_social
        )