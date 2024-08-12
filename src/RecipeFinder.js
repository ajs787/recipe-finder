import React, { useState } from 'react';
import axios from 'axios';
import './RecipeFinder.css';

const dietaryPreferences = [
  { label: 'Keto', value: 'keto' },
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Halal', value: 'halal' },
  { label: 'Vegan', value: 'vegan' },
];

const starRatings = [1, 2, 3, 4, 5];

const RecipeFinder = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownRatingOpen, setDropdownRatingOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const APP_ID = '87f42800';
  const APP_KEY = '2693ae6655e325e1615238cdcca445c0';

  const togglePreference = (preference) => {
    setSelectedPreferences(prev => {
      if (prev.includes(preference)) {
        return prev.filter(item => item !== preference);
      } else {
        return [...prev, preference];
      }
    });
  };

  const searchRecipes = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedQuery = query.split(',').map(ingredient => ingredient.trim()).join(',+');
    const healthParams = selectedPreferences.length > 0 ? `&health=${selectedPreferences.join('&health=')}` : '';
    const ratingParams = selectedRating ? `&minRating=${selectedRating}` : '';
    const url = `https://api.edamam.com/search?q=${formattedQuery}&app_id=${APP_ID}&app_key=${APP_KEY}${healthParams}${ratingParams}&from=${(page - 1) * 40}&to=${page * 40}`;

    console.log('Fetching from URL:', url); // Debug URL
    try {
      const result = await axios.get(url);
      console.log('API Response:', result.data); // Debug response
      setTotalResults(result.data.count);
      setRecipes(prevRecipes => [...prevRecipes, ...result.data.hits]);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreRecipes = () => {
    setPage(prevPage => prevPage + 1);
    searchRecipes(new Event('click')); 
  };

  const renderStars = (rating) => {
    // Assuming rating is a number between 0 and 5
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>★</span>
    ));
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
        <div className="search-bar-container">
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Enter all of your ingredients (separate them by commas)" 
          />
          <button type="submit">Let's go!</button>
        </div>
        <div className="selected-preferences">
          {selectedPreferences.map(pref => (
            <span key={pref} className="preference-badge">
              {pref}
            </span>
          ))}
          {selectedRating && (
            <span className="preference-badge">
              {`${selectedRating} Stars & Above`}
            </span>
          )}
        </div>
        <div className="filters">
          <button 
            type="button" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Dietary
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              {dietaryPreferences.map(pref => (
                <li key={pref.value} onClick={() => togglePreference(pref.value)}>
                  {pref.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="filters2">
          <button 
            type="button" 
            onClick={() => setDropdownRatingOpen(!dropdownRatingOpen)}
          >
            Stars
          </button>
          {dropdownRatingOpen && (
            <ul className="dropdown-menu">
              {starRatings.map(star => (
                <li key={star} onClick={() => setSelectedRating(star)}>
                  {star} Stars & Above
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
      <div className="recipes">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe">
            <img src={recipe.recipe.image} alt={recipe.recipe.label} />
            <div className="recipe-info">
              <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">
                {recipe.recipe.label}
              </a>
              <div className="rating">
                {renderStars(Math.round(recipe.recipe.rating))}
                <span className="rating-count">({recipe.recipe.ratingCount} ratings)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {recipes.length < totalResults && (
        <button onClick={loadMoreRecipes} className="load-more-button">
          Load More
        </button>
      )}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default RecipeFinder;
