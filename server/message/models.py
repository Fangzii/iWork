from django.db import models

# Create your models here.
# pylint: disable=no-member
from chat.models import Chat
from template.models import Template

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    content = models.CharField(max_length=10000)
    role = models.CharField(max_length=10)
    description = models.TextField(blank=True)
    def __str__(self):
        return f'{self.content}'

    def finally_content(self, params):
        """
        根据模版返回
        TODO params 后续需要存储
        """
        return self.template.complete_content(params)