from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):

    class Role(models.TextChoices):
        ESTUDIANTE = 'estudiante', 'Estudiante'
        SUPERVISOR = 'supervisor', 'Supervisor'
        INSTITUCION = 'institucion', 'Institución'

    rol = models.CharField(max_length=20, choices=Role.choices)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Solo los de rol institución pueden tener acceso al admin
        if self.rol == self.Role.INSTITUCION:
            self.is_staff = True
        else:
            self.is_staff = False
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Si es un usuario estudiante, eliminar también el estudiante asociado
        if self.rol == self.Role.ESTUDIANTE and hasattr(self, 'estudiante'):
            self.estudiante.delete()
        elif self.rol == self.Role.SUPERVISOR and hasattr(self, 'supervisor'):
            self.supervisor.delete()
        super().delete(*args, **kwargs)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.username} ({self.rol})"
    
    
    def get_avatar_for_jazzmin(self):
        if self.rol == self.Role.INSTITUCION:
            try:
                if hasattr(self, 'admin_profile'):
                    institucion_perfil = self.admin_profile
                    if institucion_perfil and institucion_perfil.logo_escudo:
                        return institucion_perfil.logo_escudo.url
            except Exception:
                pass
        return None