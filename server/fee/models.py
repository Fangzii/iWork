from decimal import Decimal
from django.db import models

# Create your models here.
from django.contrib.auth.models import User


class Fee(models.Model):
    """
    费用模块
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0) # 默认为人民币

    def __str__(self):
        return f'{str(self.user)} | {self.amount} ¥'

    def recharge(self):
        """
        充值费用
        """

    def deduction(self, amount):
        """
        扣除费用
        """
        self.amount = self.amount - Decimal(amount)
        self.save()
        return self.amount

    @property
    def amount_to_count(self):
        """
        金额转为次数
        后续需要根据模型转换, 目前按 0.1元一次计算
        """
        return float(self.amount) * 10
