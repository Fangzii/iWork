from django.shortcuts import render

# Create your views here.
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# pylint: disable=no-member
from model.gpt import ManageGPT
from .models import Message

class ToAIModel(APIView):
    """选择AI 模型"""

    def post(self, request):
        content = request.data.get('content')
        chat_id = request.data.get('chat_id')
        template_id = request.data.get('template_id')
        user_id = request.data.get('user_id')
        params = request.data.get('params', [])


        if not user_id:
            token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[-1]
            from rest_framework.authtoken.models import Token
            user = Token.objects.get(key=token).user
            # 创建输入消息
            user_message = Message.objects.create(chat_id=chat_id, role=user.username, content=content, template_id=template_id)
            # GPT 相关处理
            manage = ManageGPT(user=user)
            gpt_class = manage.choose(template=user_message.template)
            gpt = gpt_class(msg=user_message.finally_content(params), user=user)
            ai_return = gpt.do()
            
            # 创建输出消息
            Message.objects.create(chat_id=chat_id, role='ai', content=ai_return, template_id=template_id)
            return Response({'content': ai_return, 'fee': gpt.fee_balance})
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)