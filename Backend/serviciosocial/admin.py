from django.contrib import admin
from django import forms
from django.core.exceptions import ValidationError
from .models import (Entidad, 
                     ServicioSocial,
                     AsignacionServicioSocial,
                     HorasRegistradas)
from estudiantes.models import Estudiante

# Register your models here.
@admin.register(Entidad)
class EntidadAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'nit', 'tipo_institucion', 'area', 'telefono', 'correo')

@admin.register(ServicioSocial)
class ServicioSocialAdmin(admin.ModelAdmin):
    exclude = ('institucion',)
    list_display = ('nombre', 'entidad', 'supervisor', 'horas_sociales', 'fecha_inicio', 'fecha_culminacion')

class AsignacionServicioSocialForm(forms.ModelForm):
    """Formulario personalizado para validar asignaciones de servicio social"""
    
    class Meta:
        model = AsignacionServicioSocial
        fields = '__all__'
    
    def clean(self):
        cleaned_data = super().clean()
        estudiante = cleaned_data.get('estudiante')
        
        if estudiante:
            self._validar_estado_estudiante(estudiante)
            self._validar_asignacion_existente(estudiante)
        
        return cleaned_data
    
    def _validar_estado_estudiante(self, estudiante):
        """Valida que el estudiante esté en estado pendiente"""
        if estudiante.estado_asignacion != 'pendiente':
            raise ValidationError(
                f'El estudiante {estudiante.primer_nombre} {estudiante.primer_apellido} '
                f'no está en estado pendiente. Estado actual: {estudiante.get_estado_asignacion_display()}'
            )
    
    def _validar_asignacion_existente(self, estudiante):
        """Valida que el estudiante no tenga asignación previa"""
        asignacion_existente = AsignacionServicioSocial.objects.filter(
            estudiante=estudiante
        ).first()
        
        if asignacion_existente and self.instance.pk != asignacion_existente.pk:
            raise ValidationError(
                f'El estudiante {estudiante.primer_nombre} {estudiante.primer_apellido} '
                f'ya tiene asignado el servicio social: {asignacion_existente.servicio_social.entidad.nombre}'
            )

@admin.register(AsignacionServicioSocial)
class AsignacionServicioSocialAdmin(admin.ModelAdmin):
    """Admin personalizado para gestionar asignaciones de servicio social"""
    
    form = AsignacionServicioSocialForm
    list_display = ('estudiante', 'servicio_social', 'fecha_asignacion', 'estado_estudiante')
    list_filter = ('fecha_asignacion', 'servicio_social__supervisor')
    search_fields = ('estudiante__primer_nombre', 'estudiante__primer_apellido', 'estudiante__identificacion')
    
    def estado_estudiante(self, obj):
        """Muestra el estado de asignación del estudiante"""
        if obj.estudiante:
            return obj.estudiante.get_estado_asignacion_display()
        return "N/A"
    estado_estudiante.short_description = 'Estado Estudiante'
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Filtra estudiantes disponibles para asignación"""
        if db_field.name == "estudiante":
            kwargs["queryset"] = self._get_estudiantes_disponibles()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    def _get_estudiantes_disponibles(self):
        """Obtiene estudiantes que pueden recibir asignaciones"""
        estudiantes_con_asignacion = AsignacionServicioSocial.objects.values_list(
            'estudiante_id', flat=True
        )
        
        return Estudiante.objects.filter(
            estado_asignacion='pendiente'
        ).exclude(
            id__in=estudiantes_con_asignacion
        )
    
    def save_model(self, request, obj, form, change):
        """Maneja el guardado de asignaciones"""
        if not change:  # Solo para nuevas asignaciones
            self._marcar_estudiante_como_asignado(obj.estudiante)
        
        super().save_model(request, obj, form, change)
    
    def _marcar_estudiante_como_asignado(self, estudiante):
        """Marca al estudiante como asignado"""
        estudiante.estado_asignacion = Estudiante.EstadoAsignacion.ASIGNADO
        estudiante.save(update_fields=['estado_asignacion'])
    
    def delete_model(self, request, obj):
        """Maneja la eliminación de asignaciones individuales"""
        estudiante = obj.estudiante
        super().delete_model(request, obj)
        self._actualizar_estado_estudiante_si_es_necesario(estudiante)
    
    def delete_queryset(self, request, queryset):
        """Maneja la eliminación múltiple de asignaciones"""
        estudiantes_afectados = self._obtener_estudiantes_afectados(queryset)
        super().delete_queryset(request, queryset)
        self._actualizar_estados_estudiantes(estudiantes_afectados)
    
    def _obtener_estudiantes_afectados(self, queryset):
        """Obtiene los estudiantes únicos afectados por la eliminación"""
        estudiantes_afectados = {}
        for asignacion in queryset:
            estudiante_id = asignacion.estudiante.id
            if estudiante_id not in estudiantes_afectados:
                estudiantes_afectados[estudiante_id] = asignacion.estudiante
        return estudiantes_afectados.values()
    
    def _actualizar_estados_estudiantes(self, estudiantes):
        """Actualiza el estado de múltiples estudiantes"""
        for estudiante in estudiantes:
            self._actualizar_estado_estudiante_si_es_necesario(estudiante)
    
    def _actualizar_estado_estudiante_si_es_necesario(self, estudiante):
        """Actualiza el estado del estudiante si no tiene otras asignaciones"""
        otras_asignaciones = AsignacionServicioSocial.objects.filter(
            estudiante=estudiante
        ).exists()
        
        if not otras_asignaciones:
            estudiante.estado_asignacion = Estudiante.EstadoAsignacion.PENDIENTE
            estudiante.save(update_fields=['estado_asignacion'])
    
    def get_queryset(self, request):
        """Optimiza el queryset con select_related"""
        return super().get_queryset(request).select_related(
            'estudiante', 'servicio_social', 'servicio_social__entidad', 'servicio_social__supervisor'
        )


@admin.register(HorasRegistradas)
class HorasRegistradasAdmin(admin.ModelAdmin):
    list_display = ('estudiante', 'servicio_social', 'fecha', 'horas_registradas', 'estado')

    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False