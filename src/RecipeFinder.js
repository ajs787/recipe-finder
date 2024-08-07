// src/RecipeFinder.js
import React, { useState } from 'react';
import axios from 'axios';
import './RecipeFinder.css';

const RecipeFinder = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  const APP_ID = '87f42800'; 
  const APP_KEY = '2693ae6655e325e1615238cdcca445c0'; 

  const searchRecipes = async (e) => {
    e.preventDefault();
    const formattedQuery = query.split(',').map(ingredient => ingredient.trim()).join(',');
    const url = `https://api.edamam.com/search?q=${formattedQuery}&app_id=${APP_ID}&app_key=${APP_KEY}`;
    try {
        const result = await axios.get(url);
        console.log(result.data); // inspect api response
        setRecipes(result.data.hits);
    }   catch (error) {
        console.error("Error fetching recipes:", error);
  }
};

  return (
    <div className="recipe-finder">
      <h1>we <strong>have</strong> it at <strong>home</strong></h1>
      <div className="subheading-container">
        <h2>Your recipe search starts <strong>here.</strong></h2>
      </div>
      <div className="subsub">
        <h3>The best recipes for your exact ingredients. Make a delicious meal</h3>
      </div>
      <div className="smallest">
        <h4>with whatever you have at home.</h4>
      </div>
      <form onSubmit={searchRecipes}>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Enter all of your ingredients (separate them by commas)" 
        />
        <button type="submit">Let's go!</button>
      </form>
      <div className="recipes">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe">
            <h2>{recipe.recipe.label}</h2>
            <img src={recipe.recipe.image} alt={recipe.recipe.label} />
            <p>Calories: {Math.round(recipe.recipe.calories)}</p>
            <p>Total Time: {recipe.recipe.totalTime ? `${recipe.recipe.totalTime} minutes` : 'Not available'}</p> {}
            <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">View Recipe</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeFinder;
