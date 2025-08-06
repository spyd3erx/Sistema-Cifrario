# estudiantes/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from estudiantes.models import Estudiante
from usuarios.models import Usuario
from django.utils.crypto import get_random_string
from correos.models import CorreoEnviado
from correos.send_mail import SendMailCredenciales
from utils.generate_user import generate_user


# Crear señal para crear usuario y enviar correo de credenciales
@receiver(post_save, sender=Estudiante)
def crear_usuario_estudiante(sender, instance, created, **kwargs):
    if created and not instance.user_id:
        username = generate_user(instance)
        email = instance.correo
        password = get_random_string(length=10)

        # Crear usuario
        user = Usuario.objects.create_user(
            username=username,
            email=email,
            password=password,
            rol=Usuario.Role.ESTUDIANTE,
            is_active=True
        )
        # Actualizar la instancia sin disparar la señal nuevamente
        Estudiante.objects.filter(id=instance.id).update(user=user)

        # Intentar enviar correo de credenciales
        try:
            send_mail = SendMailCredenciales(instance=instance,
                                             asunto="Tu cuenta de estudiante en el sistema de horas sociales - Cifrario",
                                             username=username,
                                             password=password)
            send_mail.send_email()

            CorreoEnviado.objects.create(
                destinatario_nombre=f"{instance.primer_nombre} {instance.primer_apellido} {instance.identificacion}",
                destinatario_email=email,
                asunto="Tu cuenta en el sistema de horas sociales - Cifrario",
                tipo=CorreoEnviado.TipoCorreo.CREDENCIALES,
                exito=True,
                mensaje="Correo enviado correctamente"
            )
        except Exception as e:
            # Registrar el correo enviado con error
            CorreoEnviado.objects.create(
                destinatario_nombre=f"{instance.primer_nombre} {instance.primer_apellido} {instance.identificacion}",
                destinatario_email=email,
                asunto="Tu cuenta en el sistema de horas sociales - Cifrario",
                tipo=CorreoEnviado.TipoCorreo.CREDENCIALES,
                exito=False,
                mensaje=str(e)
            )