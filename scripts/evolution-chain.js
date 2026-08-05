
let evolutionPokemons = [];
let allEvolutionPokemonsData = [];
let indexEvoPokemonCount = 0;
let allSpeciesEvolutionPokemonsData = [];

async function fetchEvolutionPokemon() {
 // showLoading(true);
  try {
    if (!evolutionPokemons.length == 0) {
      evolutionPokemons = [];
      indexOffset += 20;
    }
    const url = `${BASE_URL}evolution-chain?limit=20`;
    console.log(url);
    
    const response = await fetch(url);
    const evolutionData = await response.json();
    let pokeEvolutionData = evolutionData.results;
    evolutionPokemons.push(...pokeEvolutionData);

    console.log(evolutionPokemons);
  //  console.log(pokeEvolutionData);
    
  } catch (error) {
    console.log("Faild to fetch Pokemon :/", error);
    pokemonContainer.innerHTML = "<li>Faild to load :( </li>";
    return;
  } finally {
   //showLoading(false);
  }
  countEvolutionPokemonIndex();
}

fetchEvolutionPokemon();

async function countEvolutionPokemonIndex() {
  let countEvoPokemon = indexOffset;
  for (let index = 0; index < evolutionPokemons.length; index++) {
    await getPokemonEvoAbilities(evolutionPokemons[index].url);
   // console.log(evolutionPokemons[index].url);
    
    templateEvolutionPokemon(allEvolutionPokemonsData[index + countEvoPokemon]);
  }
}


async function getPokemonEvoAbilities(pokemonEvolutuinURL) {
  const response = await fetch(pokemonEvolutuinURL);
  const pokemonEvolutionData = await response.json();
  allEvolutionPokemonsData.push(pokemonEvolutionData);
}
  

function templateEvolutionPokemon(pokemonsEvoData) {
  let templete = "";
  templete += getTemplateEvolutionPokemon(pokemonsEvoData, indexPokemonCount);
  pokemonContainer.innerHTML += templete;
  indexEvoPokemonCount++;

  console.log(pokemonsEvoData);
  
}


/*

function getTemplateEvolutionPokemon(pokemonsEvoData, indexPokemonCount){
    let pokemonEvolvsTo = pokemonsEvoData.chain.evolves_to[indexPokemonCount];
 //   console.log(pokemonsEvoData.chain.species.url);
  //  let pokemonSpeciesUrl = pokemonsEvoData.chain.species.url;
   // getPokemonEvoAbilities(pokemonSpeciesUrl);
     return `
    <li> 

    <div class="pokemon-cont" onclick="openDialog(${indexPokemonCount})">
        <div class="pokemon-header">
            <span>#${pokemonsEvoData.chain.species.name}</span>evolves to >
            <h3>${pokemonEvolvsTo.species.name.charAt(0).toUpperCase()+pokemonEvolvsTo.species.name.slice(1)}</h3> evolves to >
            <h3>${pokemonEvolvsTo.evolves_to[indexPokemonCount].species.name.charAt(0).toUpperCase()+pokemonEvolvsTo.evolves_to[indexPokemonCount].species.name.slice(1)}</h3>
        </div>
        <div id="poke${pokemonsEvoData.id}" class="pokemon-image-cont {getBackgroundColorPokemon(pokemonsEvoData)}">
            <img src="{allSpeciesEvolutionPokemonsData[indexEvoPokemonCount].sprites.other.dream_world.front_default}" alt="pokemon Bild {pokemonsEvoData.name}">
        </div>
        <div class="types-cont" id=types-cont>
         {pokemonTypes(pokemonsEvoData)}
        </div>
    </div>
    </li>
   `;
}
/*
async function getPokemonEvoAbilities(pokemonSpeciesUrl) {
  const response = await fetch(pokemonSpeciesUrl);
  const pokemonSpeciesData = await response.json();
  allSpeciesEvolutionPokemonsData.push(pokemonSpeciesData);
}
  */



