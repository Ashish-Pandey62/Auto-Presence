import cloudinary
import cloudinary.uploader
import os
from datetime import datetime

cloudinary.config(
    cloud_name = "dxallozr5", 
    api_key = "459924959317992", 
    api_secret = "vGshrUjT04Y-XZh3vf_i3CJ6Va4",
    secure=True
)

def get_cloudinary_url(image_path):
    try:
        upload_result = cloudinary.uploader.upload(image_path)
        return upload_result['secure_url']
    except Exception as e:
        print(f"Error uploading {image_path}: {str(e)}")
        return None

def create_festival_dictionary():
    base_dir = "festiv_images"
    
    # Dictionary to store festival data with dates
    festivals_dict = {
        "lohsar": {
            "date": "2025-01-30T09:00:00.000Z",
            "posts": []
        },
        "maghe_sankranti": {
            "date": "2025-01-14T09:00:00.000Z",
            "posts": []
        },
        "saraswati_puja": {
            "date": "2025-02-03T09:00:00.000Z",
            "posts": []
        }
    }
    
    # Captions for each festival
    captions = {
        "lohsar": [
            "Wishing everyone a joyous Sonam Losar! May this New Year bring happiness, harmony, and prosperity to all. #SonamLosar2025 #TamangNewYear",
            "New beginnings, new hopes, and cherished traditions. Let's celebrate Sonam Losar with love and positivity! #LosarVibes #CulturalPride",
            "Here's to a year filled with happiness, good health, and success. Happy Sonam Losar to everyone! #NewYearCelebration #SonamLosar",
            "May the Tamang New Year bring blessings of peace, unity, and prosperity. Celebrate Sonam Losar with joy and tradition! #CulturalHeritage #SonamLosar",
            "Honoring traditions, celebrating culture, and welcoming new hopes—Happy Sonam Losar! #SonamLosar2025 #UnityInDiversity"
        ],
        "maghe_sankranti": [
            "Wishing you warmth and happiness this Maghe Sankranti! May your life be filled with love, good health, and prosperity. #MagheSankranti2025 #FestiveVibes",
            "Celebrating the harvest, family bonds, and the sweetness of sesame and jaggery! Happy Maghe Sankranti to all. #CulturalFestivals #MagheSankranti",
            "Let's welcome longer days and positive vibes this Maghe Sankranti. May the festival bring joy and good fortune! #FestivalOfHarvest #MagheSankrantiCelebration",
            "Dahi chiura, til ko laddu, and the warmth of family—this Maghe Sankranti, let's embrace the beauty of traditions! #HarvestFestival #MagheSankrantiVibes",
            "As the sun begins its northern journey, let's celebrate new hopes, good health, and happiness this Maghe Sankranti! #MakarSankranti #MagheSankrantiJoy"
        ],
        "saraswati_puja": [
            "May Maa Saraswati illuminate our minds with wisdom and knowledge this Saraswati Puja. Let's celebrate learning, art, and creativity! #SaraswatiPuja #WisdomAndGrace",
            "Bowing to the goddess of wisdom and learning, Maa Saraswati. Let her blessings guide us to success and serenity. #SaraswatiPuja2025 #KnowledgeIsPower",
            "Books, music, and devotion—this Saraswati Puja, let's embrace the beauty of learning and creativity. #BlessingsOfSaraswati #FestivalOfKnowledge",
            "On this auspicious day, let's seek the blessings of Maa Saraswati for enlightenment, wisdom, and prosperity. #SaraswatiPujaVibes #DivineGrace",
            "With devotion in our hearts and prayers for wisdom, we celebrate Saraswati Puja. May her blessings bring light to our lives! #GoddessOfKnowledge #SaraswatiPujaCelebration"
        ]
    }
    
    # Process each festival
    for festival in festivals_dict.keys():
        festival_path = os.path.join(base_dir, festival)
        if os.path.exists(festival_path):
            # Get all images in the festival directory
            images = [f for f in os.listdir(festival_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
            
            # Process each image
            for idx, image in enumerate(images):
                image_path = os.path.join(festival_path, image)
                cloudinary_url = get_cloudinary_url(image_path)
                
                if cloudinary_url and idx < len(captions[festival]):
                    festivals_dict[festival]["posts"].append({
                        "url": cloudinary_url,
                        "caption": captions[festival][idx]
                    })
    
    return festivals_dict

if __name__ == "__main__":
    festival_data = create_festival_dictionary()
    print(festival_data)