from rest_framework import generics
from rest_framework import permissions
from .permissions import IsOwnerOrReadOnly

from .models import Articles
from .serializer import ArticleSerializer


class ArticleList(generics.ListCreateAPIView):
    queryset = Articles.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class ArticleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Articles.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly)
