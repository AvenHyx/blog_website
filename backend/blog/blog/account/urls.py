# by zhou_pp
from django.urls import path, re_path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views
from rest_framework.authtoken import views as auth_views

urlpatterns = [
    re_path(r'^articles/$', views.ArticleList.as_view()),
    re_path(r'^articles/(?P<pk>[0-9]+)$', views.ArticleDetail.as_view()),
]

urlpatterns += [
    path(r'api-token-auth/', auth_views.obtain_auth_token)
]

urlpatterns = format_suffix_patterns(urlpatterns)