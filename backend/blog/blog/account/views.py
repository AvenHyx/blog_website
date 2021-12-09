import json
import uuid
import qiniu
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from qiniu import Auth

from .serializer import UserSerializer, CategorySerializer, \
    ArticleSerializer, CommentSerializer, FollowSerializer
from .models import Category, Articles, Comments, Follow
from .utils import get_userid_from_token

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
    token = AUTH.upload_token(BUCKET_NAME, key, 3600 * 24)
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
        return Response({"businessCode": 1001, "content": False, "msg": str(e)})


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
@permission_classes((IsAdminUser,))
def add_tag(request):
    name = request.data['tagName']
    serializer = CategorySerializer(data={"name": name})
    if serializer.is_valid():
        serializer.save()
        return Response({'businessCode': 1000, 'content': True})
    return Response({'businessCode': 1001, 'content': False, 'msg': serializer.errors})


@api_view(['POST'])
@permission_classes((IsAdminUser,))
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
@permission_classes((IsAdminUser,))
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
        tag_list = Category.objects.all().order_by('id')
        serializer = CategorySerializer(tag_list, many=True)
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'not exist'})
    return Response({'businessCode': 1000, 'content': serializer.data})


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def add_blog(request):
    try:
        token = str(request.auth)
        title = request.data['blogTitle']
        content = request.data['blogContent']
        tagId = request.data['tagId']
        user_id = get_userid_from_token(token)
        serializer = ArticleSerializer(data={"userId": user_id, 'title': title, 'content': content, 'category': tagId})
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'invalid data'})
    if serializer.is_valid():
        serializer.save()
        return Response({'businessCode': 1000, 'content': True})
    return Response({'businessCode': 1001, 'content': False, 'msg': serializer.errors})


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def modify_blog(request):
    try:
        blog = Articles.objects.get(pk=request.data['blogId'])
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'not exist'})
    try:
        token = str(request.auth)
        user_id = get_userid_from_token(token)
        userId = User.objects.get(pk=user_id)
        if blog.userId == userId:  # 实际为username
            try:
                token = str(request.auth)
                title = request.data['blogTitle']
                content = request.data['blogContent']
                tagId = request.data['tagId']
                user_id = get_userid_from_token(token)
                serializer = ArticleSerializer(blog, data={"userId": user_id, 'title': title, 'content': content,
                                                           'category': tagId})
            except Exception:
                return Response({'businessCode': 1001, 'content': False, 'msg': 'invalid data'})
            if serializer.is_valid():
                serializer.save()
                return Response({'businessCode': 1000, 'content': True})
            return Response({'businessCode': 1001, 'content': False, 'msg': serializer.errors})
        else:
            return Response({'businessCode': 1001, 'content': False, 'msg': 'not permitted'})
    except Exception as e:
        return Response({'businessCode': 1001, 'content': False, 'msg': str(e)})


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def delete_blog_by_Id(request):
    try:
        blog = Articles.objects.get(pk=request.data['blogId'])
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'not exist'})
    try:
        token = str(request.auth)
        user_id = get_userid_from_token(token)
        userId = User.objects.get(pk=user_id)
        if blog.userId == userId:  # 实际为username
            blog.delete()
            return Response({'businessCode': 1000, 'content': True})
        else:
            return Response({'businessCode': 1001, 'content': False, 'msg': 'not permitted'})
    except Exception:
        return Response({'businessCode': 1001, 'content': False})


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def add_comment(request):
    try:
        token = str(request.auth)
        content = request.data['commentContent']
        replyUserId = request.data['replyUserId']
        replyUserName = request.data['replyUserName']
        articleId = request.data['articleId']
        user_id = get_userid_from_token(token)
        serializer = CommentSerializer(
            data={"userId": user_id, 'articleId': articleId, 'content': content, 'replyUserId': replyUserId,
                  'replyUserName': replyUserName})
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'invalid data'})
    if serializer.is_valid():
        serializer.save()
        return Response({'businessCode': 1000, 'content': True})
    return Response({'businessCode': 1001, 'content': False, 'msg': serializer.errors})


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def delete_comment_by_Id(request):
    try:
        comment = Comments.objects.get(pk=request.data['commentId'])
        article = Articles.objects.get(pk=comment.articleId)
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'not exist'})
    try:
        token = str(request.auth)
        user_id = get_userid_from_token(token)
        userId = User.objects.get(pk=user_id)  # 实际为username
        article_userId = article.userId
        if comment.userId == userId or article_userId == userId:
            serializer = CommentSerializer(
                data={"userId": comment.userId, 'articleId': comment.articleId, 'content': '评论已被删除',
                      'replyUserId': comment.replyUserId, 'replyUserName': comment.replyUserName})
            serializer.save()
            return Response({'businessCode': 1000, 'content': True})
        else:
            return Response({'businessCode': 1001, 'content': False, 'msg': 'not permitted'})
    except Exception:
        return Response({'businessCode': 1001, 'content': False})


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def modify_password(request):
    try:
        token = str(request.auth)
        user_id = get_userid_from_token(token)
        user = User.objects.get(pk=user_id)
        oldPwd = request.data['oldPwd']
        newPwd = request.data['newPwd']
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'not exist'})
    try:
        correct = user.check_password(oldPwd)
        if correct:
            try:
                password = make_password(newPwd)
                serializer = UserSerializer(user, data={'password': password, 'username': user.username})
            except Exception:
                return Response({'businessCode': 1005, 'content': False, 'msg': 'invalid data'})
            if serializer.is_valid():
                serializer.save()
                return Response({'businessCode': 1000, 'content': True})
            return Response({'businessCode': 1004, 'content': False, 'msg': serializer.errors})
        else:
            return Response({'businessCode': 1003, 'content': False, 'msg': 'not permitted'})
    except Exception as e:
        return Response({'businessCode': 1002, 'content': False, 'msg': str(e)})


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def modify_userinfo(request):
    try:
        token = str(request.auth)
        user_id = get_userid_from_token(token)
        user = User.objects.get(pk=user_id)
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'not exist'})
    try:
        username = request.data['userName']
        if user.username == username:
            try:
                email = request.data['email']
                avatar = request.data['avatar']
                mobile = request.data['mobile']
                serializer = UserSerializer(user, data={'username':user.username,'password':user.password, 'email': email, 'phone': mobile, 'avatar': avatar})
            except Exception:
                return Response({'businessCode': 1005, 'content': False, 'msg': 'invalid data'})
            if serializer.is_valid():
                serializer.save()
                return Response({'businessCode': 1000, 'content': True})
            return Response({'businessCode': 1004, 'content': False, 'msg': serializer.errors})
        else:
            return Response({'businessCode': 1003, 'content': False, 'msg': 'not permitted'})
    except Exception as e:
        return Response({'businessCode': 1002, 'content': False, 'msg': str(e)})


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def fork_user(request):
    try:
        token = str(request.auth)
        follower_id = get_userid_from_token(token)
        followed_id = request.data['userId']
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'not exist'})
    serializer = FollowSerializer(data={'followerId': follower_id, 'followedId': followed_id})
    if serializer.is_valid():
        serializer.save()
        return Response({'businessCode': 1000, 'content': True})
    return Response({'businessCode': 1004, 'content': False, 'msg': serializer.errors})


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def cancel_fork(request):
    try:
        token = str(request.auth)
        follower_id = get_userid_from_token(token)
        followed_id = request.data['userId']
        follow = Follow.objects.filter(Q(followerId=follower_id)&Q(followedId=followed_id))
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'not exist'})
    follow.delete()
    return Response({'businessCode': 1000, 'content': True})


@api_view(['GET'])
@permission_classes((AllowAny,))
def get_category_menu(request):
    try:
        pass
    except Exception:
        return Response({'businessCode': 1001, 'content': False})


@api_view(['GET'])
@permission_classes((AllowAny,))
def get_blog_detail(request):
    try:
        blog_id = request.data['blogId']
        blog = Articles.objects.get(pk=blog_id)
        author_id = blog.userId  # name
        author = User.objects.get(username=author_id)
        comment_list = Comments.objects.filter(articleId=blog_id).order_by('time')

        def map_function(x):
            c_user = User.objects.get(username=x.id)
            return {
                'userId': c_user.id,
                'userName': c_user.username,
                'userAvatar': c_user.avatar,
                'commentContent': c_user.content,
                'commentId': c_user.id,
                'commentDate': c_user.time,
                'replyUserName': c_user.replyUserName,
                'replyUserId': c_user.replyUserId
            }
        comment_list_json = list(map(map_function, comment_list))
        content = json.dumps({
            'blogId': blog.id,
            'blogTitle': blog.title,
            'blogContent': blog.content,
            'createTime': blog.time,
            'userId': author.id,
            'avatar': author.avatar,
            'userName': author.username,
            'commentList': comment_list_json
        })
        return Response({'businessCode': 1000, 'content': content})
    except Exception:
        return Response({'businessCode': 1001, 'content': False, 'msg': 'not exist'})


# @api_view(['GET'])
# @permission_classes((IsAuthenticated,))
# def get_user_info(request):
