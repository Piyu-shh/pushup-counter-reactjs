# Spent

Welcome to **Spent**, a comprehensive web application designed to help you track and improve your workouts. Currently, the application supports push-up tracking with real-time feedback, and more workouts will be added in the future.

## Features

- **Real-time Push-up Tracking**: Get immediate feedback on your form and count your repetitions accurately.
- **Form Correction**: Identify and correct common mistakes in your push-up form, such as arm positioning and back alignment.
- **User Authentication**: Secure login and profile management using Firebase authentication.
- **Future Workouts**: Stay tuned for additional workout tracking features that will be integrated into Spent.

## Technologies Used

- **Frontend**: React, Redux
- **Backend**: FastAPI
- **Pose Detection**: MediaPipe
- **Authentication**: Firebase
- **State Management**: Redux

## Installation

Follow these steps to set up the project on your local machine.

### Prerequisites

- Node.js
- npm
- Python
- pip

### Backend Setup

1. Clone the repository:

```sh
git clone https://github.com/yourusername/spent.git
cd spent/backend
```

2. Create and activate a virtual environment:

```sh
python -m venv venv
source venv/bin/activate   # On Windows, use `venv\Scripts\activate`
```

3. Install the required packages:

```sh
pip install -r requirements.txt
```

4. Run the FastAPI server:

```sh
uvicorn main:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:

```sh
cd ../frontend
```

2. Install the required packages:

```sh
npm install --legacy-peer-deps
```

3. Start the React development server:

```sh
npm start
```

## Usage

1. Open your web browser and navigate to `http://localhost:3000`.
2. Sign in using your Google account.
3. Navigate to the Push-up Tracker page to start tracking your push-ups.
4. Follow the real-time feedback to improve your form and track your progress.

## Firebase Setup

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable Google authentication in the Authentication section.
3. Create a `.env` file in the `frontend` directory with your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

If you have any questions or need further assistance, feel free to reach out to us at support@spent.com.

---

Thank you for using Spent! Stay fit and healthy.
