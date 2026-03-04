import api from './api.js';
import UI from './ui.js';
import CONFIG from './config.js';

class App {
  constructor() {
    this.ui = new UI();
    this.state = {
      offset: 0,
      limit: 20,
      currentType: 'all',
      filteredList: [], // Stores list of {name, url} when filtered by type
      isLoading: false,
      hasMore: true
    };
    
    this.init();
  }

  async init() {
    console.log('Initializing Pokedex...');
    await this.loadFeaturedPokemon();
  }

  async loadFeaturedPokemon() {
    try {
      const featuredIds = CONFIG.HIGHLIGHTED_POKEMON; 
      
      // Fetch individually to avoid one failure breaking all
      const promises = featuredIds.map(async id => {
          try {
              return await api.getPokemon(id);
          } catch (e) {
              console.error(`Failed to load pokemon ${id}`, e);
              return null;
          }
      });
      
      const results = await Promise.all(promises);
      const pokemons = results.filter(p => p !== null);
      
      if (pokemons.length > 0) {
          this.ui.renderFeatured(pokemons);
      } else {
          console.error('No featured pokemon loaded');
      }
    } catch (error) {
      console.error('Error loading featured pokemon section:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
