from django.apps import AppConfig


class SupervisoresConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'supervisores'

    def ready(self):
        import supervisores.signals
