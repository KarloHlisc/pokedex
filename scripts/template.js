function getTemplatePokemon(pokemonsData) {
  return `
    <li>
    <div class="pokemon-cont">
        <div class="pokemon-header">
            <span>#${pokemonsData.id}</span>
            <h3>${pokemonsData.name.charAt(0).toUpperCase()+pokemonsData.name.slice(1)}</h3>
        </div>
        <div id="poke${pokemonsData.id}" class="pokemon-image-cont ${getBackgroundColorPokemon(pokemonsData)}">
            <img src="${pokemonsData.sprites.other.dream_world.front_default}" alt="pokemon Bild ${pokemonsData.name}">
        </div>
        <div class="types-cont" id=types-cont>
         ${pokemonTypes(pokemonsData)}
        </div>
    </div>
    </li>
    `;
}

