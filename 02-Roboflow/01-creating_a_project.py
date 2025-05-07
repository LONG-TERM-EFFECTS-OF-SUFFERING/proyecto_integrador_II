import os

import roboflow
from dotenv import load_dotenv


load_dotenv()  # Loads variables from .env

api_key = os.getenv("API_KEY")

rf = roboflow.Roboflow(api_key=api_key)
workspace_id = "gray-tkjsd"
workspace = rf.workspace(workspace_id)

workspace .create_project(
	project_name="character_detection",
	project_type="multi-label-classification",
	project_license="Public Domain",
	annotation="annotation-group"
)
