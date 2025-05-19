import os

import roboflow
from dotenv import load_dotenv


load_dotenv()  # Loads variables from .env

api_key = os.getenv("API_KEY")

rf = roboflow.Roboflow(api_key=api_key)
workspace_id = "gray-tkjsd"
project_id = "character_detection-oxmfn"
project = rf.workspace(workspace_id).project(project_id)

version = project.version("1")

model = version.train(
	speed="fast",  # Options: "fast" (default) or "accurate" (paid feature)
	checkpoint=None, # Use a specific checkpoint to continue training
)
