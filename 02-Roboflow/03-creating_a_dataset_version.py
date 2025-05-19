import os

import roboflow
from dotenv import load_dotenv


load_dotenv()  # Loads variables from .env

api_key = os.getenv("API_KEY")

rf = roboflow.Roboflow(api_key=api_key)
workspace_id = "gray-tkjsd"
project_id = "character_detection-oxmfn"
project = rf.workspace(workspace_id).project(project_id)

project.generate_version(settings={
	"preprocessing": {
		# "auto-orient": True,
		# "resize": {"width": 640, "height": 640, "format": "Stretch to"},
		# "grayscale": False
	},
	"augmentation": {
		# Add augmentation settings here if needed
	},
})
