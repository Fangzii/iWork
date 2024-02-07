from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

# pylint: disable=no-member
class Career(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    # 其他字段

    def __str__(self):
        return str(self.name)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    career = models.ForeignKey(Career, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    def __str__(self):
        return self.user.username