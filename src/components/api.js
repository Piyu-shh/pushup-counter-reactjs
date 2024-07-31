const API_URL = 'https://yourapi.com/sessions'; // Replace with your actual API endpoint

export const fetchSessionData = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching session data:', error);
    throw error;
  }
};
