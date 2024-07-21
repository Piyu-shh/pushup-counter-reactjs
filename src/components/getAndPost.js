// getAndPost.js

import axios from 'axios';

const apiUrl = '';


export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`?user_id=${userId}`);

    // Assuming the API response contains the user data in a field called 'data'
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const setUserProfile = async (userData) => {
  try {
    const response = await axios.post(`${apiUrl}/set_profile/`, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
    if(response.statusCode === 200){
      console.log("Profile Set successfully");
      const uuid = response.data;
      return uuid;
    } else {
      console.error(`Failed to set profile: ${response.data}`);
      const uuid = response.data;
      return uuid;
    }
  } catch (error) {
    console.error('Error setting user profile:', error);
    return null;
  }
};
