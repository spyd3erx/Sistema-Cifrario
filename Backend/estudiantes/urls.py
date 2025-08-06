from rest_framework.routers import DefaultRouter
from .views import HorasEstudianteViewSet

router = DefaultRouter()
router.register(r'estudiante/horas', HorasEstudianteViewSet, basename='horas-estudiante')
urlpatterns = router.urls