const pokemonContainer = document.getElementById("pokemon");
const pokemonSearchContainer = document.getElementById("pokemonSearchContainer");
const dialogRef = document.getElementById("myDialog");
let pokemons = [];
let allPokemonsData = [];
let indexOffset = 0;
let currentIndex = 1;
let indexPokemonCount = 0;
let gotOnePokemonsData = [];
let evolutionImageArray = [];
let pokemonSpeciesUrl = [];
let arrayPokemons = [];

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
    beforeTry();
  try {
    pokemonLenghtAndOffset(indexOffset);
    const response = await fetch(`${BASE_URL}pokemon?limit=20&offset=${indexOffset}`);
    const data = await response.json();
    getResultsData(data);
  } catch (error) {
    pokemonContainer.innerHTML = "<li>Faild to load :( </li>";
    return;
  } finally {
    await countPokemonIndex();
    afterTry();}
}

function beforeTry(){
  showLoading(true);
  showLoadButton(false);
  showContent(false);
}

function afterTry(){
  showLoading(false);
  showLoadButton(true);
  showContent(true);
}

function getResultsData(data){
  let pokeData = data.results;
  pokemons.push(...pokeData);
}

async function countPokemonIndex() {
  arrayPokemons.push(...pokemons);
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

function showLoading(isVisible) {
  document.getElementById("loading").classList.toggle("visible", isVisible);
}

function showContent(isVisible) {
  document.getElementById('pokemon').classList.toggle("visible", isVisible);
}

function showLoadButton(isVisible){
  document.getElementById('load-btn').classList.toggle('visible', isVisible);
}

function showLoadEvolutionChain(isVisible){
  document.getElementById('loadingEvolution').classList.toggle('visible', isVisible);
}

function changeImage(direction) { 
  let totalPokemons = allPokemonsData.length;
  currentIndex += direction;
  if (currentIndex >= totalPokemons) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = totalPokemons - 1;
  }
 showPokemonInDialog(currentIndex);
}

function openDialog(index) {
  showPokemonInDialog(index);
  dialogRef.showModal();
}

function closeDialog() {
  dialogRef.close();
}

function logDownBublingPropagation(event) {
  event.stopPropagation();
}

  function showPokemonInDialog(index) {
  let currentPokemon = allPokemonsData[index];
  let pokemonHeight = currentPokemon.height / 10;
  let pokemonWeight = currentPokemon.weight / 10;
      pokemonHeight = pokemonHeight.toFixed(1).replace(".", ",");
      pokemonWeight = pokemonWeight.toFixed(1).replace(".", ",");
      currentIndex = index;
  document.getElementById("showDialogPokemon").innerHTML = pokemonDialogTemplate(index,currentPokemon,pokemonHeight,pokemonWeight);
  getPokemonSpeciesUrl(index); 
  openTab(event, 'about');  
}

 function getPokemonSpeciesUrl(index){
    let speciesUrlPokemon = allPokemonsData[index].species.url;
     fetchPokemonEvolution(speciesUrlPokemon, index);
}

async function fetchPokemonEvolution(pokemonSpeciesUrl ,index) {
  try {
    const response = await fetch(pokemonSpeciesUrl);
    const evolution = await response.json();
    let pokemonEvolutionChainUrl = evolution.evolution_chain;
    let chainUrl = pokemonEvolutionChainUrl.url;
    await fetchPokemonEvolutionChain(chainUrl,index)
  } catch (error) {
    console.log("Faild to fetch Pokemon :/", error);
    pokemonContainer.innerHTML = "<li>Faild to load :( </li>";
    return;
  }
}

async function fetchPokemonEvolutionChain(pokemonEvolutionUrl,index) {
   showLoadEvolutionChain(true);
  try {
    const response = await fetch(pokemonEvolutionUrl);
    const evolution = await response.json();
    let evolutionChainUrl = evolution.chain; 
    resolveEvolutionChainUrl(evolutionChainUrl, index);
  } catch (error) {
    console.log("Faild to fetch Pokemon :/", error);
    pokemonContainer.innerHTML = "<li>Faild to load :( </li>";
    return;
  } finally{showLoadEvolutionChain(false);
  }
}

function resolveEvolutionChainUrl(evolutionChainUrl) {
    let evolvesTo = evolutionChainUrl;
    let imePokemona = evolvesTo.species.name;
    resolveLoeadedPokemons(imePokemona,evolvesTo);
}

async function resolveLoeadedPokemons(imePokemona,evolvesTo){
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

 function filterItems(pokemonArray, query) {
 let gotAPokemon = pokemonArray.filter((searchedPokemon) => searchedPokemon.name.toLowerCase().includes(query.toLowerCase()));
  checkIfPokemonExist(gotAPokemon);
  document.getElementById('searchText').value="";
  document.getElementById('searchBtn').disabled=true;
}

function checkIfPokemonExist(gotAPokemon){
   if(!gotAPokemon.length==0){
   pokemonSearchContainer.innerHTML="";
    for(let index=0; index < gotAPokemon.length; index++){
       let gotPokemonName = gotAPokemon[index].name;
      findPokemonInArray(gotPokemonName);
     }
 }else{
  pokemonSearchContainer.innerHTML="<li data-id='not-found' id='not-found'>The searched Pokémon has not yet been loaded or does not exist! Try a new search!</li>";
  document.getElementById('searchBtn').disabled=true;
  document.getElementById('searchText').value="";
  document.getElementById('goBackBtn').style.display="flex";
  }
}

function findPokemonInArray(gotPokemonName){
   document.getElementById('searchText').value="";
 for(let findIndex=0; findIndex<arrayPokemons.length; findIndex++){
    if(arrayPokemons[findIndex] == undefined ){
      return;
    }else if(arrayPokemons[findIndex].name == gotPokemonName){
     let theIndexIs = arrayPokemons[findIndex];
     showSearchPokemon(theIndexIs.url ,findIndex);
    } 
  } 
}

function canSearch(){
  let btnSearch = document.getElementById('searchBtn');
  let pokemonBtnValue = document.getElementById('searchText').value;
  let textMassage = document.getElementById('text-massage-search');
    if(pokemonBtnValue.length < 3){
      textMassage.innerText="Minimum 3 characters required!";
    }
    else if(pokemonBtnValue.length >= 3){
      btnSearch.disabled=false;
      textMassage.innerText=" ";
    }
}

function searchArray() {
  showLoadButton(false);
  pokemonContainer.style.display="none";
  let pokemonBtnValue = document.getElementById('searchText').value;
  filterItems(arrayPokemons,pokemonBtnValue); 
  document.getElementById('searchBtn').disabled=true;
}

async function showSearchPokemon(pokemonUrl ,indexPokemon) {
  const response = await fetch(pokemonUrl);
  const onePokemonData = await response.json();
  gotOnePokemonsData.push(onePokemonData); 
  putInTemplate(onePokemonData, indexPokemon);
 }

function putInTemplate(onePokemonData, indexPokemon){
  pokemonSearchContainer.style.display="flex";
  let templete = "";
  templete += getTemplatePokemon(onePokemonData, indexPokemon);
  pokemonSearchContainer.innerHTML += templete;
  document.getElementById('goBackBtn').style.display="flex";
}

 function goBackToPokemons(){
  document.getElementById('searchBtn').disabled=true;
  pokemonContainer.style.display="flex";
  showLoadButton(true);
  document.getElementById('goBackBtn').style.display="none";
  pokemonSearchContainer.innerHTML = '';
}