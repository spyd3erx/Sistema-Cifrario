from django.db import models
from institucion.models import InstitucionEducativa
from estudiantes.models import Estudiante
from supervisores.models import Supervisor
from django.core.validators import MaxValueValidator, MinValueValidator
from cloudinary.models import CloudinaryField


class Entidad(models.Model): #Empresa, Organización, etc.

    class TipoInstitucion(models.TextChoices):
        EMPRESA = 'Empresa', 'Empresa'
        ORGANIZACION = 'Organización', 'Organización'
        GOBIERNO = 'Gobierno', 'Gobierno'
        INSTITUCION_EDUCATIVA = 'Institución Educativa', 'Institución Educativa'
        OTRO = 'Otro', 'Otro'
    
    class Area(models.TextChoices):
        AGRICULTURA = 'Agricultura', 'Agricultura'
        ALIMENTOS = 'Alimentos', 'Alimentos'
        SALUD = 'Salud', 'Salud'
        EDUCACION = 'Educación', 'Educación'
        TECNOLOGIA = 'Tecnología', 'Tecnología'
        FINANZAS = 'Finanzas', 'Finanzas'
        OTRO = 'Otro', 'Otro'

    nit = models.CharField(max_length=30, unique=True, null=False, blank=False)
    nombre = models.CharField(max_length=150, null=False, blank=False)
    tipo_institucion = models.CharField(max_length=50, choices=TipoInstitucion.choices, default=TipoInstitucion.INSTITUCION_EDUCATIVA, null=False, blank=False)
    area = models.CharField(max_length=50, choices=Area.choices, default=Area.OTRO, null=False, blank=False)
    telefono = models.CharField(max_length=10, null=False, blank=False)
    correo = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Entidad"
        verbose_name_plural = "Entidades"

    def __str__(self):
        return self.nombre

class ServicioSocial(models.Model):
    nombre = models.CharField(max_length=100, null=False, blank=False)
    entidad = models.ForeignKey(Entidad, on_delete=models.CASCADE)
    institucion = models.ForeignKey(InstitucionEducativa, on_delete=models.CASCADE, default=1)
    supervisor = models.ForeignKey(Supervisor, on_delete=models.CASCADE)
    horas_sociales = models.DecimalField(max_digits=5, decimal_places=2, validators=[MaxValueValidator(120), MinValueValidator(80)])
    fecha_inicio = models.DateField()
    fecha_culminacion = models.DateField()

    class Meta:
        verbose_name = "Servicio Social"
        verbose_name_plural = "Servicios Sociales"
        unique_together = ('entidad',)

    def __str__(self):
        return f"{self.nombre} - {self.entidad.nombre} - {self.horas_sociales} horas"

class AsignacionServicioSocial(models.Model):
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE)
    servicio_social = models.ForeignKey(ServicioSocial, on_delete=models.CASCADE)
    fecha_asignacion = models.DateField(auto_now_add=True)

    class Meta:
        verbose_name = "Asignación de Servicio Social"
        verbose_name_plural = "Asignaciones de Servicio Social"
        unique_together = ('estudiante',)
    
    def __str__(self):
        return f"{self.estudiante.primer_nombre} {self.estudiante.primer_apellido} - {self.servicio_social.nombre}"
    

class HorasRegistradas(models.Model):
   
    class Estado(models.TextChoices):
        PENDIENTE = 'pendiente', 'Pendiente'
        APROBADO = 'aprobado', 'Aprobado'
        RECHAZADO = 'rechazado', 'Rechazado'
    
    fecha = models.DateTimeField()
    horas_registradas = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0.5), MaxValueValidator(8)])
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PENDIENTE)
    evidencia = CloudinaryField('image', blank=True, null=True)
    observacion = models.TextField(blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE)
    servicio_social = models.ForeignKey(ServicioSocial, on_delete=models.CASCADE, null=True, blank=True)


    class Meta:
        verbose_name = "Horas Registradas"
        verbose_name_plural = "Horas Registradas"

    def __str__(self):
        return f"{self.estudiante.primer_nombre} {self.estudiante.primer_apellido} - {self.servicio_social.entidad.nombre}"

