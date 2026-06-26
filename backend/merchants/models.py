from django.db import models

class MerchantStatus(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    PENDING_ANALYSIS = 'pending_analysis', 'Pending Analysis'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'
    BLOCKED = 'blocked', 'Blocked'

class Merchant(models.Model):
    cnpj = models.CharField(max_length=14, unique=True, null=False, blank=False)
    razao_social = models.CharField(max_length=255, null=False, blank=False)
    nome_fantasia = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=False, blank=False)
    telefone = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, 
        choices=MerchantStatus.choices, 
        default=MerchantStatus.DRAFT
    )

    def __str__(self):
        return f"{self.razao_social} ({self.cnpj})"

class MerchantEvent(models.Model):
    merchant = models.ForeignKey(
        Merchant, 
        on_delete=models.CASCADE, 
        related_name='timeline'
    )
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.merchant.razao_social} - {self.title}"