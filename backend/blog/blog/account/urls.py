# by zhou_pp
from django.urls import path, re_path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView, TokenObtainPairView
)

urlpatterns = [
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register', views.register, name='register'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('test', views.test, name='test'),
    path('upload/avatar', views.upload, name='upload'),
]


urlpatterns = format_suffix_patterns(urlpatterns)