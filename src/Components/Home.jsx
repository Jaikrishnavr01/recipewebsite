// Home.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Close, Favorite, Search } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchRecipes } from "../Api/fetchRecipes";
import {
  setRecipes,
  addFavorite,
  removeFavorite,
  setLoading,
} from '../Redux/recipesSlice';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { recipes, favorites, loading } = useSelector(
    (state) => state.recipes
  );
  const [search, setSearch] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [dietFilter, setDietFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    fetchRecipes();
    dispatch(fetchRecipes());
  }, [dispatch]);



  const handleSearch = () => {
    if (search) {
      fetchRecipes(search);
    }
  };

  const toggleFavorite = (recipe) => {
    if (favorites.some((fav) => fav.uri === recipe.uri)) {
      dispatch(removeFavorite(recipe));
    } else {
      dispatch(addFavorite(recipe));
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseDialog = () => {
    setSelectedRecipe(null);
  };

  const showMoreRecipes = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const filteredRecipes = recipes.filter(({ recipe }) => {
    const mealTypeLower = recipe.mealType.map((meal) =>
      meal.toLowerCase()
    );
    return (
      (!dietFilter ||
        recipe.dietLabels.some(
          (label) => label.toLowerCase() === dietFilter.toLowerCase()
        )) &&
      (!categoryFilter ||
        mealTypeLower.includes(categoryFilter.toLowerCase()))
    );
  });

  return (
    <div className='container'>
      {/* Favorites Menu Button */}
      <div className='favorites-menu-container'>
        <IconButton
          className='favorites-menu-button'
          onClick={() => setShowFavorites(true)}
        >
          <Favorite
            color={favorites.length > 0 ? 'error' : 'disabled'}
            className='fav'
          />
        </IconButton>
      </div>

      <h1 className='title'>Recipe Finder</h1>
      {/* Search & Favorites Section */}
      <div className='search-container'>
        <TextField
          label='Search recipes...'
          variant='outlined'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='search-box'
        />
        <Button
          variant='contained'
          className='search-button'
          onClick={handleSearch}
        >
          <Search />
        </Button>
      </div>

             {/* Filter Section */}
             <div className='filter-container'>
           <FormControl className='filter-box'>
             <InputLabel>Diet</InputLabel>
             <Select
               value={dietFilter}
               onChange={(e) => setDietFilter(e.target.value)}
             >
               <MenuItem value=''>All</MenuItem>
               <MenuItem value='low-carb'>Low Carb</MenuItem>
               <MenuItem value='Balanced'>Balanced</MenuItem>
               <MenuItem value='High-Fiber'>High-Fiber</MenuItem>
             </Select>
           </FormControl>

           <FormControl className='filter-box'>
             <InputLabel>Meal Type</InputLabel>
             <Select
               value={categoryFilter}
               onChange={(e) => setCategoryFilter(e.target.value)}
             >
               <MenuItem value=''>All</MenuItem>
               <MenuItem value='breakfast'>Breakfast</MenuItem>
               <MenuItem value='lunch/dinner'>Lunch / Dinner</MenuItem>
             </Select>
           </FormControl>
         </div>

         {/* Loader */}
         {loading && <CircularProgress color='secondary' />}

         {/* Recipes List */}
         <div className='recipe-grid'>
           {filteredRecipes.slice(0, visibleCount).map(({ recipe }, index) => (
             <motion.div
               key={index}
               whileHover={{ scale: 1.05 }}
               onClick={() => handleRecipeClick(recipe)}
             >
               <Card className='recipe-card'>
                 <IconButton
                   className='favorite-icon'
                   onClick={(e) => {
                     e.stopPropagation();
                     toggleFavorite(recipe);
                   }}
                 >
                   <Favorite
                     color={
                       favorites.some((fav) => fav.uri === recipe.uri)
                         ? 'error'
                         : 'disabled'
                     }
                   />
                 </IconButton>
                 <CardMedia
                   component='img'
                   height='200'
                   image={recipe.image}
                   alt={recipe.label}
                 />
                 <CardContent>
                   <Typography variant='h6' className='recipe-title'>
                     {recipe.label}
                   </Typography>
                   <Typography variant='body2' className='recipe-info'>
                     {recipe.dietLabels.join(', ') || 'No diet labels'}
                   </Typography>
                 </CardContent>
               </Card>
             </motion.div>
           ))}
         </div>
         <br />
         {/* Show More Button */}
         {visibleCount < filteredRecipes.length && (
           <Button
             variant='contained'
             className='show-more-buttons'
             onClick={showMoreRecipes}
           >
             Show More
           </Button>
         )}

         {/* Recipe Details Dialog */}
         {selectedRecipe && (
           <Dialog open={Boolean(selectedRecipe)} onClose={handleCloseDialog}>
             <DialogTitle>
               <div
                 style={{
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                 }}
               >
                 {selectedRecipe.label}
                 <IconButton onClick={handleCloseDialog}>
                   <Close />
                 </IconButton>
               </div>
             </DialogTitle>
             <DialogContent>
               <img
                 src={selectedRecipe.image}
                 alt={selectedRecipe.label}
                 className='dialog-image'
               />
               <Typography variant='h6' className='dialog-title'>
                 Ingredients:
               </Typography>
               <List>
                 {selectedRecipe.ingredientLines.map((ingredient, index) => (
                   <ListItem key={index}>
                     <ListItemText primary={ingredient} />
                   </ListItem>
                 ))}
               </List>
               <Typography variant='body1' className='dialog-text'>
                 Prep Time: {selectedRecipe.totalTime || 'N/A'} min
               </Typography>
               <Typography variant='body1' className='dialog-text'>
                 Servings: {selectedRecipe.yield || 'N/A'}
               </Typography>
             </DialogContent>
           </Dialog>
         )}

         {/* Favorites Dialog */}
         <Dialog open={showFavorites} onClose={() => setShowFavorites(false)}>
           <DialogTitle>
             <div
               style={{
                 display: 'flex',
                 justifyContent: 'space-between',
                 alignItems: 'center',
               }}
             >
               Favorite Recipes
               <IconButton onClick={() => setShowFavorites(false)}>
                 <Close />
               </IconButton>
             </div>
           </DialogTitle>
           <DialogContent>
             {favorites.length > 0 ? (
               <List>
                 {favorites.map((recipe, index) => (
                   <ListItem
                     key={index}
                     onClick={() => handleRecipeClick(recipe)}
                   >
                     <ListItemText primary={recipe.label} />
                     <IconButton
                       onClick={(e) => {
                         e.stopPropagation();
                         toggleFavorite(recipe);
                       }}
                     >
                       <Favorite color='error' />
                     </IconButton>
                   </ListItem>
                 ))}
               </List>
             ) : (
               <Typography>No favorites added yet.</Typography>
             )}
           </DialogContent>
         </Dialog>
       </div>
     );
   };

   export default Home;

