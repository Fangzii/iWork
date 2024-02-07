from rest_framework import serializers
from django.contrib.auth.models import User
from career.models import UserProfile
from career.serializers import CareerSerializer
from chat.models import Chat
from chat.serializers import ChatSerializer
from fee.models import Fee
# pylint: disable=no-member

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    career = serializers.SerializerMethodField()
    chat = serializers.SerializerMethodField()
    fee = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'career', 'chat', 'fee')

    def get_career(self, obj):
        try:
            user_career = UserProfile.objects.get(user=obj)
            serializer = CareerSerializer(user_career.career)
            return serializer.data
        except Exception as e:
            return 

    def get_chat(self, obj):
        try:
            user_career = UserProfile.objects.get(user=obj)
            user_chat = Chat.objects.get(user=obj, career=user_career.career)
            serializer = ChatSerializer(user_chat)
            return serializer.data
        except Exception as e:
            return

    def get_fee(self, obj):
        try:
            user_fee = Fee.objects.get(user=obj)
            return user_fee.amount
        except:
            return 0
