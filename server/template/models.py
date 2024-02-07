from django.db import models

import re
from career.models import Career
from django.contrib.auth.models import User

# Create your models here.
class Template(models.Model):
    name = models.CharField(max_length=100)
    key_words = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    content = models.CharField(max_length=1000)
    model = models.CharField(max_length=100, blank=True)

    career = models.ForeignKey(Career, on_delete=models.CASCADE, related_name='career')
    customize_users = models.ManyToManyField(User, related_name='customize_users', blank=True)




    def __str__(self):
        return str(self.name)

    def complete_content(self, param):
        """
        完整的输出
        拼接关键词和模版内容
        """
        text = self.content
        for value in param:
            text = re.sub(self.pattern, str(value), text, count=1)
        return text


    @property
    def get_key_words(self):
        """
        根据特殊字符过滤出需要的关键词
        {{参数}}
        """
        key_words = re.findall(self.pattern, self.content)
        return key_words

    @property
    def pattern(self):
        """
        模版规则
        """
        return r"{{(.*?)}}"