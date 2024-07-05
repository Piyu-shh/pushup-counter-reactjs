import cv2
import numpy as np
import mediapipe as mp
from src.calculateAngle import calculate_angle

mp_pose = mp.solutions.pose

class Exercise:
    def __init__(self):
        self.counter = 0
        self.stage = 'up'
        self.arm_error_printed = False
        self.back_error_printed = False
        self.palms_error_printed = False
        self.alignment_error_printed = False

    def pushups(self, image: np.ndarray, landmarks: list, reps: int):
        mp_pose_landmarks = mp_pose.PoseLandmark
        # Define landmarks
        r1 = [int(landmarks[mp_pose_landmarks.RIGHT_SHOULDER].x * image.shape[1]), int(landmarks[mp_pose_landmarks.RIGHT_SHOULDER].y * image.shape[0])]
        r2 = [int(landmarks[mp_pose_landmarks.RIGHT_ELBOW].x * image.shape[1]), int(landmarks[mp_pose_landmarks.RIGHT_ELBOW].y * image.shape[0])]
        r3 = [int(landmarks[mp_pose_landmarks.RIGHT_WRIST].x * image.shape[1]), int(landmarks[mp_pose_landmarks.RIGHT_WRIST].y * image.shape[0])]
        l1 = [int(landmarks[mp_pose_landmarks.LEFT_SHOULDER].x * image.shape[1]), int(landmarks[mp_pose_landmarks.LEFT_SHOULDER].y * image.shape[0])]
        l2 = [int(landmarks[mp_pose_landmarks.LEFT_ELBOW].x * image.shape[1]), int(landmarks[mp_pose_landmarks.LEFT_ELBOW].y * image.shape[0])]
        l3 = [int(landmarks[mp_pose_landmarks.LEFT_WRIST].x * image.shape[1]), int(landmarks[mp_pose_landmarks.LEFT_WRIST].y * image.shape[0])]
        l4 = [int(landmarks[mp_pose_landmarks.LEFT_HIP].x * image.shape[1]), int(landmarks[mp_pose_landmarks.LEFT_HIP].y * image.shape[0])]
        l5 = [int(landmarks[mp_pose_landmarks.LEFT_KNEE].x * image.shape[1]), int(landmarks[mp_pose_landmarks.LEFT_KNEE].y * image.shape[0])]
        l6 = [int(landmarks[mp_pose_landmarks.LEFT_ANKLE].x * image.shape[1]), int(landmarks[mp_pose_landmarks.LEFT_ANKLE].y * image.shape[0])]
        r4 = [int(landmarks[mp_pose_landmarks.RIGHT_HIP].x * image.shape[1]), int(landmarks[mp_pose_landmarks.RIGHT_HIP].y * image.shape[0])]
        r5 = [int(landmarks[mp_pose_landmarks.RIGHT_KNEE].x * image.shape[1]), int(landmarks[mp_pose_landmarks.RIGHT_KNEE].y * image.shape[0])]
        r6 = [int(landmarks[mp_pose_landmarks.RIGHT_ANKLE].x * image.shape[1]), int(landmarks[mp_pose_landmarks.RIGHT_ANKLE].y * image.shape[0])]
        rpalm = [int(landmarks[mp_pose_landmarks.RIGHT_PINKY].x * image.shape[1]), int(landmarks[mp_pose_landmarks.RIGHT_PINKY].y * image.shape[0])]
        lpalm = [int(landmarks[mp_pose_landmarks.LEFT_PINKY].x * image.shape[1]), int(landmarks[mp_pose_landmarks.LEFT_PINKY].y * image.shape[0])]

        # Calculate angles
        angleR = calculate_angle(r1, r2, r3)
        angleL = calculate_angle(l1, l2, l3)
        back_angleR = calculate_angle(r1, r4, r5)
        back_angleL = calculate_angle(l1, l4, l5)
        palms_distance = np.linalg.norm(np.array(rpalm) - np.array(lpalm))
        shoulder_diff = abs(r1[1] - l1[1])
        hip_diff = abs(r4[1] - l4[1])
        alignment_threshold = 50

        # Flags and colors
        has_error = False
        if angleR <= 50 or angleL <= 50:
            has_error = True
        if back_angleR <= 120 or back_angleL <= 120:
            has_error = True
        if palms_distance < 50:
            has_error = True
        if shoulder_diff > alignment_threshold or hip_diff > alignment_threshold:
            has_error = True

        # Feedback
        if angleR <= 50 or angleL <= 50 and not self.arm_error_printed:
            print("Keep your arms straight!")
            self.arm_error_printed = True
        if back_angleR <= 120 or back_angleL <= 120 and not self.back_error_printed:
            print("Keep your back straight!")
            self.back_error_printed = True
        if palms_distance < 30 and not self.palms_error_printed:
            print("Keep your palms further apart!")
            self.palms_error_printed = True
        if (shoulder_diff > alignment_threshold or hip_diff > alignment_threshold) and not self.alignment_error_printed:
            print("Align your shoulders and hips horizontally!")
            self.alignment_error_printed = True

        # Counter logic
        if not has_error:
            if angleL < 90 and angleR < 90 and self.stage == 'up':
                self.counter += 1
                self.stage = 'down'
                print(f"Push-up count: {self.counter}")
            if angleL > 90 and angleR > 90 and self.stage == 'down':
                self.stage = 'up'

        if self.counter >= reps:
            print("Exercise complete!")
            return True

        return False
