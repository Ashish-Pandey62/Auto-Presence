from django.contrib import admin
from django.utils.html import format_html
from .models import Brand, AddProduct, Post, SchedulePost

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['brand_name', 'display_logo', 'brand_tone', 'product_count']
    list_filter = ['brand_tone']
    search_fields = ['brand_name']
    readonly_fields = ['display_logo']

    def display_logo(self, obj):
        if obj.brand_logo:
            return format_html('<img src="{}" width="50" height="50" />', obj.brand_logo.url)
        return "No Logo"
    display_logo.short_description = 'Logo'

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Number of Products'

@admin.register(AddProduct)
class AddProductAdmin(admin.ModelAdmin):
    list_display = ['product_name', 'display_image', 'brand', 'post_count']
    list_filter = ['brand']
    search_fields = ['product_name', 'brand__brand_name']
    autocomplete_fields = ['brand']
    readonly_fields = ['display_image']

    def display_image(self, obj):
        if obj.product_images:
            return format_html('<img src="{}" width="50" height="50" />', obj.product_images.url)
        return "No Image"
    display_image.short_description = 'Product Image'

    def post_count(self, obj):
        return obj.posts.count()
    post_count.short_description = 'Number of Posts'

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['get_title', 'display_image', 'brand', 'product', 'date_created']
    list_filter = ['brand', 'date_created']
    search_fields = ['post_caption', 'brand__brand_name', 'product__product_name']
    autocomplete_fields = ['brand', 'product']
    readonly_fields = ['display_image', 'date_created']
    date_hierarchy = 'date_created'

    def display_image(self, obj):
        if obj.post_images:
            return format_html('<img src="{}" width="50" height="50" />', obj.post_images.url)
        return "No Image"
    display_image.short_description = 'Post Image'

    def get_title(self, obj):
        return f"Post for {obj.product.product_name}"
    get_title.short_description = 'Title'

@admin.register(SchedulePost)
class SchedulePostAdmin(admin.ModelAdmin):
    list_display = [
        'get_title', 
        'display_image', 
        'brand', 
        'product', 
        'product_name',
        'post_type',
        'scheduled_date',
        'posting_status'
    ]
    list_filter = ['post_type', 'scheduled_date', 'brand']
    search_fields = ['post_caption', 'brand__brand_name', 'product__product_name']
    autocomplete_fields = ['brand', 'product']
    readonly_fields = ['display_image', 'date_created']
    date_hierarchy = 'scheduled_date'
    ordering = ['scheduled_date']

    def display_image(self, obj):
        if obj.post_image:
            return format_html('<img src="{}" width="50" height="50" />', obj.post_image.url)
        return "No Image"
    display_image.short_description = 'Post Image'

    def get_title(self, obj):
        return f"Scheduled post for {obj.product.product_name}"
    get_title.short_description = 'Title'

    def posting_status(self, obj):
        from django.utils import timezone
        if obj.scheduled_date > timezone.now():
            return format_html(
                '<span style="color: orange;">Pending</span>'
            )
        return format_html(
            '<span style="color: green;">Ready to Post</span>'
        )
    posting_status.short_description = 'Status'

    class Media:
        css = {
            'all': ['admin/css/custom_admin.css']
        }