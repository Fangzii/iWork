from django.contrib import admin

# Register your models here.
from .models import Message

class MessageAdmin(admin.ModelAdmin):
    list_filter = ['role']

admin.site.register(Message, MessageAdmin)