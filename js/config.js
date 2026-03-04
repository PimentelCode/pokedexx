// Configuration for Pokédex App

const CONFIG = {
  API_BASE_URL: 'https://pokeapi.co/api/v2',
  IMAGE_BASE_URL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/',
  MAX_POKEMON_DISPLAY: 151, // Generation 1 for now
  HIGHLIGHTED_POKEMON: [25, 4, 7] // Pikachu, Charmander, Squirtle
};

export const TYPE_TRANSLATIONS = {
  normal: 'Normal',
  fire: 'Fogo',
  water: 'Água',
  grass: 'Grama',
  electric: 'Elétrico',
  ice: 'Gelo',
  fighting: 'Lutador',
  poison: 'Venenoso',
  ground: 'Terra',
  flying: 'Voador',
  psychic: 'Psíquico',
  bug: 'Inseto',
  rock: 'Pedra',
  ghost: 'Fantasma',
  dragon: 'Dragão',
  steel: 'Aço',
  fairy: 'Fada'
};

export default CONFIG;
