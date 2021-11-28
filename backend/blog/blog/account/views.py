import uuid
import qiniu
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt

from qiniu import Auth

from .models import Articles
from .serializer import ArticleSerializer, UserSerializer


User = get_user_model()


class MyCustomBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(Q(username=username) | Q(email=username) |
                                    Q(phone=username))
            if user.check_password(password):
                return user
        except Exception as e:
            return None


@api_view(['POST'])
@permission_classes((AllowAny,))
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'businessCode': 1000, 'content': True})
        return Response({'businessCode': 1001, 'content': False,
                         'message': serializer.errors})


AUTH = Auth('Ii7G8QcRCj3bsNquTxr2RegKImtlvI5_8QRt7Ca7',
            'FYT9M2KChn_V3BJAWRnlkuFkbBqH4cThBuL8MtVh')
BUCKET_NAME = 'zhou-pp'
pre_url = 'http://img.aryazdp.cn/'


@api_view(['POST'])
@csrf_exempt
@permission_classes((AllowAny,))
def upload(request):
    key = f'{uuid.uuid1().hex}'
    token = AUTH.upload_token(BUCKET_NAME, key, 3600*24)
    photo = request.FILES.get('file')
    ret, info = qiniu.put_data(token, key, photo)
    if info.status_code == 200:
        full_url = ret['key']
        return Response({"businessCode": 1000, "content": pre_url + full_url})
    else:
        return Response({"businessCode": 1001, "content": info.exception})


class ArticleList(generics.ListCreateAPIView):
    queryset = Articles.objects.all()
    serializer_class = ArticleSerializer


class ArticleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Articles.objects.all()
    serializer_class = ArticleSerializer
