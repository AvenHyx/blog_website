import json
import uuid
import qiniu
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .permission import IsOwnerOfCommentOrArticle
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.contrib.auth import get_user_model
from qiniu import Auth

from .serializer import UserSerializer, CategorySerializer
from .models import Category

User = get_user_model()

AUTH = Auth('Ii7G8QcRCj3bsNquTxr2RegKImtlvI5_8QRt7Ca7',
            'FYT9M2KChn_V3BJAWRnlkuFkbBqH4cThBuL8MtVh')
BUCKET_NAME = 'zhou-pp'
pre_url = 'http://img.aryazdp.cn/'


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


@api_view(['POST'])
@permission_classes((AllowAny,))
def login(request):
    try:
        username = request.data['username']
        password = request.data['password']
        user = User.objects.get(Q(username=username) | Q(email=username) |
                                Q(phone=username))
        if user.check_password(password):
            return Response({"businessCode": 1000, "content": True})
        else:
            return Response({"businessCode": 1001, "content": False, "msg": "用户名或密码错误"})
    except Exception as e:
        return Response({"businessCode": 1001, "content": False, "msg": e})


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def logout(request):
    try:
        token = RefreshToken(request.data.get('refresh'))
        token.blacklist()
        return Response({"businessCode": 1000, "content": True})
    except Exception as e:
        return Response({"businessCode": 1001, "content": False})


@api_view(['POST'])
@permission_classes((IsAdminUser, ))
def add_tag(request):
    name = request.data['tagName']
    serializer = CategorySerializer(data={"name": name})
    if serializer.is_valid():
        serializer.save()
        return Response({'businessCode': 1000, 'content': True})
    return Response({'businessCode': 1001, 'content': False, 'msg': serializer.errors})


@api_view(['POST'])
@permission_classes((IsAdminUser, ))
def modify_tag(request):
    try:
        tag = Category.objects.get(pk=request.data['tagId'])
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'not exist'})
    name = request.data['tagName']
    serializer = CategorySerializer(tag, data={"name": name})
    if serializer.is_valid():
        serializer.save()
        return Response({'businessCode': 1000, 'content': True})
    return Response({'businessCode': 1001, 'content': False, 'msg': serializer.errors})


@api_view(['POST'])
@permission_classes((IsAdminUser, ))
def delete_tag_by_id(request):
    try:
        tag = Category.objects.get(pk=request.data['tagId'])
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'not exist'})
    tag.delete()
    return Response({'businessCode': 1000, 'content': True})


@api_view(['GET'])
@permission_classes((AllowAny,))
def get_tags(request):
    try:
        tag_list = Category.objects.all()
        serializer = CategorySerializer(tag_list, many=True)
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'not exist'})
    return Response({'businessCode': 1000, 'content': serializer.data})


@api_view(['GET'])
@permission_classes((AllowAny,))
def get_category_menu(request):
    try:
        pass
    except Exception:
        return Response({'businessCode': 1001, 'content': False})


