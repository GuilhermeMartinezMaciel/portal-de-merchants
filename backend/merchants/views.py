from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Merchant, MerchantStatus, MerchantEvent
from .serializers import MerchantSerializer

class MerchantViewSet(viewsets.ModelViewSet):
    # Otimização com prefetch_related para carregar a timeline sem gerar o problema N+1 queries
    queryset = Merchant.objects.prefetch_related('timeline').all()
    serializer_class = MerchantSerializer

    # Filtro por status na listagem geral (Requisito 3 do teste)
    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset
    @action(detail=True, methods=['post'], url_path='send-to-analysis')
    @transaction.atomic
    def send_to_analysis(self, request, pk=None):
        merchant = self.get_object()
        
        # Regra de negócio: Só vai para análise se estiver em draft
        if merchant.status != MerchantStatus.DRAFT:
            return Response(
                {"error": "O merchant só pode ser enviado para análise se estiver em status 'draft'."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        merchant.status = MerchantStatus.PENDING_ANALYSIS
        merchant.save()
        
        # Cria o evento na linha do tempo
        MerchantEvent.objects.create(merchant=merchant, title="Merchant enviado para análise")
        
        serializer = self.get_serializer(merchant)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='approve')
    @transaction.atomic
    def approve(self, request, pk=None):
        merchant = self.get_object()
        
        # Regra de negócio: Só pode ser aprovado se estiver em pending_analysis
        if merchant.status != MerchantStatus.PENDING_ANALYSIS:
            return Response(
                {"error": "Somente merchants com status 'pending_analysis' podem ser aprovados."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        merchant.status = MerchantStatus.APPROVED
        merchant.save()
        
        # Cria o evento na linha do tempo
        MerchantEvent.objects.create(merchant=merchant, title="Merchant aprovado")
        
        serializer = self.get_serializer(merchant)
        return Response(serializer.data, status=status.HTTP_200_OK)
    @action(detail=True, methods=['post'], url_path='reject')
    @transaction.atomic
    def reject(self, request, pk=None):
        merchant = self.get_object()
        motivo = request.data.get('motivo')
        
        # Regras de negócio e validações
        if merchant.status != MerchantStatus.PENDING_ANALYSIS:
            return Response(
                {"error": "Somente merchants com status 'pending_analysis' podem ser rejeitados."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        if not motivo or str(motivo).strip() == "":
            return Response(
                {"error": "O motivo da rejeição é obrigatório."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        merchant.status = MerchantStatus.REJECTED
        merchant.save()
        
        # Cria o evento contendo o motivo exigido
        MerchantEvent.objects.create(merchant=merchant, title=f"Merchant rejected: {motivo}")
        
        serializer = self.get_serializer(merchant)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='block')
    @transaction.atomic
    def block(self, request, pk=None):
        merchant = self.get_object()
        motivo = request.data.get('motivo')
        
        # Regras de negócio e validações
        if merchant.status != MerchantStatus.APPROVED:
            return Response(
                {"error": "Somente merchants aprovados (approved) podem ser bloqueados."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        if not motivo or str(motivo).strip() == "":
            return Response(
                {"error": "O motivo do bloqueio é obrigatório."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        merchant.status = MerchantStatus.BLOCKED
        merchant.save()
        
        # Cria o evento contendo o motivo exigido
        MerchantEvent.objects.create(merchant=merchant, title=f"Merchant bloqueado: {motivo}")
        
        serializer = self.get_serializer(merchant)
        return Response(serializer.data, status=status.HTTP_200_OK)