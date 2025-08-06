from django.contrib import admin
from .models import CorreoEnviado

# Register your models here.
@admin.register(CorreoEnviado)
class CorreoEnviadoAdmin(admin.ModelAdmin):
    list_display = ('destinatario_nombre', 'destinatario_email', 'asunto', 'mensaje', 'tipo', 'enviado_en', 'exito')
    search_fields = ('destinatario_nombre', 'destinatario_email')
    list_filter = ('tipo', 'exito', 'enviado_en')
    ordering = ('-enviado_en',)
    list_per_page = 25
    list_max_show_all = 100

    def has_add_permission(self, request):
        return False