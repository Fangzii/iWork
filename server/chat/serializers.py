from rest_framework import serializers
from .models import Chat
from message.models import Message
from message.serializers import MessageSerializer

class ChatSerializer(serializers.ModelSerializer):
    message = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = '__all__'

    def get_message(self, chat):
        try:
            message = Message.objects.filter(chat=chat)
            return [MessageSerializer(item).data for item in message]
        except Exception as e:
            return []