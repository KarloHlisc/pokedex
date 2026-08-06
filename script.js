const pokemonContainer = document.getElementById("pokemon");
let pokemons = [];
let allPokemonsData = [];
let indexOffset = 0;
let currentIndex = 1;
let indexPokemonCount = 0;
let totalPokemons = allPokemonsData.length;

const BASE_URL = "https://pokeapi.co/api/v2/";

function init() {
  // showLoading(true);
  fetchPokemon();
}

async function fetchPokemon() {
  showLoading(true);
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
   showLoading(false);
  }
  countPokemonIndex();
}

function showLoading(isVisible){
  document.getElementById("loading").classList.toggle("visible", isVisible);
}

async function countPokemonIndex() {
  let countPokemon = indexOffset;
  for (let index = 0; index < pokemons.length; index++) {
    await getPokemonAbilities(pokemons[index].url);
    templatePokemon(allPokemonsData[index + countPokemon]);
  }
}

async function getPokemonAbilities(pokemonURL) {
  const response = await fetch(pokemonURL);
  const pokemonData = await response.json();
  allPokemonsData.push(pokemonData);
}

function templatePokemon(pokemonsData) {
  let templete = "";
  templete += getTemplatePokemon(pokemonsData, indexPokemonCount);
  pokemonContainer.innerHTML += templete;
  indexPokemonCount++;
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

function changeImage(direction) {
  currentIndex += direction;
  if (currentIndex >= totalPokemons) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = totalPokemons - 1;
  }
 // updateLightboxImage();
}
/////#############################___DIALOG

const dialogRef = document.getElementById("myDialog");

function openDialog(index) {
  showPokeomInDialog(index);
  dialogRef.showModal();
  //  countPokemonIndex();
}

function closeDialog() {
  dialogRef.close();
}

function showPokeomInDialog(index) {
  document.getElementById("showDialogPokemon").innerHTML = pokemonDialogTemplate(index); 
}

function pokemonDialogTemplate(index,pokemonsEvoData) {

  let currentPokemon = allPokemonsData[index];
  let pokemonHeight = currentPokemon.height/10;
  let pokemonWeight = currentPokemon.weight/10;

  pokemonHeight.toFixed(2).replaceAll(".",",");

  return `<div data-id="overlay-pokemon-name" class="dialog-header" >
  
                <h2 id="pokemonName">${currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1)}</h2>
               
                <button data-id="close-dialog-button" class="dialog-button" onclick="closeDialog()">X</button>     
        </div>

        <section >
              <span>#${currentPokemon.id}</span>    <p id="text">Hier siehst du info die ich dir ...</p>
                <div id="poke${currentPokemon.id}" class="pokemon-image-cont ${getPokemonColorInDialog(index)}">
            <img data-id="dialog-image" src="${currentPokemon.sprites.other.dream_world.front_default}" alt="pokemon Bild ${currentPokemon.name}">
             
         </div>
         <div class="card-abilitys">
          <span></span>
         </div>
        </section>
        <section id="dialogInfoPokemon">
         <div class="buttons-swich" > <button data-id="prev-button" onclick="${changeImage(index-1)}"><</button> 
          </div>
            <div class="dialog-poke-types types-cont">
             ${getPokemonTypes(index)}
            </div>
             <div class="buttons-swich" >  <button data-id="next-button" onclick="${changeImage(index)}">></button>
          </div>
        </section>
        <section>

        <div class="tab">
            <button class="tablinks" onclick="openCity(event, 'About')">About</button>
            <button class="tablinks" onclick="openCity(event, 'Base-stats')">Base stats</button>
            <button class="tablinks" onclick="openCity(event, 'Evolution')">Evolution</button>
        </div>

<section class="pokemon-infos">
        <div id="About" class="tabcontent active">
           <table>
      <tr>
        <td><b>Species:</b></td>
        <td> ${currentPokemon.species.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1)}</td>
      </tr>
      <tr>
        <td><b>Height:</b></td>
        <td> ${pokemonHeight} m</td>
      </tr>
      <tr>
        <td><b>Weight:</b></td>
        <td> ${pokemonWeight} kg</td>
      </tr>
      <tr>
        <td><b>Abilities:</b></td>
        <td id="abilities-content"> ${showPokemonAbilities(index)}</td>
      </tr>
     </table>
         
        </div>

        <div id="Base-stats" class="tabcontent active">
          <table>
      <tr>
        <td><b>${currentPokemon.stats[0].stat.name.charAt(0).toUpperCase() + currentPokemon.stats[0].stat.name.slice(1)}:</b></td>
        <td>${currentPokemon.stats[0].base_stat}</td>
        <td><progress data-color="${currentPokemon.stats[0].base_stat}" value="${currentPokemon.stats[0].base_stat}" max="100"></progress></td>
      </tr>
      <tr>
        <td><b>${currentPokemon.stats[1].stat.name.charAt(0).toUpperCase() + currentPokemon.stats[1].stat.name.slice(1)}:</b></td>
        <td>${currentPokemon.stats[1].base_stat}</td>
        <td><progress value="${currentPokemon.stats[1].base_stat}" max="100"></progress></td>
      </tr>
      <tr>
       <td><b>${currentPokemon.stats[2].stat.name.charAt(0).toUpperCase() + currentPokemon.stats[2].stat.name.slice(1)}:</b></td>
        <td>${currentPokemon.stats[2].base_stat}</td>
        <td><progress value="${currentPokemon.stats[2].base_stat}" max="100"></progress></td>
      </tr>
      <tr>
       <td><b>${currentPokemon.stats[3].stat.name.charAt(0).toUpperCase() + currentPokemon.stats[3].stat.name.slice(1)}:</b></td>
        <td>${currentPokemon.stats[3].base_stat}</td>
        <td><progress value="${currentPokemon.stats[3].base_stat}" max="100"></progress></td>
      </tr>
       <tr>
       <td><b>${currentPokemon.stats[4].stat.name.charAt(0).toUpperCase() + currentPokemon.stats[4].stat.name.slice(1)}:</b></td>
        <td>${currentPokemon.stats[4].base_stat}</td>
        <td><progress value="${currentPokemon.stats[4].base_stat}" max="100"></progress></td>
      </tr>
       <tr>
       <td><b>${currentPokemon.stats[5].stat.name.charAt(0).toUpperCase() + currentPokemon.stats[5].stat.name.slice(1)}</b>:</td>
        <td>${currentPokemon.stats[5].base_stat}</td>
        <td><progress value="${currentPokemon.stats[5].base_stat}" max="100"></progress></td>
      </tr>
     </table>
        </div>

        <div id="evolutionPokemon" class="tabcontent">
          <h3>Evolution</h3>
         ${getTemplateEvolutionPokemon(pokemonsEvoData, indexPokemonCount)}
          <p>Hier kommt evolution chain </p>
        </div>
      </section>



        </section>
            
        <div class="dialog-footer">
         
          
        </div>`;
}

/*
function showStatPokemon(currentPokemon){
  let pokemonStat="";
  for(let indexStat = 0; indexStat < currentPokemon.stats.length; indexStat++){
    pokemonStat.innerHTML +=  `
                        <td><b>${currentPokemon.stats[indexStat].stat.name.charAt(0).toUpperCase() + currentPokemon.stats[indexStat].stat.name.slice(1)}:</b></td>
        <td>${currentPokemon.stats[0].base_stat}</td>
        <td><progress data-color="${currentPokemon.stats[indexStat].base_stat}" value="${currentPokemon.stats[indexStat].base_stat}" max="100"></progress></td>
    `;
  }
}
*/

 function showPokemonAbilities(index){
  let specialAbility = ""; 
  let currentAbilitiy = allPokemonsData[index].abilities;
  for(let indexAbility=0; indexAbility < currentAbilitiy.length; indexAbility++){
      specialAbility +=`${allPokemonsData[index].abilities[indexAbility].ability.name}, `; 
  }
  return specialAbility = specialAbility.replace(/,\s*$/, " ");
}

function getPokemonColorInDialog(index) {
  let colorBackground = "";
  let colorPicker = allPokemonsData[index].types[0];
  colorBackground = colorPicker.type.name;
  return colorBackground;
}

function getPokemonTypes(index) {
  let pokemonType ="";
  let pokeTypes = allPokemonsData[index].types;
  for(indexType = 0; indexType < pokeTypes.length; indexType++){
     const element =pokeTypes[indexType];
    pokemonType += `<span class="${element.type.name}" class="pokemon-typle-style"><b>${element.type.name}</b></span>`;
  }
  return pokemonType;
}

function openCity(evt, cityName) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

//_____________________________________ Evolution








///#############SEARCH
/*
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


function renderPokemons(){
  let renderRef = document.getElementById('dialog-pokemon');
  renderRef.innerHTML="";
  for (let index = 0; index < pokemons.length; index++){
    renderRef.innerHTML += getPokemonTemplate(index);
  }
}

function getPokemonTemplate(index){
  return `<div onclick="toggleOverlay${index}" class="single_element">
            <img id=showPokemon" src"" `;
}

function toggleOverlay(index){
  let overlayRef = document.getElementById('overlay')
}


function showDialog() {
  let getDualog = document.getElementById('overlay');
  getDualog.innerHTML = ""
  console.log("open");
}
  /*
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

//showDialog();
*/
