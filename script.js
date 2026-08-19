const pokemonContainer = document.getElementById("pokemon");
const dialogRef = document.getElementById("myDialog");
let pokemons = [];
let allPokemonsData = [];
let indexOffset = 0;
let currentIndex = 1;
let indexPokemonCount = 0;
let gotOnePokemonsData = [];
let evolutionImageArray = [];
let pokemonSpeciesUrl = [];

// let currentPokemonEvolutionData = [];

const BASE_URL = "https://pokeapi.co/api/v2/";

function init() {
  fetchPokemon();
}

function pokemonLenghtAndOffset(){
  if (!pokemons.length == 0) {
      pokemons = [];
      indexOffset += 20;
    }
    return indexOffset;
}

async function fetchPokemon() {
    showLoading(true);
    showLoadButton(false);
  try {
    pokemonLenghtAndOffset(indexOffset);
    const url = `${BASE_URL}pokemon?limit=20&offset=${indexOffset}`;
    const response = await fetch(url);
    const data = await response.json();
    getResultsData(data);
    await countPokemonIndex();
  } catch (error) {
    console.log("Faild to fetch Pokemon :/", error);
    pokemonContainer.innerHTML = "<li>Faild to load :( </li>";
    return;
  } finally {
    showLoading(false);
    showLoadButton(true);
  }
}

function getResultsData(data){
  let pokeData = data.results;
  pokemons.push(...pokeData);
}

function showLoading(isVisible) {
  document.getElementById("loading").classList.toggle("visible", isVisible);
  document.getElementById("loading-overlay").classList.toggle("visible", isVisible);
}

function showLoadButton(isVisible){
  document.getElementById('load-btn').classList.toggle('visible', isVisible);
}

function showLoadEvolutionChain(isVisible){
  document.getElementById('loadingEvolution').classList.toggle('visible', isVisible);
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
    content += `<span class="${element.type.name}" class="pokemon-typle-style"><b>${element.type.name}</b></span>`;
  }
  return content;
}

function getBackgroundColorPokemon(pokemonsData) {
  let bgColor = "";
  const element = pokemonsData.types[0];
  bgColor = element.type.name;
  return bgColor;
}

async function loadMorePokemons() { 
 await fetchPokemon();
}

function changeImage(direction) { 
  let totalPokemons = allPokemonsData.length;
  currentIndex += direction;
  if (currentIndex >= totalPokemons) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = totalPokemons - 1;
  }
 showPokeomInDialog(currentIndex);
}

function openDialog(index) {
  showPokeomInDialog(index);
  openTab(event, 'about');
//  let stopScrolling = document.getElementById("body");
//  stopScrolling.classList.add("stop-scroll");
  dialogRef.showModal();
}

function closeDialog() {
 // let stopScrolling = document.getElementById("body");
//  stopScrolling.classList.remove("stop-scroll");
  dialogRef.close();
}

function logDownBublingPropagation(event) {
  event.stopPropagation();
}

function showPokeomInDialog(index) {
  document.getElementById("showDialogPokemon").innerHTML = pokemonDialogTemplate(index);
  getPokemonSpeciesUrl(index); 
  openTab(event, 'about');  
}

 function getPokemonSpeciesUrl(index){
    let speciesUrlPokemon = allPokemonsData[index].species.url;
     fetchPokemonEvolution(speciesUrlPokemon, index);
}

async function fetchPokemonEvolution(pokemonSpeciesUrl ,index) {
  //showLoadEvolutionChain(true);
  try {
    const url = pokemonSpeciesUrl;
    const response = await fetch(url);
    const evolution = await response.json();
    let pokemonEvolutionChainUrl = evolution.evolution_chain;
    let chainUrl = pokemonEvolutionChainUrl.url;
    await fetchPokemonEvolutionChain(chainUrl,index)
  } catch (error) {
    console.log("Faild to fetch Pokemon :/", error);
    pokemonContainer.innerHTML = "<li>Faild to load :( </li>";
    return;
  } finally {
   // showLoadEvolutionChain(false);
  }
}

async function fetchPokemonEvolutionChain(pokemonEvolutionUrl,index) {
  showLoadEvolutionChain(true);
  try {
    const url = pokemonEvolutionUrl;
    const response = await fetch(url);
    const evolution = await response.json();
    let evolutionChainUrl = evolution.chain; 
    resolveEvolutionChainUrl(evolutionChainUrl, index);
  } catch (error) {
    console.log("Faild to fetch Pokemon :/", error);
    pokemonContainer.innerHTML = "<li>Faild to load :( </li>";
    return;
  } finally {
    showLoadEvolutionChain(false);
  }
}

async function  resolveEvolutionChainUrl(evolutionChainUrl) {
    let evolvesTo = evolutionChainUrl;
    let imePokemona = evolvesTo.species.name;
     if(imePokemona != ""){
        await staviPokemonNutra(imePokemona);
      } else{ return;
           }  
     if (!evolvesTo.evolves_to[0].species.name){ return;
      } else{
            await staviPokemonNutra(evolvesTo.evolves_to[0].species.name);   
            }  
     if (!evolvesTo.evolves_to[0].evolves_to.length){ return;
     }  else{
        await staviPokemonNutra(evolvesTo.evolves_to[0].evolves_to[0].species.name); 
  }  
}

async function staviPokemonNutra(imePokemona){
  const pokemonImage = await getSpecificPokemonImg(imePokemona);
  const evoluRef = document.getElementById('showEvolutionChains');
  let pokemonEvolutionName = imePokemona.charAt(0).toUpperCase() + imePokemona.slice(1);
  evoluRef.innerHTML +=`<div class="poke-chain-list"><h4>${pokemonEvolutionName} </h4><img id="pokemon-chain-img" src="${pokemonImage}" alt"${pokemonEvolutionName}"></div>`;
  return evoluRef;
}

async function getSpecificPokemonImg(imePokemona) {
  const pokemonEvolutionImage = BASE_URL+'pokemon/'+imePokemona+'/';
  const response = await fetch(pokemonEvolutionImage);
  const evolutionData = await response.json();
  const evolutionImagePokemon = evolutionData.sprites.other.dream_world.front_default;
  return evolutionImagePokemon;
}

function pokemonDialogTemplate(index) {
  let currentPokemon = allPokemonsData[index];
  let pokemonHeight = currentPokemon.height / 10;
  let pokemonWeight = currentPokemon.weight / 10;

 pokemonHeight = pokemonHeight.toFixed(1).replace(".", ",");
 pokemonWeight = pokemonWeight.toFixed(1).replace(".", ",");

 currentIndex = index;

// getPokemonDialogTemplate(index,currentPokemon, pokemonHeight, pokemonWeight)
  return `<div data-id="overlay-pokemon-name" class="dialog-header" >
                  <h2 id="pokemonName">${currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1)}</h2>
                  <button data-id="close-dialog-button" class="dialog-button" onclick="closeDialog()">X</button>     
          </div>
        <section >
                <p id="text-id-pokemon" class="${getPokemonColorInDialog(index)}">#${currentPokemon.id}</p>
                <div id="poke${currentPokemon.id}" class="pokemon-image-cont ${getPokemonColorInDialog(index)}">
            <img data-id="dialog-image" src="${currentPokemon.sprites.other.dream_world.front_default}" alt="pokemon Bild ${currentPokemon.name}">    
         </div>
         <div class="card-abilitys">
          <span></span>
         </div>
        </section>
        <section id="dialogInfoPokemon">
         <div class="buttons-swich" > <button data-id="prev-button" class="dialog-button" onclick="changeImage(-1)"><</button> 
          </div>
            <div class="dialog-poke-types types-cont">
             ${getPokemonTypes(index)}
            </div>
             <div class="buttons-swich" >  <button data-id="next-button" class="dialog-button" onclick="changeImage(1)">></button>
          </div>
        </section>
      <section>
        <div class="tab">
            <button class="tablinks" onclick="openTab(event, 'about')">About</button>
            <button class="tablinks" onclick="openTab(event, 'base-stats')">Base stats</button>
            <button class="tablinks" onclick="openTab(event, 'evolution')">Evolution</button>
        </div>
      </section>
      <section class="pokemon-infos">
        <div id="about" class="tabcontent">
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
        <div id="base-stats" class="tabcontent">
           <table>
            ${showStatPokemon(currentPokemon)}
           </table>
        </div>
        <div id="evolution" class="tabcontent">
            <h3>Evolution chain:</h3>
            <div id="loadingEvolution">
        <img src="./assets/icons/poke_ball_icon.png" alt="Lädt...">
            </div>
              <div id="showEvolutionChains"></div>
        </div>
      </section>
        <div class="dialog-footer"> 
        </div>`;       
}

function showStatPokemon(currentPokemon) {
  let pokemonStat = "";
  for (let indexStat = 0; indexStat < currentPokemon.stats.length; indexStat++) {
    pokemonStat += showStatPokemonTemplate(currentPokemon, indexStat);
  }
  return pokemonStat;
}

function showPokemonAbilities(index) {
  let specialAbility = "";
  let currentAbilitiy = allPokemonsData[index].abilities;
  for (let indexAbility = 0; indexAbility < currentAbilitiy.length; indexAbility++) {
    specialAbility += `${allPokemonsData[index].abilities[indexAbility].ability.name}, `;
  }
  return (specialAbility = specialAbility.replace(/,\s*$/, " "));
}

function getPokemonColorInDialog(index) {
  let colorBackground = "";
  let colorPicker = allPokemonsData[index].types[0];
  colorBackground = colorPicker.type.name;
  return colorBackground;
}

function getPokemonTypes(index) {
  let pokemonType = "";
  let pokeTypes = allPokemonsData[index].types;
  for (indexType = 0; indexType < pokeTypes.length; indexType++) {
    const element = pokeTypes[indexType];
    pokemonType += `<span class="${element.type.name}" class="pokemon-typle-style"><b>${element.type.name}</b></span>`;
  }
  return pokemonType;
}

function openTab(event, pokemonName) {
  let tabIndex, tabContent, tabLinks;
  tabContent = document.getElementsByClassName("tabcontent");
  for (tabIndex = 0; tabIndex < tabContent.length; tabIndex++) {
       tabContent[tabIndex].style.display = "none";
  }
  tabLinks = document.getElementsByClassName("tablinks");
  for (tabIndex = 0; tabIndex < tabLinks.length; tabIndex++) {
    tabLinks[tabIndex].className = tabLinks[tabIndex].className.replace(" active", "");
  }
  document.getElementById(pokemonName).style.display = "block";
  event.currentTarget.className += " active";
}

///#############SEARCH

 function filterItems(pokemonArray, query) {
 let gotAPokemon = pokemonArray.filter((searchedPokemon) => searchedPokemon.name.toLowerCase().includes(query.toLowerCase()));
if(!gotAPokemon.length){
  pokemonContainer.innerHTML="<li>The searched Pokémon has not yet been loaded or does not exist! Try a new search!</li>";
  pokemonContainer.innerHTML += `<button id="goBackBtn" onclick="goBackToPokemons()">Go back</button>`;
  pokemonContainer.setAttribute("class", "column");
  return;
 }
for(let index=0; gotAPokemon.length; index++){
  let gotPokemonName = gotAPokemon[index].name;
  findPokemonInArray(gotPokemonName);
  }
}

function findPokemonInArray(gotPokemonName){
   document.getElementById('searchText').value="";
 for(let findIndex=0; pokemons.length; findIndex++){
    if(pokemons[findIndex] == undefined ){
      return;
    }else if(pokemons[findIndex].name == gotPokemonName){
     console.log(pokemons[findIndex]);
     let theIndexIs = pokemons[findIndex];
     showSearchPokemon(theIndexIs.url ,findIndex);
    } 
  } 
}

function searchArray() {
  showLoadButton(false);
    let btnSearch = document.getElementById('searchBtn');
    let pokemonBtnValue = document.getElementById('searchText').value;
   filterItems(pokemons,pokemonBtnValue); 
}

async function showSearchPokemon(pokemonUrl ,indexPokemon) {
    const response = await fetch(pokemonUrl);
  const onePokemonData = await response.json();
  gotOnePokemonsData.push(onePokemonData); 
 putInTemplate(onePokemonData, indexPokemon);
 }

function putInTemplate(onePokemonData, indexPokemon){
 let templete = "";
  templete += getTemplatePokemon(onePokemonData, indexPokemon);
  pokemonContainer.innerHTML = templete;
  pokemonContainer.innerHTML += `<button id="goBackBtn" onclick="goBackToPokemons()">Go to start</button>`;
  pokemonContainer.setAttribute("class", "column");
}

async function goBackToPokemons(){
 pokemonContainer.innerHTML = "";
  indexOffset=0;
 await countPokemonIndex();
  showLoadButton(true);
  pokemonContainer.removeAttribute("class", "column");
    pokemonContainer.innerHTML = "";
    loadMorePokemons();
}
