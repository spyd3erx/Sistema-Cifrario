# instituciones/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import InstitucionEducativa, Acudiente


@admin.register(InstitucionEducativa)
class InstitucionAdmin(admin.ModelAdmin):
    exclude = ('is_active', 'user')
    list_display = ('nombre', 'sitio_web', 'nit', 'telefono', 'correo','direccion', 'logo_escudo_thumbnail')
    def has_add_permission(self, request):
        if InstitucionEducativa.objects.exists():
            return False  # Ya existe una, no se permite crear otra
        return super().has_add_permission(request)
    
    def has_delete_permission(self, request, obj=None):
        return False  # No se permite eliminar la institución
    
    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']  # Elimina la acción de eliminar múltiples
        return actions

    def logo_escudo_thumbnail(self, obj):
        if obj.logo_escudo:
            # Usa format_html para asegurar que el HTML se renderice y no se escape
            return format_html(
                '<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 50%;" />',
                obj.logo_escudo.url
            )
        return '-'
    
    logo_escudo_thumbnail.allow_tags = True 
    logo_escudo_thumbnail.short_description = 'Escudo'
@admin.register(Acudiente)
class AcudienteAdmin(admin.ModelAdmin):
    list_display = ('nombres', 'apellidos', 'telefono')
    search_fields = ('nombres', 'apellidos')