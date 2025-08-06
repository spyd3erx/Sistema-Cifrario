# estudiantes/models.py
from django.db import models
from usuarios.models import Usuario
from institucion.models import InstitucionEducativa
from institucion.models import Acudiente

class Estudiante(models.Model):

    class TipoIdentificacion(models.TextChoices):
        CC = 'CC', 'Cédula de Ciudadanía'
        CE = 'CE', 'Cédula de Extranjería'
        TI = 'TI', 'Tarjeta de Identidad'

    class EstadoAsignacion(models.TextChoices):
        PENDIENTE = 'pendiente', 'Pendiente'
        ASIGNADO = 'asignado', 'Asignado'

    user = models.OneToOneField(Usuario, on_delete=models.CASCADE, null=True, blank=True)
    primer_nombre = models.CharField(max_length=100, null=False, blank=False)
    segundo_nombre = models.CharField(max_length=100, null=True, blank=True)
    primer_apellido = models.CharField(max_length=100, null=False, blank=False)
    segundo_apellido = models.CharField(max_length=100, null=True, blank=True)
    correo = models.EmailField(unique=True, null=False, blank=False)
    tipo_identificacion = models.CharField(max_length=100, choices=TipoIdentificacion.choices, default=TipoIdentificacion.TI)
    identificacion = models.CharField(max_length=30, unique=True, null=False, blank=False)
    telefono = models.CharField(max_length=10, unique=True, null=False, blank=False)
    acudiente = models.ForeignKey(Acudiente, on_delete=models.SET_NULL, null=True, blank=True)
    institucion = models.ForeignKey(InstitucionEducativa, on_delete=models.CASCADE, default=1)
    estado_asignacion = models.CharField(max_length=20, choices=EstadoAsignacion.choices, default=EstadoAsignacion.PENDIENTE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Estudiante"
        verbose_name_plural = "Estudiantes"
        ordering = ['primer_apellido']

    def __str__(self):
        return f"{self.primer_nombre} {self.primer_apellido} {self.identificacion}"
    
    def puede_asignar_servicio_social(self):
        """Verifica si el estudiante puede recibir una asignación de servicio social"""
        return self.estado_asignacion == self.EstadoAsignacion.PENDIENTE
    
    def tiene_asignacion_servicio_social(self):
        """Verifica si el estudiante tiene una asignación de servicio social"""
        return hasattr(self, 'asignacionserviciosocial')
    
    def get_asignacion_servicio_social(self):
        """Obtiene la asignación de servicio social del estudiante"""
        if self.tiene_asignacion_servicio_social():
            return self.asignacionserviciosocial
        return None
    
    def marcar_como_asignado(self):
        """Marca al estudiante como asignado"""
        self.estado_asignacion = self.EstadoAsignacion.ASIGNADO
        self.save(update_fields=['estado_asignacion'])
    
    def marcar_como_pendiente(self):
        """Marca al estudiante como pendiente"""
        self.estado_asignacion = self.EstadoAsignacion.PENDIENTE
        self.save(update_fields=['estado_asignacion'])
