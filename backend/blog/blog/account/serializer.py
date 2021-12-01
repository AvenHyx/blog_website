# by zhou_pp
from rest_framework import serializers
from .models import Articles, User, Category, Comments


class UserSerializer(serializers.ModelSerializer):
    cn_privilege = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username','password', 'avatar', 'is_superuser',
                  'cn_privilege', 'email', 'phone','date_joined', 'is_staff')
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def get_cn_privilege(self, obj):
        if obj.is_staff == 1:
            return '管理员'
        elif obj.is_staff == 0:
            return '博主'
        else:
            return ''


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'


