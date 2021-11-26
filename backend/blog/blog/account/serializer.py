# by zhou_pp
from rest_framework import serializers
from .models import Articles, User


class UserSerializer(serializers.ModelSerializer):
    cn_privilege = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'name', 'avatar', 'privilege', 'cn_privilege')

    def get_cn_privilege(self, obj):
        if obj.privilege == 1:
            return '管理员'
        elif obj.privilege == 2:
            return '博主'
        else:
            return ''


class ArticleSerializer(serializers.ModelSerializer):
    userId = UserSerializer()

    class Meta:
        model = Articles
        fields = '__all__'
        read_only_fields = ('id', 'time')


