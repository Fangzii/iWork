"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include

# 暂时都先放在这里
from users.views import UserRegisterView, UserLoginView, MyProfileView
from career.views import CareerViewSet
from template.views import CreateTemplateView
from rest_framework import routers
from message.view import ToAIModel
router = routers.DefaultRouter()
router.register(r'careers', CareerViewSet)

urlpatterns = [
    url(r'^jet/', include('jet.urls', 'jet')),
    url(r'^jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),  # Django JET dashboard URLS
    url(r'^admin/', admin.site.urls),
    url('api/register/', UserRegisterView.as_view()),
    url('api/login/', UserLoginView.as_view()),
    url('api/ai_chat/', ToAIModel.as_view()),
    url('api/myinfo/', MyProfileView.as_view()),
    path('api/', include(router.urls)),
    path('api/bind_career/<int:pk>/', CareerViewSet.as_view({'put': 'bind_user'})),
    path('api/get_chat/<int:pk>/', CareerViewSet.as_view({'get': 'get_chat'})),
    path('api/get_templates/<int:pk>/', CareerViewSet.as_view({'get': 'get_template'})),
    path('api/create_template/', CreateTemplateView.as_view())
]
