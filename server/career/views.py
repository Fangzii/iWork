from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Career, UserProfile
from .serializers import CareerSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from chat.models import Chat
from chat.serializers import ChatSerializer
from template.models import Template
from template.serializers import TemplateSerializer

# pylint: disable=no-member
class CareerViewSet(viewsets.ModelViewSet):
    queryset = Career.objects.all()
    serializer_class = CareerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        career = serializer.save()

        return Response({
            'career_id': career.id,
            'message': '职业创建成功',
        })

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({
            'career_id': instance.id,
            'message': '职业更新成功',
        })

    def bind_user(self, request, pk):
        career = self.get_object()
        user_id = request.data.get('user_id')

        if not user_id:
            token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[-1]
            user = Token.objects.get(key=token).user
            user_id = user.id

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({
                'message': '用户不存在',
            }, status=400)
        # 创建用户职业关系
        user_career, created = UserProfile.objects.get_or_create(user=user)
        user_career.career = career
        user_career.save()

        # 默认创建一个对话模型
        Chat.objects.get_or_create(user=user, career=career)





        return Response({
            'career_id': user_career.career.id,
            'user_id': user_career.user.id,
            'message': '用户职业绑定成功',
        })


    def get_chat(self,request, pk):
        career = self.get_object()

        token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[-1]
        user = Token.objects.get(key=token).user
        chat, created = Chat.objects.get_or_create(user=user, career=career)
        return Response(ChatSerializer(chat).data)


    def get_template(self, request, pk):
        career = self.get_object()
        template = Template.objects.filter(career=career)
        return Response(TemplateSerializer(template, many=True).data)