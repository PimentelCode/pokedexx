import CONFIG from './config.js';

class PokeAPI {
  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL;
  }

  async getPokemon(idOrName) {
    try {
      const response = await fetch(`${this.baseUrl}/pokemon/${idOrName}`);
      if (!response.ok) {
        throw new Error(`Pokemon not found: ${idOrName}`);
      }
      const data = await response.json();
      return this._transformPokemonData(data);
    } catch (error) {
      console.error('Error fetching pokemon:', error);
      return null;
    }
  }

  async getPokemonList(limit = 20, offset = 0) {
    try {
      const response = await fetch(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pokemon list');
      }
      const data = await response.json();
      
      // Fetch details for each pokemon to get types and images
      const promises = data.results.map(pokemon => this.getPokemon(pokemon.name));
      const detailedList = await Promise.all(promises);
      
      return detailedList.filter(p => p !== null);
    } catch (error) {
      console.error('Error fetching pokemon list:', error);
      return [];
    }
  }

  async getPokemonByType(type) {
    try {
      const response = await fetch(`${this.baseUrl}/type/${type}`);
      if (!response.ok) return [];
      const data = await response.json();
      // data.pokemon is array of { pokemon: { name, url } }
      return data.pokemon.map(p => p.pokemon);
    } catch (error) {
      console.error('Error fetching type:', error);
      return [];
    }
  }

  _transformPokemonData(data) {
    return {
      id: data.id,
      name: data.name,
      types: data.types.map(t => t.type.name),
      image: `${CONFIG.IMAGE_BASE_URL}${data.id}.png`,
      stats: data.stats.map(s => ({
        name: s.stat.name,
        value: s.base_stat
      })),
      moves: data.moves.slice(0, 5).map(m => m.move.name), // Top 5 moves
      height: data.height,
      weight: data.weight
    };
  }
}

export default new PokeAPI();
