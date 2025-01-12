import requests
import time
import schedule

# Replace these with your actual values
ACCESS_TOKEN = "EAAMqvStx3vIBOzZBvECVvn7OTzDbTTEudHihScbGT85qjQDE9sdlDZAys9ZAqaEIcW7K9RwONiUDMZC3Nq1VLIkx0ZByjqE6xBl4MK9pYRdmXZAQAywMGQXCoYHPQCMKFykxhSpCSFIXQM9TPcAABTpdRQG2w0FxuMHIo25AhVP37fvKYmUEmHAuPjZBQRB83sU"
INSTAGRAM_ACCOUNT_ID = "17841471750023527"
IMAGE_URL = "https://imgs.search.brave.com/OuVtyy9Pb4IBn8uAGIeHPy4c-PVy1qp5YqABDf8xE2Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTMz/ODY4MzE3OC9waG90/by9sYXB0b3Atb24t/d29vZGVuLXRhYmxl/LWF0LW5pZ2h0Lmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz10/RmtFY2tyYmhQV3Fk/X3VWcGgyOVhaVnYt/MDF5dWUzSExTLU82/Ty1vUEpFPQ"  # URL of the image to post
CAPTION = "This is a scheduled post created using the Meta Graph API!"

# Function to create a media container
def create_media_container(access_token, instagram_account_id, image_url, caption):
    url = f"https://graph.facebook.com/v16.0/{instagram_account_id}/media"
    payload = {
        'image_url': image_url,
        'caption': caption,
        'access_token': access_token
    }
    response = requests.post(url, data=payload)
    if response.status_code == 200:
        container_id = response.json().get('id')
        print(f"Media container created: {container_id}")
        return container_id
    else:
        print(f"Error creating media container: {response.json()}")
        return None

# Function to publish the media container
def publish_media_container(access_token, instagram_account_id, creation_id):
    url = f"https://graph.facebook.com/v16.0/{instagram_account_id}/media_publish"
    payload = {
        'creation_id': creation_id,
        'access_token': access_token
    }
    response = requests.post(url, data=payload)
    if response.status_code == 200:
        post_id = response.json().get('id')
        print(f"Post published successfully! Post ID: {post_id}")
    else:
        print(f"Error publishing post: {response.json()}")

# Schedule the post
def schedule_post(access_token, instagram_account_id, image_url, caption, schedule_time):
    def task():
        print("Uploading media...")
        container_id = create_media_container(access_token, instagram_account_id, image_url, caption)
        if container_id:
            print("Publishing media...")
            publish_media_container(access_token, instagram_account_id, container_id)

    # Schedule the task
    schedule.every().day.at(schedule_time).do(task)

    print(f"Post scheduled at {schedule_time}")
    while True:
        schedule.run_pending()
        time.sleep(1)

# Example: Schedule a post at a specific time (24-hour format, e.g., "14:30" for 2:30 PM)
schedule_post(ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID, IMAGE_URL, CAPTION, "20:35")
