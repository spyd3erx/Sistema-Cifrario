# usuarios/admin.py
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import get_user_model

Usuario = get_user_model()

class RolFilter(admin.SimpleListFilter):
    title = 'Tipo de Usuario'
    parameter_name = 'tipo_usuario'

    def lookups(self, request, model_admin):
        # Excluir el rol 'institucion' de los filtros
        return [
            (Usuario.Role.ESTUDIANTE, 'Estudiante'),
            (Usuario.Role.SUPERVISOR, 'Supervisor'),
        ]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(rol=self.value())
        return queryset

class EstadoFilter(admin.SimpleListFilter):
    title = 'Estado del Usuario'
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

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'rol', 'is_active', 'is_staff')
    list_filter = (RolFilter, EstadoFilter)
    def has_module_permission(self, request):
        if request.user.is_authenticated and request.user.rol == Usuario.Role.INSTITUCION:
            return True
        return False
    
    def has_add_permission(self, request):
        # Si el usuario que se está creando es de rol 'institucion'
        # verificar si ya existe uno
        if request.method == 'POST':
            rol = request.POST.get('rol')
            if rol == Usuario.Role.INSTITUCION and Usuario.objects.filter(rol=Usuario.Role.INSTITUCION).exists():
                return False
        return super().has_add_permission(request)
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # Si ya existe un usuario de institución, deshabilitar esa opción
        if Usuario.objects.filter(rol=Usuario.Role.INSTITUCION).exists():
            form.base_fields['rol'].choices = [
                choice for choice in form.base_fields['rol'].choices 
                if choice[0] != Usuario.Role.INSTITUCION
            ]
        return form