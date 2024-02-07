from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from career.models import Career

class Chat(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats')
    career = models.ForeignKey(Career, on_delete=models.CASCADE, related_name='chat_career')
    
    def __str__(self):
        return str(self.user)