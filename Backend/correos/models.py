from django.db import models

# Create your models here.

class CorreoEnviado(models.Model):

    class TipoCorreo(models.TextChoices):
        CREDENCIALES = 'credenciales', 'Credenciales'
        NOTIFICACION = 'notificacion', 'Notificación'

    destinatario_nombre = models.CharField(max_length=100, null=False, blank=False)
    destinatario_email = models.EmailField(null=False, blank=False)
    asunto = models.CharField(max_length=255, null=False, blank=False)
    tipo = models.CharField(max_length=50, choices=TipoCorreo.choices, default=TipoCorreo.NOTIFICACION)
    enviado_en = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    exito = models.BooleanField(default=True)
    mensaje = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Correo Enviado'
        verbose_name_plural = 'Correos Enviados'

    def __str__(self):
        return self.destinatario_nombre
    
    