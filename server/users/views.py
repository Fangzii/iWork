# Create your views here.
from rest_framework import status
from rest_framework.views import APIView
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import authentication, permissions
from fee.models import Fee
# pylint: disable=no-member

class UserRegisterView(APIView):
    """用户注册视图"""
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            # 默认创建账单
            Fee.objects.create(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    """用户登录视图"""


    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # 调用Django内置的authenticate函数进行用户验证
        user = authenticate(username=username, password=password)

        if user:
            # 创建或更新用户token
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)



class MyProfileView(APIView):
    """我的用户信息视图"""
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]


    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
