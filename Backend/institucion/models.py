from django.db import models
from cloudinary.models import CloudinaryField
from usuarios.models import Usuario
# Create your models here.
class Acudiente(models.Model):
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    telefono = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"

class InstitucionEducativa(models.Model):
    user = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='admin_profile')
    nombre = models.CharField(max_length=150, null=False, blank=False)
    nit = models.CharField(max_length=30, unique=True, null=False, blank=False)
    telefono = models.CharField(max_length=20, null=False, blank=False)
    direccion = models.CharField(max_length=150, null=False, blank=False)
    correo = models.EmailField()
    sitio_web = models.URLField(blank=True, null=True)
    logo_escudo = CloudinaryField('logo_escudo', null=False, blank=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Institución Educativa"
        verbose_name_plural = "Institución Educativa"

    def __str__(self):
        return self.nombre
    
