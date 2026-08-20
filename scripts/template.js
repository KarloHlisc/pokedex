function getTemplatePokemon(pokemonsData, index) {
  return `
    <li data-id='card'>
    <div class="pokemon-cont" onclick="openDialog(${index})">
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

function showStatPokemonTemplate(currentPokemon, indexStat){
  return `<tr>
            <td><b>${currentPokemon.stats[indexStat].stat.name.charAt(0).toUpperCase() + currentPokemon.stats[indexStat].stat.name.slice(1)}:</b></td>
            <td>${currentPokemon.stats[indexStat].base_stat}</td>
            <td><progress data-color="${currentPokemon.stats[indexStat].base_stat}" value="${currentPokemon.stats[indexStat].base_stat}" max="100"></progress></td>
        </tr>`;
}

function pokemonDialogTemplate(index) {
  let currentPokemon = allPokemonsData[index];
  let pokemonHeight = currentPokemon.height / 10;
  let pokemonWeight = currentPokemon.weight / 10;
      pokemonHeight = pokemonHeight.toFixed(1).replace(".", ",");
      pokemonWeight = pokemonWeight.toFixed(1).replace(".", ",");
      currentIndex = index;
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
