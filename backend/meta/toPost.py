import requests

# Replace these with your actual values
# ACCESS_TOKEN = "EAAMqvStx3vIBOzZBvECVvn7OTzDbTTEudHihScbGT85qjQDE9sdlDZAys9ZAqaEIcW7K9RwONiUDMZC3Nq1VLIkx0ZByjqE6xBl4MK9pYRdmXZAQAywMGQXCoYHPQCMKFykxhSpCSFIXQM9TPcAABTpdRQG2w0FxuMHIo25AhVP37fvKYmUEmHAuPjZBQRB83sU"
ACCESS_TOKEN = "EAAMqvStx3vIBO2QmgKMXXeqbbBiBhq0mF9sdPZCoeOcM7hMLnIAwb729EnceogO7RtJqfnmlLef5fvr9igsVdQm7wzOq6gjYBQik7MKvHfSZAEHteexszZCzZBZBqDBVqIlcbt2vjHG7C3fLGADZA7kDm61NWqoUObZCgc9AMcXdZCqHDTmgw1U2t733lc7NdB2e"
INSTAGRAM_ACCOUNT_ID = "17841471750023527"
IMAGE_URL = "https://res.cloudinary.com/dxallozr5/image/upload/v1736458852/instagram_posts/sz1lcyziohwjgepa6vis.png"  # URL of the image to post
CAPTION = "This is an example post created using the Meta Graph API!"

def publish_instagram_post(access_token, account_id, image_url, caption):
    try:
        # Step 1: Upload the image
        upload_url = f"https://graph.facebook.com/v16.0/{account_id}/media"
        upload_payload = {
            "image_url": image_url,
            "caption": caption,
            "access_token": access_token,
        }
        upload_response = requests.post(upload_url, data=upload_payload)
        upload_response.raise_for_status()
        upload_data = upload_response.json()
        container_id = upload_data.get("id")
        print(f"Media container created: {container_id}")

        # Step 2: Publish the post
        publish_url = f"https://graph.facebook.com/v16.0/{account_id}/media_publish"
        publish_payload = {
            "creation_id": container_id,
            "access_token": access_token,
        }
        publish_response = requests.post(publish_url, data=publish_payload)
        publish_response.raise_for_status()
        publish_data = publish_response.json()

        print(f"Post published successfully! Post ID: {publish_data.get('id')}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

# Call the function to publish the post
publish_instagram_post(ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID, IMAGE_URL, CAPTION)
