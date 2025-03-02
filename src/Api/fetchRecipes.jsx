import axios from "axios";
import { setRecipes, setLoading } from "../Redux/recipesSlice";

export const fetchRecipes = (query = "pizza") => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(
      `https://api.edamam.com/search?q=${query}&app_id=a5de3521&app_key=28f8a20bd893e2740e68d4bbb349b977&from=0&to=50`
    );
    dispatch(setRecipes(response.data.hits));
  } catch (error) {
    console.error("Error fetching recipes", error);
  } finally {
    dispatch(setLoading(false));
  }
};


