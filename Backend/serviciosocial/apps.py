from django.apps import AppConfig


class ServiciosocialConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'serviciosocial'

    def ready(self):
        import serviciosocial.signals
