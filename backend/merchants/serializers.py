from rest_framework import serializers
from .models import Merchant, MerchantEvent, MerchantStatus
from django.db import transaction

class MerchantEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MerchantEvent
        fields = ['title', 'created_at']

class MerchantSerializer(serializers.ModelSerializer):
    # Aninha a linha do tempo dentro do JSON do Merchant como uma lista de eventos
    timeline = MerchantEventSerializer(many=True, read_only=True)

    class Meta:
        model = Merchant
        fields = [
            'id', 'cnpj', 'razao_social', 'nome_fantasia', 
            'email', 'telefone', 'created_at', 'status', 'timeline'
        ]
        # Garante que o status e a data de criação não possam ser alterados diretamente via requisição
        read_only_fields = ['status', 'created_at']

    # Validação customizada para o campo 'cnpj'
    def validate_cnpj(self, value):
        # Remove pontos, traços e barras caso venham formatados do frontend
        cnpj_digits = ''.join(filter(str.isdigit, value))
        
        if len(cnpj_digits) != 14:
            raise serializers.ValidationError("O CNPJ deve conter exatamente 14 dígitos.")
            
        return cnpj_digits
    
    @transaction.atomic
    def create(self, validated_data):
        # Cria o Merchant no banco de dados. O status inicial já nasce como 'draft' pelo modelo.
        merchant = Merchant.objects.create(**validated_data)
        
        # Cria o primeiro evento na linha do tempo
        MerchantEvent.objects.create(
            merchant=merchant,
            title="Merchant criado"
        )
        return merchant

    def update(self, instance, validated_data):
        # Regra de Negócio: Um merchant só pode ter seus dados alterados se estiver em draft
        if instance.status != MerchantStatus.DRAFT:
            raise serializers.ValidationError(
                {"error": "Alterações cadastrais só são permitidas quando o merchant está em status 'draft'."}
            )
        return super().update(instance, validated_data)