from django.urls import path,include
from .views import BrandListCreateView, AddProductListCreateView, PostListCreateView,InstagramPostView ,SchedulePostAPIView, populate_festival_posts,get_festival_posts,clear_festival_posts
from rest_framework.routers import DefaultRouter




urlpatterns = [
    path('api/brands/', BrandListCreateView.as_view(), name='brand-list-create'),
    path('api/products/', AddProductListCreateView.as_view(), name='product-list-create'),
    path('api/posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('api/instagram/post/', InstagramPostView.as_view(), name='instagram-post'),
    path('api/scheduled-posts/', SchedulePostAPIView.as_view(), name='create-scheduled-post'),



    # FOR FESTIVE SCHEDULE PART:
    path('populate-posts/', populate_festival_posts, name='populate_festival_posts'),
    path('posts/', get_festival_posts, name='get_all_festival_posts'),
    path('posts/<str:festival>/', get_festival_posts, name='get_festival_posts'),
    path('clear-posts/', clear_festival_posts, name='clear_festival_posts'),
]
