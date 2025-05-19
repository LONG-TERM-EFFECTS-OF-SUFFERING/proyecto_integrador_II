import os

from dotenv import load_dotenv
from inference_sdk import InferenceHTTPClient


load_dotenv()  # Loads variables from .env

api_key = os.getenv("API_KEY")

client = InferenceHTTPClient(
	api_url="https://detect.roboflow.com",
	api_key=api_key
)

result = client.run_workflow(
	workspace_name="gray-tkjsd",
	workflow_id="custom-workflow",
	images={
		"image": "test.png"
	},
	use_cache=True # cache workflow definition for 15 minutes
)

print(result)
