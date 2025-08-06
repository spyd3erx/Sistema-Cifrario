# supervisores/models.py
from django.db import models
from usuarios.models import Usuario
from institucion.models import InstitucionEducativa

class Supervisor(models.Model):
    user = models.OneToOneField(Usuario, on_delete=models.CASCADE, null=True, blank=True)
    primer_nombre = models.CharField(max_length=100, null=False, blank=False)
    segundo_nombre = models.CharField(max_length=100, null=True, blank=True)
    primer_apellido = models.CharField(max_length=100, null=False, blank=False)
    segundo_apellido = models.CharField(max_length=100, null=True, blank=True)
    identificacion = models.CharField(max_length=100, null=False, blank=False, unique=True)
    correo = models.EmailField(null=False, blank=False)
    telefono = models.CharField(max_length=10, null=False, blank=False)
    institucion = models.ForeignKey(InstitucionEducativa, on_delete=models.CASCADE, null=False, blank=False, default=1)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Supervisor"
        verbose_name_plural = "Supervisores"

    def __str__(self):
        return f"{self.primer_nombre} {self.primer_apellido}"
