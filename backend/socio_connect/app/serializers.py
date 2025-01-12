from rest_framework import serializers
from .models import Brand, AddProduct, Post, SchedulePost

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = [
            'id',
            'brand_name',
            'brand_logo',
            'brand_description',
            'brand_tone'
        ]

class AddProductSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.brand_name', read_only=True)
    
    class Meta:
        model = AddProduct
        fields = [
            'id',
            'product_name',
            'product_images',
            'description_about_product',
            'brand',
            'brand_name'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['product_images'] = self.context['request'].build_absolute_uri(instance.product_images.url) if instance.product_images else None
        return representation

class PostSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.brand_name', read_only=True)
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id',
            'brand',
            'brand_name',
            'product',
            'product_name',
            'post_images',
            'post_caption',
            'date_created'
        ]
        read_only_fields = ['date_created']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['post_images'] = self.context['request'].build_absolute_uri(instance.post_images.url) if instance.post_images else None
        return representation

class SchedulePostSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.brand_name', read_only=True)
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    
    class Meta:
        model = SchedulePost
        fields = [
            'id',
            'brand',
            'brand_name',
            'product',
            'product_name',
            'post_image',
            'post_caption',
            'post_type',
            'scheduled_date',
            'date_created'
        ]
        read_only_fields = ['date_created']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['post_image'] = self.context['request'].build_absolute_uri(instance.post_image.url) if instance.post_image else None
        return representation

class BrandDetailSerializer(serializers.ModelSerializer):
    products = AddProductSerializer(many=True, read_only=True)
    posts = PostSerializer(many=True, read_only=True)
    scheduled_posts = SchedulePostSerializer(many=True, read_only=True)

    class Meta:
        model = Brand
        fields = [
            'id',
            'brand_name',
            'brand_logo',
            'brand_description',
            'brand_tone',
            'products',
            'posts',
            'scheduled_posts'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['brand_logo'] = self.context['request'].build_absolute_uri(instance.brand_logo.url) if instance.brand_logo else None
        return representation

class AddProductDetailSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    posts = PostSerializer(many=True, read_only=True)
    scheduled_posts = SchedulePostSerializer(many=True, read_only=True)

    class Meta:
        model = AddProduct
        fields = [
            'id',
            'product_name',
            'product_images',
            'description_about_product',
            'brand',
            'posts',
            'scheduled_posts'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['product_images'] = self.context['request'].build_absolute_uri(instance.product_images.url) if instance.product_images else None
        return representation