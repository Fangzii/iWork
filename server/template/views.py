from rest_framework.views import APIView
from rest_framework.response import Response
from template.models import Template
from template.serializers import TemplateSerializer
# pylint: disable=no-member

class CreateTemplateView(APIView):
    """创建模版视图"""
    def post(self, request):
        name = request.data.get('name')
        content = request.data.get('content')
        description = request.data.get('description')
        career_id = request.data.get('career_id')
        is_public = request.data.get('is_public')
        
        template = Template.objects.create(name=name, content=content, description=description, career_id=career_id)
        # 非公开则添加当前用户至定制用户
        if is_public is False:
            # 根据token 转为user 对象
            token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[-1]
            from rest_framework.authtoken.models import Token
            user = Token.objects.get(key=token).user
            template.customize_users.add(user)
        serializer = TemplateSerializer(template)
        return Response(serializer.data)