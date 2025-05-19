import os

import roboflow
from dotenv import load_dotenv


load_dotenv()  # Loads variables from .env

api_key = os.getenv("API_KEY")

rf = roboflow.Roboflow(api_key=api_key)
workspace_id = "gray-tkjsd"
project_id = "character_detection-oxmfn"
project = rf.workspace(workspace_id).project(project_id)

split = {
	"train": 0.7,
	"valid": 0.2,
	"test": 0.1
}

def upload_images_with_label(data_dir: str, max_files_per_label: int = 100):
	if os.path.isdir(data_dir):
		for label in os.listdir(data_dir):
			path = os.path.join(data_dir, label)
			image_files = [f for f in os.listdir(path) if f.lower().endswith((".png", ".jpg", ".jpeg"))]
			image_files = image_files[:max_files_per_label]
			total = len(image_files)
			train_end = int(split["train"] * total)
			val_end = train_end + int(split["valid"] * total)
			for idx, file in enumerate(image_files):
				if idx < train_end:
					subset = "train"
				elif idx < val_end:
					subset = "valid"
				else:
					subset = "test"
				image_path = os.path.join(path, file)
				print(f"Uploading {image_path} with label {label} to {subset} set...")
				project.upload(
					image_path=image_path,
					num_retry_uploads=3,
					annotation_path=label,
					split=subset
				)

upload_images_with_label("data", 10)

