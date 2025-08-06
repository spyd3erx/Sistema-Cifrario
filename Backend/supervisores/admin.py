from django.contrib import admin
from .models import Supervisor

# Register your models here.
@admin.register(Supervisor)
class SupervisorAdmin(admin.ModelAdmin):
    exclude = ("user", "is_active")
    list_display = ('primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'telefono', 'correo')


