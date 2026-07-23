const pokemonContainer = document.getElementById("pokemon");
let pokemons = [];
let allPokemonsData = [];
let indexOffset = 0;

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
 countPokemonIndex();
}

async function countPokemonIndex() {
  let  countPokemon = indexOffset;
  for (let index = 0; index < pokemons.length; index++) {
      await getPokemonAbilities(pokemons[index].url);
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
  templete += getTemplatePokemon(pokemonsData);
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

function filterItems(arr, query) {
 // for(let index=0; index < arr.length; index++){
  //  let pokemonName = arr[index].name;
 //   console.log(pokemonName);
    
 console.log( arr.filter((el) => el.name.toLowerCase().includes(query.toLowerCase())));
// return arr.filter((el) => el.name.toLowerCase().includes(query.toLowerCase()))
}
//}
function searchArray() {
    let btnSearch = document.getElementById('search-btn');
    let polemonBtnValue = document.getElementById('search-text').value;
   
    console.log(filterItems(pokemons,polemonBtnValue));
    document.getElementById('pokemon').innerHTML=templatePokemon(polemonBtnValue);
   showSarchPokemon(polemonBtnValue);
}

function showSarchPokemon(arr ,el,pokemonsData) {
  //  templatePokemon(arr);
//  document.getElementById('pokemon').innerHTML=templatePokemon(el.name);
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