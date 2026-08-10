import os
import sys
import cloudinary
import cloudinary.uploader
from concurrent.futures import ThreadPoolExecutor

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config.database import SessionLocal
from models.exercise import Exercise

# Cloudinary config
cloudinary.config(
  cloud_name = 'a41n5x6q',
  api_key = '899781447338393',
  api_secret = 'm_P69u4vqCBqeVxzfOtYSAqu5po'
)

videos_dir = '/Users/ahmed/Desktop/bolder_videos_clean'

def upload_and_save(filename):
    if not filename.endswith('.gif'): return
    name = os.path.splitext(filename)[0]
    
    db = SessionLocal()
    try:
        # Check if already exists in DB
        exists = db.query(Exercise).filter(Exercise.name == name).first()
        if exists and exists.gif_url:
            print(f"Skipping {name}, already in DB with URL")
            return

        filepath = os.path.join(videos_dir, filename)
        print(f"Uploading {name}...")
        
        # Upload
        res = cloudinary.uploader.upload(filepath, folder="exercises", resource_type="image")
        gif_url = res.get('secure_url')
        
        # Save or update DB
        if exists:
            exists.gif_url = gif_url
            exists.video_url = gif_url
            db.commit()
            print(f"Updated {name} in DB -> {gif_url}")
        else:
            ex = Exercise(name=name, muscle_group="عام", gif_url=gif_url, video_url=gif_url)
            db.add(ex)
            db.commit()
            print(f"Saved {name} to DB -> {gif_url}")
            
    except Exception as e:
        print(f"Failed to upload {name}: {e}")
    finally:
        db.close()

if __name__ == '__main__':
    if not os.path.exists(videos_dir):
        print(f"Directory not found: {videos_dir}")
        sys.exit(1)
        
    files = [f for f in os.listdir(videos_dir) if f.endswith('.gif')]
    print(f"Found {len(files)} GIF files. Starting upload...")
    
    # Run with 15 workers for fast upload
    with ThreadPoolExecutor(max_workers=15) as executor:
        executor.map(upload_and_save, files)
    print("Done!")
