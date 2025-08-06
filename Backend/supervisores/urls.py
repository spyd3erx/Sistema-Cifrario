from rest_framework.routers import DefaultRouter
from .views import HorasSupervisorViewSet

router = DefaultRouter()
router.register(r'supervisor/horas', HorasSupervisorViewSet, basename='horas-supervisor')
urlpatterns = router.urls
