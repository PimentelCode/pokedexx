import CONFIG, { TYPE_TRANSLATIONS } from './config.js';

export default class UI {
  constructor() {
    this.featuredContainer = document.getElementById('featured-pokemon-container');
    this.pokemonListContainer = document.getElementById('pokemon-list-container');
    this.modal = document.getElementById('pokemon-modal');
    this.allPokemons = []; // Cache to store all loaded pokemons
  }

  renderFeatured(pokemons) {
    if (!this.featuredContainer) return;
    
    this.featuredContainer.innerHTML = pokemons.map(pokemon => this._createCard(pokemon, 'featured')).join('');
    
    // Add click listeners
    this.featuredContainer.querySelectorAll('.pokemon-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const pokemon = pokemons.find(p => p.id == id);
        this.showModal(pokemon);
      });
    });
  }

  renderList(pokemons, append = false) {
    if (!this.pokemonListContainer) return;
    
    // Update cache
    if (append) {
        this.allPokemons = [...this.allPokemons, ...pokemons];
    } else {
        this.allPokemons = pokemons;
    }

    const html = pokemons.map(pokemon => this._createCard(pokemon, 'list')).join('');
    
    if (append) {
        this.pokemonListContainer.insertAdjacentHTML('beforeend', html);
    } else {
        this.pokemonListContainer.innerHTML = html;
    }
    
    // Add click listeners (delegation or re-bind)
    this.pokemonListContainer.querySelectorAll('.pokemon-card').forEach(card => {
        card.onclick = () => {
            const id = card.dataset.id;
            const pokemon = this.allPokemons.find(p => p.id == id);
            if (pokemon) this.showModal(pokemon);
        };
    });
  }

  toggleLoadMore(visible) {
      const btn = document.getElementById('load-more');
      if (btn) btn.style.display = visible ? 'block' : 'none';
  }

  toggleLoading(isLoading) {
      const spinner = document.getElementById('loading-spinner');
      if (spinner) {
          spinner.style.display = isLoading ? 'block' : 'none';
      }
      
      const btn = document.getElementById('load-more');
      if (btn && isLoading) {
          btn.style.display = 'none';
      }
  }

  showModal(pokemon) {
    if (!this.modal) return;
    
    const body = document.getElementById('modal-body');
    const typeColor = `var(--type-${pokemon.types[0]}, #a8a878)`;
    
    body.innerHTML = `
      <div class="modal-header" style="background: ${typeColor}">
        <img src="${pokemon.image}" alt="${pokemon.name}">
        <h2>${pokemon.name.toUpperCase()}</h2>
        <div class="types">
            ${pokemon.types.map(t => `<span class="type-badge">${t}</span>`).join('')}
        </div>
      </div>
      <div class="modal-details">
        <div class="stats-container">
          <h3>Base Stats</h3>
          ${pokemon.stats.map(s => `
            <div class="stat-row">
              <span class="stat-name">${s.name}</span>
              <div class="stat-bar-bg">
                <div class="stat-bar-fill" style="width: ${(s.value / 255) * 100}%; background: ${typeColor}"></div>
              </div>
              <span class="stat-value">${s.value}</span>
            </div>
          `).join('')}
        </div>
        <div class="info-row">
          <div><strong>Height:</strong> ${pokemon.height / 10} m</div>
          <div><strong>Weight:</strong> ${pokemon.weight / 10} kg</div>
        </div>
        <div class="moves-container">
            <h3>Top Moves</h3>
            <div class="moves-list">
                ${pokemon.moves.map(m => `<span class="move-badge">${m}</span>`).join('')}
            </div>
        </div>
      </div>
    `;
    
    this.modal.classList.remove('hidden');
    
    // Close button
    this.modal.querySelector('.close-modal').onclick = () => {
      this.modal.classList.add('hidden');
    };
    
    // Close on outside click
    window.onclick = (e) => {
      if (e.target === this.modal) {
        this.modal.classList.add('hidden');
      }
    };
  }

  _createCard(pokemon, type = 'list') {
    const mainType = pokemon.types[0];
    const paddedId = String(pokemon.id).padStart(3, '0');
    
    // Capitalize name
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    
    // Type colors (fallback)
    const typeColor = `var(--type-${mainType}, #a8a878)`;

    // Translate types
    const translatedTypes = pokemon.types.map(t => TYPE_TRANSLATIONS[t] || t);
    const mainTranslatedType = translatedTypes[0];
    
    if (type === 'featured') {
      // Layout for featured cards based on new reference image
      return `
        <div class="pokemon-card featured" data-type="${mainType}" data-id="${pokemon.id}">
          <img src="${pokemon.image}" alt="${name}" class="pokemon-img">
          <div class="card-info">
            <div class="info-left">
                <h3>${name}</h3>
                <span class="type-text">${mainTranslatedType}</span>
            </div>
            <span class="pokemon-number">#${paddedId}</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="pokemon-card ${type}" style="--pokemon-color: ${typeColor}" data-id="${pokemon.id}">
        <div class="card-bg-circle"></div>
        <img src="${pokemon.image}" alt="${name}" class="pokemon-img">
        <div class="card-info">
          <h3>${name}</h3>
          <div class="types">
            ${translatedTypes.map(t => `<span class="type-badge">${t}</span>`).join('')}
          </div>
          <span class="pokemon-number">#${paddedId}</span>
        </div>
      </div>
    `;
  }
}
