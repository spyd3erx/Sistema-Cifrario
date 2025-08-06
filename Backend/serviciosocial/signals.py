from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AsignacionServicioSocial, ServicioSocial
from correos.send_mail import SendMailNotificacionAsignacionServicioSocialEstudiante, SendMailNotificacionAsignacionServicioSocialSupervisor
from correos.models import CorreoEnviado



@receiver(post_save, sender=AsignacionServicioSocial)
def enviar_notificacion_estudiante_asignacion_servicio_social(sender, instance, created, **kwargs):
    body = "¡Nos complace informarte que has sido asignado(a) al siguiente servicio social!"
    if created:
        try:
            # Enviar notificación al estudiante asignado
            SendMailNotificacionAsignacionServicioSocialEstudiante(instance, 'Asignación de Servicio Social - Cifrario', body).send_email()
            
            # Registrar el correo enviado
            CorreoEnviado.objects.create(
                destinatario_nombre=f"{instance.estudiante.primer_nombre} {instance.estudiante.primer_apellido} {instance.estudiante.identificacion}",
                destinatario_email=instance.estudiante.correo,
                asunto="Asignación de Servicio Social - Cifrario",
                tipo=CorreoEnviado.TipoCorreo.NOTIFICACION,
                exito=True,
                mensaje="Correo enviado correctamente"
            )
        except Exception as e:
            # Registrar el correo enviado con error
            CorreoEnviado.objects.create(
                destinatario_nombre=f"{instance.estudiante.primer_nombre} {instance.estudiante.primer_apellido} {instance.estudiante.identificacion}",
                destinatario_email=instance.estudiante.correo,
                asunto="Asignación de Servicio Social - Cifrario",
                tipo=CorreoEnviado.TipoCorreo.NOTIFICACION,
                exito=False,
                mensaje=str(e)
            )            

# Signal para notificar a todos los estudiantes cuando se actualiza un servicio social
@receiver(post_save, sender=ServicioSocial)
def notificar_estudiantes_servicio_social_actualizado(sender, instance, created, **kwargs):
    body = "¡Nos complace informarte que el servicio social ha sido actualizado!"
    if not created:  # Solo cuando se actualiza, no cuando se crea
        # Obtener todos los estudiantes asignados a este servicio social
        asignaciones = AsignacionServicioSocial.objects.filter(servicio_social=instance)
        
        for asignacion in asignaciones:
            try:
                # Enviar notificación al estudiante sobre la actualización
                SendMailNotificacionAsignacionServicioSocialEstudiante(asignacion, 'Actualización de Servicio Social - Cifrario', body).send_email()
                
                # Registrar el correo enviado
                CorreoEnviado.objects.create(
                    destinatario_nombre=f"{asignacion.estudiante.primer_nombre} {asignacion.estudiante.primer_apellido} {asignacion.estudiante.identificacion}",
                    destinatario_email=asignacion.estudiante.correo,
                    asunto="Actualización de Servicio Social - Cifrario",
                    tipo=CorreoEnviado.TipoCorreo.NOTIFICACION,
                    exito=True,
                    mensaje="Correo enviado correctamente"
                )
            except Exception as e:
                # Registrar el correo enviado con error
                CorreoEnviado.objects.create(
                    destinatario_nombre=f"{asignacion.estudiante.primer_nombre} {asignacion.estudiante.primer_apellido} {asignacion.estudiante.identificacion}",
                    destinatario_email=asignacion.estudiante.correo,
                    asunto="Actualización de Servicio Social - Cifrario",
                    tipo=CorreoEnviado.TipoCorreo.NOTIFICACION,
                    exito=False,
                    mensaje=str(e)
                )

@receiver(post_save, sender=ServicioSocial)
def enviar_notificacion_supervisor_servicio_social(sender, instance, created, **kwargs):
    body = "¡Nos complace informarte que has sido asignado como supervisor de un nuevo servicio social!"
    if created:
        try:
            # Enviar notificación al supervisor del servicio social
            SendMailNotificacionAsignacionServicioSocialSupervisor(instance, 'Asignación de Servicio Social - Cifrario', body).send_email()
            
            # Registrar el correo enviado al supervisor
            CorreoEnviado.objects.create(
                destinatario_nombre=f"{instance.supervisor.primer_nombre} {instance.supervisor.primer_apellido}",
                destinatario_email=instance.supervisor.correo,
                asunto="Nuevo Servicio Social Creado - Cifrario",
                tipo=CorreoEnviado.TipoCorreo.NOTIFICACION,
                exito=True,
                mensaje="Correo enviado correctamente"
            )
        except Exception as e:
            # Registrar el correo enviado con error
            CorreoEnviado.objects.create(
                destinatario_nombre=f"{instance.supervisor.primer_nombre} {instance.supervisor.primer_apellido}",
                destinatario_email=instance.supervisor.correo,
                asunto="Nuevo Servicio Social Creado - Cifrario",
                tipo=CorreoEnviado.TipoCorreo.NOTIFICACION,
                exito=False,
                mensaje=str(e)
            )