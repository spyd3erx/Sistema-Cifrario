from django.urls import path
from .views import UsuarioMeView

app_name = 'usuarios'
urlpatterns = [
    path('usuario/me/', UsuarioMeView.as_view(), name='usuario_me'),
]
