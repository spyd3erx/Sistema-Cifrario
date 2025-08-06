from django.contrib import admin
from django.utils.html import format_html
from .models import Estudiante

class EstadoFilter(admin.SimpleListFilter):
    title = 'Estado del Estudiante'
    parameter_name = 'estado_usuario'

    def lookups(self, request, model_admin):
        return [
            ('1', 'Activo'),
            ('0', 'Inactivo'),
        ]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(is_active=self.value())
        return queryset


# Register your models here.
@admin.register(Estudiante)
class EstudianteAdmin(admin.ModelAdmin):
    exclude = ('user', 'institucion', 'is_active', 'estado_asignacion')
    list_display = ('primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'identificacion', 'correo', 'telefono', 'estado_asignacion_coloreado', 'is_active')
    search_fields = ('primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'identificacion', 'correo')
    list_filter = (EstadoFilter, 'estado_asignacion')
    
    def estado_asignacion_coloreado(self, obj):
        """Muestra el estado de asignación con colores"""
        if obj.estado_asignacion == Estudiante.EstadoAsignacion.PENDIENTE:
            return format_html('<span style="color: green;">✓ {}</span>', obj.get_estado_asignacion_display())
        elif obj.estado_asignacion == Estudiante.EstadoAsignacion.ASIGNADO:
            return format_html('<span style="color: orange;">⚠ {}</span>', obj.get_estado_asignacion_display())
        return obj.get_estado_asignacion_display()
    
    estado_asignacion_coloreado.short_description = 'Estado Asignación'

    def delete_model(self, request, obj):
        # Si el estudiante tiene un usuario asociado, eliminarlo también
        if obj.user:
            obj.user.delete()
        else:
            obj.delete()

    def delete_queryset(self, request, queryset):
        # Para eliminación múltiple
        for obj in queryset:
            if obj.user:
                obj.user.delete()
            else:
                obj.delete()

    #list_per_page = 10