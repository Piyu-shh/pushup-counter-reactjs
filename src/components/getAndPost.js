// src/getAndPost.js

const API_URL = 'https://pushup-counter-backend.onrender.com'; // Centralized API URL

export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/profile/profile-get/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const setUserProfile = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/profile/profile-set/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to set user profile');
    }
    return response.json();
  } catch (error) {
    console.error('Error setting user profile:', error);
    return null;
  }
};
