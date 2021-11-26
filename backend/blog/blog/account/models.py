from django.db import models


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    fatherId = models.IntegerField()

    class Meta:
        managed = True


class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=60)
    password = models.CharField(max_length=20)
    email = models.EmailField(null=True)
    phone = models.CharField(null=True, max_length=20)
    avatar = models.URLField()
    privilege = models.PositiveSmallIntegerField()

    class Meta:
        managed = True


class Articles(models.Model):
    id = models.AutoField(primary_key=True)
    time = models.DateTimeField(auto_now_add=True)
    userId = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=30)
    content = models.TextField(max_length=30000)
    upvoteNum = models.IntegerField()
    commentNum = models.IntegerField()
    readNum = models.IntegerField()
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)

    class Meta:
        managed = True


class Comments(models.Model):
    id = models.AutoField(primary_key=True)
    time = models.DateTimeField(auto_now_add=True)
    upvoteNum = models.IntegerField()
    userId = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    articleId = models.ForeignKey(Articles, on_delete=models.CASCADE)
    content = models.CharField(max_length=500)
    fatherId = models.IntegerField()

    class Meta:
        managed = True


class Follow(models.Model):
    id = models.AutoField(primary_key=True)
    followerId = models.ForeignKey(User, on_delete=models.CASCADE)
    followedId = models.IntegerField()

    class Meta:
        managed = True
