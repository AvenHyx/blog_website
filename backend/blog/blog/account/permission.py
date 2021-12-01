# by zhou_pp
from rest_framework import permissions
from .utils import get_userid_from_token


class IsOwnerOfCommentOrArticle(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        try:
            token = request.auth
            userid = get_userid_from_token(token)
            return obj.userId == userid
        except Exception as e:
            return False


