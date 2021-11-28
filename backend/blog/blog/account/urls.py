# by zhou_pp
from django.urls import path, re_path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register', views.register, name='register'),
    # path('login', views.login, name='login'),
    path('upload/avatar', views.upload, name='upload'),
    re_path(r'^articles/$', views.ArticleList.as_view()),
    re_path(r'^articles/(?P<pk>[0-9]+)$', views.ArticleDetail.as_view()),
]


urlpatterns = format_suffix_patterns(urlpatterns)