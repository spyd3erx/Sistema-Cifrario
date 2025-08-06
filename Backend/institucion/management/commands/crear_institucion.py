from django.core.management.base import BaseCommand
from usuarios.models import Usuario
from institucion.models import InstitucionEducativa

class Command(BaseCommand):
    help = "Crea una institución con su usuario administrador"

    def add_arguments(self, parser):
        parser.add_argument('--nombre', type=str, required=True, help="Nombre de la institución")
        parser.add_argument('--usuario', type=str, required=True, help="Nombre de usuario para el admin")
        parser.add_argument('--email', type=str, required=True, help="Correo del usuario admin")
        parser.add_argument('--password', type=str, default="12345678", help="Contraseña del usuario admin")

    def handle(self, *args, **kwargs):
        nombre = kwargs['nombre']
        username = kwargs['usuario']
        email = kwargs['email']
        password = kwargs['password']

        if Usuario.objects.filter(username=username).exists():
            self.stdout.write(self.style.ERROR("⚠️ Ya existe un usuario con ese nombre"))
            return

        if Usuario.objects.filter(rol='institucion').exists():
            self.stdout.write(self.style.ERROR("⚠️ Ya existe un usuario de institución"))
            return

        if InstitucionEducativa.objects.exists():
            self.stdout.write(self.style.ERROR("⚠️ Ya existe una institución registrada"))
            return

        # Crear usuario
        user = Usuario.objects.create_user(
            username=username,
            first_name=nombre,
            email=email,
            password=password,
            rol='institucion',
            is_staff=True,
            is_superuser=True
        )

        # Crear institución
        institucion = InstitucionEducativa.objects.create(
            user=user,
            nombre=nombre,
            nit="123456789-0",
            telefono="6010000000",
            correo=email,
            sitio_web="https://institucion.edu.co",
            is_active=True
        )

        self.stdout.write(self.style.SUCCESS(f"✅ Institución '{nombre}' creada con usuario '{username}'"))
