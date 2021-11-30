# by zhou_pp
import base64
import json
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q


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


def get_userid_from_token(token):
    parts = token.split('.')
    if len(parts) != 3:
        raise Exception('invalid token')
    part = parts[1]

    output = part.replace('-', '+').replace('_', "/")
    if len(output) % 4 == 2:
        output += '=='
    elif len(output) % 4 == 3:
        output += '='
    else:
        raise Exception('Illegal base64url string!')

    payload = base64.b64decode(output)
    return json.loads(payload)['user_id']


