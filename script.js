const pokemonContainer = document.getElementById("pokemon");
let pokemons = [];
let allPokemonsData = [];
let indexOffset = 0;
//let limitPokemon = 20;
const BASE_URL = "https://pokeapi.co/api/v2/";

function init() {
  fetchPokemon();
}

async function fetchPokemon() {
  try {
    if (!pokemons.length == 0) {
      pokemons = [];
      indexOffset += 20;
    }
    const url = `${BASE_URL}pokemon?limit=20&offset=${indexOffset}`;
    const response = await fetch(url);
    const data = await response.json();
    let pokeData = data.results;
    pokemons.push(...pokeData);
  } catch (error) {
    console.log("Faild to fetch Pokemon :/", error);
    pokemonContainer.innerHTML = "<li>Faild to load :( </li>";
    return;
  } finally {
  }
 let  countPokemon = indexOffset;
  for (let index = 0; index <= pokemons.length; index++) {
   if(pokemons[index].url == undefined){
    return 0;
   }
    else{await getPokemonAbilities(pokemons[index].url);} 

    templatePokemon(allPokemonsData[index+countPokemon]);
  }
}

async function getPokemonAbilities(pokemonURL) {
  const response = await fetch(pokemonURL);
  const pokemonData = await response.json();
  allPokemonsData.push(pokemonData);
}

function templatePokemon(pokemonsData) {
  let templete = "";
  templete += `
    <li>
    <div class="pokemon-cont">
        <div class="pokemon-header">
            <span>#${pokemonsData.id}</span>
            <h3>${pokemonsData.name}</h3>
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
  pokemonContainer.innerHTML += templete;
}

function pokemonTypes(pokemonsData) {
  let content = "";
  for (let index = 0; index < pokemonsData.types.length; index++) {
    const element = pokemonsData.types[index];
    content += `<span class="${element.type.name}" class="pokemon-typle-style"><b>${element.type.name}</b> </span>`;
  }
  return content;
}

function getBackgroundColorPokemon(pokemonsData) {
  let bgColor = "";
  const element = pokemonsData.types[0];
  bgColor = element.type.name;
  return bgColor;
}

function loadMorePokemons() {
  fetchPokemon();
}



/*
function showDialog(pokemonsData) {
  document.getElementById("dialog-pokemon").innerHTML = 
  `
     <div id="first-block-pokemon-card">
        <div id="header-card" class="header-card">
          <h3 id="pokemon-id">#${pokemonsData.id}</h3>
          <h2 id="card-pokemon-name">${pokemonsData.name}</h2>
        </div>
        <div id="card-pokemon-img">
          <button id="btn-card-left"><</button>
          <div id="poke${pokemonsData.id}" class="pokemon-image-cont ${getBackgroundColorPokemon(pokemonsData)}">
            <img src="${pokemonsData.sprites.other.dream_world.front_default}" alt="pokemon Bild ${pokemonsData.name}">
        </div>
          <button id="btn-card-right">></button>
        </div>
        <div id="card-pokemon-type">
          <div class="types-cont" id=types-cont>
         ${pokemonTypes(pokemonsData)}
        </div>
        </div>
        <div id="card-pokemon-abilitys">
          <div id="card-main">
            <ul>
                <li></li>
            </ul>
          </div>
          <div id="card-stats">
            <ul>
                <li></li>
            </ul>
          </div>
          <div id="card-evo-chain">
            <ul>
                <li></li>
            </ul>
          </div>
        </div>
      </div>`;
}

showDialog();

*/