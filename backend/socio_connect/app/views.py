import os
import io
import sys
import requests
from rest_framework import generics
from .models import Brand, AddProduct, Post, SchedulePost
from .serializers import BrandSerializer, AddProductSerializer, PostSerializer,SchedulePostSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,viewsets
from rest_framework.decorators import action
from django.core.files.base import ContentFile


# base_path = r"C:\\Users\\mishr\\moyeMoye\\models\\genAndText.py"
# model_path = os.path.join(base_path, "models")

# # Add the model_path to sys.path
# sys.path.append(model_path)

import importlib.util

spec = importlib.util.spec_from_file_location("genAndText", "C:/Users/mishr/moyeMoye/models/untitled19.py")
genAndText = importlib.util.module_from_spec(spec)
spec.loader.exec_module(genAndText)

product_photo = genAndText.product_photo
festive_photo = genAndText.festive_photo
add_smart_text = genAndText.add_smart_text

class BrandListCreateView(generics.ListCreateAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

class AddProductListCreateView(generics.ListCreateAPIView):
    queryset = AddProduct.objects.all()
    serializer_class = AddProductSerializer

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


ACCESS_TOKEN = "EAAMqvStx3vIBO2QmgKMXXeqbbBiBhq0mF9sdPZCoeOcM7hMLnIAwb729EnceogO7RtJqfnmlLef5fvr9igsVdQm7wzOq6gjYBQik7MKvHfSZAEHteexszZCzZBZBqDBVqIlcbt2vjHG7C3fLGADZA7kDm61NWqoUObZCgc9AMcXdZCqHDTmgw1U2t733lc7NdB2e"
INSTAGRAM_ACCOUNT_ID = "17841471750023527"

import cloudinary
import cloudinary.uploader


cloudinary.config(
    cloud_name = "dxallozr5", 
    api_key = "459924959317992", 
    api_secret = "vGshrUjT04Y-XZh3vf_i3CJ6Va4", # Click 'View API Keys' above to copy your API secret
    secure=True
)


def upload_to_cloudinary(file):
    response = cloudinary.uploader.upload(file, folder="instagram_posts")
    print("Uploadeddddddd")
    return response.get("secure_url")  # Return the public URL of the uploaded image

def upload_pil_image_to_cloudinary(pil_image):
    try:
        # Convert PIL image to byte stream
        byte_stream = BytesIO()
        pil_image.save(byte_stream, format='JPEG', quality=90)
        byte_stream.seek(0)

        # Upload to Cloudinary
        response = cloudinary.uploader.upload(byte_stream, resource_type="image")
        return response['secure_url']
    except Exception as e:
        print(f"Cloudinary upload error: {str(e)}")
        return None

ACCESS_TOKEN = "EAAMqvStx3vIBO2QmgKMXXeqbbBiBhq0mF9sdPZCoeOcM7hMLnIAwb729EnceogO7RtJqfnmlLef5fvr9igsVdQm7wzOq6gjYBQik7MKvHfSZAEHteexszZCzZBZBqDBVqIlcbt2vjHG7C3fLGADZA7kDm61NWqoUObZCgc9AMcXdZCqHDTmgw1U2t733lc7NdB2e"
INSTAGRAM_ACCOUNT_ID = "17841471750023527"

# class for instant post
class InstagramPostView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            try:
                caption = serializer.validated_data['post_caption']
                post_image = serializer.validated_data['post_images']
                print(caption)

                # Step 1: Upload the image to Cloudinary
                public_image_url = upload_to_cloudinary(post_image)
                print("Url", public_image_url)
                # Step 2: Upload the image to Instagram
                upload_url = f"https://graph.facebook.com/v16.0/{INSTAGRAM_ACCOUNT_ID}/media"
                upload_payload = {
                    "image_url": public_image_url,
                    "caption": caption,
                    "access_token": ACCESS_TOKEN,
                }
                upload_response = requests.post(upload_url, data=upload_payload)
                upload_response.raise_for_status()
                upload_data = upload_response.json()
                container_id = upload_data.get("id")

                # Step 3: Publish the post
                publish_url = f"https://graph.facebook.com/v16.0/{INSTAGRAM_ACCOUNT_ID}/media_publish"
                publish_payload = {
                    "creation_id": container_id,
                    "access_token": ACCESS_TOKEN,
                }
                publish_response = requests.post(publish_url, data=publish_payload)
                publish_response.raise_for_status()
                publish_data = publish_response.json()

                # Save the post in the database
                serializer.save()
                return Response(
                    {"message": "Post published successfully!", "post_id": publish_data.get("id")},
                    status=status.HTTP_201_CREATED
                )
            except requests.exceptions.RequestException as e:
                return Response(
                    {"error": f"Meta API Error: {e}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
import io
from io import BytesIO

class SchedulePostAPIView(APIView):
    def post(self, request):
        try:
            # Extract and validate required data
            required_fields = {
                'product': request.data.get('product'),
                'brand': request.data.get('brand'),
                'product_name': request.data.get('product_name'),
                'scheduled_date': request.data.get('scheduled_date')
            }
            print('data fetched from user')

            # Check for missing required fields
            missing_fields = [field for field, value in required_fields.items() if not value]
            if missing_fields:
                return Response(
                    {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get optional fields with defaults
            post_image = request.data.get('product_image')
            vibe = request.data.get('vibe', 'professional')
            post_type = request.data.get('post_type', 'image_only')
            post_caption = request.data.get('text', '')

            # Validate scheduled date format
            try:
                scheduled_date = datetime.strptime(required_fields['scheduled_date'], '%Y-%m-%d')
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            print('validation part done')

            # Get product and brand instances
            try:
                product = AddProduct.objects.select_related('brand').get(id=required_fields['product'])
                brand = Brand.objects.get(id=required_fields['brand'])

                if product.brand.id != brand.id:
                    return Response(
                        {"error": "Product does not belong to the specified brand"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            except AddProduct.DoesNotExist:
                return Response(
                    {"error": f"Product with ID {required_fields['product']} not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            except Brand.DoesNotExist:
                return Response(
                    {"error": f"Brand with ID {required_fields['brand']} not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Generate image

            try:
                print('start generating')
                generated_image, p = product_photo(
                    required_fields['product_name'],
                    vibe,
                    prod_size=0.55,
                    table=False,
                    prod_img='C:\\Users\\mishr\\moyeMoye\\models\\models_assets\\file.png'
                )
                
                
                
                if not generated_image:
                    return Response(
                        {"error": "Failed to generate image"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                print('generation completed')

                # Upload the PIL Image directly to Cloudinary
                cloudinary_url = upload_pil_image_to_cloudinary(generated_image)
                
                if not cloudinary_url:
                    return Response(
                        {"error": "Failed to upload image to Cloudinary"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                print("The url ", cloudinary_url)

            except Exception as e:
                return Response(
                    {"error": f"Image processing failed: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Create and save SchedulePost instance
            try:
                scheduled_post = SchedulePost.objects.create(
                    brand=brand,
                    product=product,
                    post_caption="Generated Caption",
                    post_type=post_type,
                    scheduled_date=scheduled_date,
                    post_image=cloudinary_url
                )

                response_data = {
                    "message": "Scheduled post created successfully",
                    "post_id": scheduled_post.id,
                    "image_url": cloudinary_url,
                    "scheduled_date": scheduled_date.strftime('%Y-%m-%d'),
                    "post_type": post_type
                }

                return Response(response_data, status=status.HTTP_201_CREATED)

            except ValidationError as e:
                return Response(
                    {"error": f"Failed to create scheduled post: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            return Response(
                {"error": f"Unexpected error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        


# CREATING THE FESTIVE POSTSS:::

# views.py
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.admin.views.decorators import staff_member_required
from django.db import transaction
from datetime import datetime
from .models import FestivalPost
from moyeMoye.backend.socio_connect.media.festivScript import create_festival_dictionary

@staff_member_required
@require_http_methods(["POST"])
@transaction.atomic
def populate_festival_posts(request):
    try:
        # Check if posts already exist
        if FestivalPost.objects.exists():
            return JsonResponse({
                'status': 'error',
                'message': 'Festival posts already exist in the database. Please clear existing data first.'
            }, status=400)

        # Get festival data from script
        festival_data = create_festival_dictionary()
        posts_created = 0

        # Create posts for each festival
        for festival, data in festival_data.items():
            festival_date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S.%fZ')
            
            for post in data['posts']:
                FestivalPost.objects.create(
                    festival=festival,
                    festival_date=festival_date,
                    caption=post['caption'],
                    image_url=post['url']
                )
                posts_created += 1

        return JsonResponse({
            'status': 'success',
            'message': f'Successfully created {posts_created} festival posts',
            'posts_created': posts_created
        })

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@require_http_methods(["GET"])
def get_festival_posts(request, festival=None):
    try:
        if festival:
            posts = FestivalPost.objects.filter(festival=festival)
        else:
            posts = FestivalPost.objects.all()

        posts_data = []
        for post in posts:
            posts_data.append({
                'festival': post.get_festival_display(),
                'festival_date': post.festival_date.isoformat(),
                'caption': post.caption,
                'image_url': post.image_url
            })

        return JsonResponse({
            'status': 'success',
            'posts': posts_data
        })

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@staff_member_required
@require_http_methods(["DELETE"])
@transaction.atomic
def clear_festival_posts(request):
    try:
        deleted_count = FestivalPost.objects.all().delete()[0]
        return JsonResponse({
            'status': 'success',
            'message': f'Successfully deleted {deleted_count} festival posts'
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)