# main.py

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from src.exercise import Exercise
import cv2
import numpy as np
import mediapipe as mp

# Initialize the exercise class
exercise = Exercise()

# Initialize Mediapipe Pose model
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

app = FastAPI()

# Define the data model for the response
class PoseLandmarks(BaseModel):
    landmarks: list[dict]
    feedback: str
    count: int
    image: str  # Hex string of the image

@app.post("/process")
async def process_image(file: UploadFile = File(...)):
    # Read the image file
    contents = await file.read()
    np_img = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    # Convert image to RGB
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    result = pose.process(img_rgb)

    # Check if landmarks are detected
    if result.pose_landmarks:
        lm = result.pose_landmarks.landmark
        # Define landmarks
        landmarks = []
        for lm in result.pose_landmarks.landmark:
            landmarks.append({'x': lm.x, 'y': lm.y, 'z': lm.z})

        # Check push-up form and get feedback
        completed = exercise.pushups(img, result.pose_landmarks.landmark, reps=10)
        feedback = "Good form!" if not completed else "Exercise complete!"
        count = exercise.counter

        # Draw landmarks and connections on the image
        img_rgb = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
        mp_drawing = mp.solutions.drawing_utils
        mp_drawing.draw_landmarks(img_rgb, result.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        # Convert image to bytes
        _, img_encoded = cv2.imencode('.jpg', img_rgb)
        img_bytes = img_encoded.tobytes()

        return JSONResponse(content={
            'feedback': feedback,
            'count': count,
            'landmarks': landmarks,
            'image': img_bytes.hex()  # Convert to hex string for easier handling
        })
    else:
        return JSONResponse(content={
            'feedback': 'No landmarks detected!',
            'count': exercise.counter,
            'landmarks': [],
            'image': ''
        })
