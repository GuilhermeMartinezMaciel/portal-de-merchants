from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from merchants.views import MerchantViewSet

# Cria o roteador automático do DRF
router = DefaultRouter()

# Registra a nossa ViewSet no roteador sob o prefixo 'merchants'
router.register(r'merchants', MerchantViewSet, basename='merchant')

urlpatterns = [
    # Corrigido aqui: padrão correto do Django Admin
    path('admin/', admin.site.urls),
    
    # Inclui todas as rotas geradas pelo roteador sob o prefixo 'api/'
    path('api/', include(router.urls)),
]