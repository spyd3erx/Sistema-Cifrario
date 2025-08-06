from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from abc import ABC, abstractmethod


class SendMail(ABC):

    def __init__(self, instance, asunto, remitente=None) -> None:
        self.remitente = remitente
        self.instance = instance
        self.asunto = asunto
    
    @abstractmethod
    def send_email(self) -> None:
        pass

class SendMailCredenciales(SendMail):

    def __init__(self, instance, asunto, username, password) -> None:
        super().__init__(instance, asunto)
        self.username = username
        self.password = password
        self.institucion = instance.institucion

    def send_email(self) -> None:
        asunto = self.asunto
        remitente = self.remitente # usará DEFAULT_FROM_EMAIL
        destinatario_email = [self.instance.correo]

        # Renderizar plantilla HTML
        html_content = render_to_string('correos/credenciales/credenciales_estudiante.html', {
            'estudiante': self.instance,
            'institucion': self.institucion,
            'username': self.username,
            'password': self.password
        })

        # Email con soporte para HTML
        email_msg = EmailMultiAlternatives(asunto, '', remitente, destinatario_email)
        email_msg.attach_alternative(html_content, "text/html")
        email_msg.send()


class SendMailNotificacionAsignacionServicioSocialEstudiante(SendMail):

    def __init__(self, instance, asunto, body) -> None:
        super().__init__(instance, asunto)
        self.instance = instance
        self.asunto = asunto
        self.body = body

    def send_email(self) -> None:
        asunto = self.asunto
        remitente = self.remitente # usará DEFAULT_FROM_EMAIL
        
        # Si la instancia es una AsignacionServicioSocial, obtener el estudiante y el servicio social
        if hasattr(self.instance, 'estudiante'):
            # Es una AsignacionServicioSocial
            estudiante = self.instance.estudiante
            servicio_social = self.instance.servicio_social
            destinatario_email = [estudiante.correo]
        else:
            # Es un ServicioSocial directamente
            estudiante = None
            servicio_social = self.instance
            destinatario_email = [servicio_social.supervisor.correo]

        # Renderizar plantilla HTML
        html_content = render_to_string('correos/notificaciones/notificacion_asignacion_servicio_social_estudiante.html', {
            'usuario': estudiante,
            'servicio_social': servicio_social,
            'mensaje': self.body
        })

        # Email con soporte para HTML
        email_msg = EmailMultiAlternatives(asunto, '', remitente, destinatario_email)
        email_msg.attach_alternative(html_content, "text/html")
        email_msg.send()


class SendMailNotificacionAsignacionServicioSocialSupervisor(SendMail):

    def __init__(self, instance, asunto, body) -> None:
        super().__init__(instance, asunto)
        self.instance = instance
        self.asunto = asunto
        self.body = body

    def send_email(self) -> None:
        asunto = self.asunto
        remitente = self.remitente # usará DEFAULT_FROM_EMAIL
        destinatario_email = [self.instance.supervisor.correo]

        # Renderizar plantilla HTML
        html_content = render_to_string('correos/notificaciones/notificacion_asignacion_servicio_social_supervisor.html', {
            'supervisor': self.instance.supervisor,
            'servicio_social': self.instance,
            'mensaje': self.body
        })

        email_msg = EmailMultiAlternatives(asunto, '', remitente, destinatario_email)
        email_msg.attach_alternative(html_content, "text/html")
        email_msg.send()