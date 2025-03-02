import axios from 'axios';

const BASE_URL = 'https://api.edamam.com/search?q=pizza&app_id=a5de3521&app_key=28f8a20bd893e2740e68d4bbb349b977&from=0&to=50';

export const FetchApi = async (count = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data.recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

