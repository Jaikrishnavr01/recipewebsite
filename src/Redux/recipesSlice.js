import { createSlice } from '@reduxjs/toolkit';

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],
    favorites: [],
    loading: false,
  },
  reducers: {
    setRecipes: (state, action) => {
      state.recipes = action.payload;
    },
    addFavorite: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (recipe) => recipe.uri !== action.payload.uri
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setRecipes, addFavorite, removeFavorite, setLoading } =
  recipesSlice.actions;

export default recipesSlice.reducer;
