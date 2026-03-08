from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, AtlasActionViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'actions', AtlasActionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
