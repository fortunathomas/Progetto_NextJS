// ============================================================================
//  GRID MANAGEMENT - Gestione griglia e celle
// ============================================================================

import * as state from './state.js';
import * as utils from './utils.js';
import * as animations from './animations.js';
import * as popups from './popups.js';
import { getThemeImage } from './themes.js';

// Array per gestire le celle
export let celle = [];
export let tesori = [];
export let cliccata = [];

// Reset degli array
export function resetArrays() {
    celle = [];
    tesori = [];
    cliccata = [];
}

// Rimuove tutte le celle dalla griglia
export function clearGrid() {
    celle.forEach(c => c.remove());
    resetArrays();
    hideGridWrapper(); // ← Aggiunto
}

// Crea la griglia di gioco
export function creaGriglia(versione, currentTheme) {
    const grid = document.getElementById("grid");
    if (!grid) {
        console.error("Grid element not found");
        return false;
    }

    // Pulisce la griglia esistente
    clearGrid();

    // Ottiene le dimensioni dalla versione
    const gridSize = utils.getGridSize(versione);
    const columns = utils.getGridColumns(versione);

    if (gridSize === 0) {
        console.error("Invalid grid size");
        return false;
    }

    // Imposta le colonne della griglia
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    // Crea le celle
    for (let i = 0; i < gridSize; i++) {
        const cella = creaCella(i, currentTheme);
        grid.appendChild(cella);
        celle.push(cella);
        cliccata.push(false);
    }

    // Genera l'indice della bomba
    const indiceBomba = utils.getRandomBombIndex(celle.length);
    tesori = [indiceBomba];

    // Alla fine della funzione
    showGridWrapper(); // ← Aggiunto
    return true;
}

// Crea una singola cella
function creaCella(index, currentTheme) {
    const cella = document.createElement("button");
    const img = document.createElement("img");

    img.src = getThemeImage(currentTheme);
    img.classList.add("cella-img");

    cella.appendChild(img);
    cella.id = "cella_" + index;

    return cella;
}

// Aggiunge il listener di click alla cella
export function addCellClickHandler(cella, index, versione) {
    cella.addEventListener("click", () => handleCellClick(index, versione));
}

// Aggiunge i listener a tutte le celle
export function addAllClickHandlers(versione) {
    celle.forEach((cella, index) => {
        addCellClickHandler(cella, index, versione);
    });
}

// Gestisce il click su una cella
async function handleCellClick(index, versione) {
    // Previene click multipli sulla stessa cella
    if (cliccata[index]) return;
    
    cliccata[index] = true;
    const cella = celle[index];

    // Animazione iniziale
    animations.addRevealAnimation(cella);

    await animations.delay(300);

    cella.innerHTML = "";

    // Controlla se è una bomba
    if (tesori.includes(index)) {
        await handleBombClick(cella);
        return;
    }

    // È un diamante
    await handleDiamondClick(cella, versione);
}

// Gestisce il click su una bomba
async function handleBombClick(cella) {
    animations.addBombAnimation(cella);
    cella.innerHTML = "💣";
    animations.shakeGrid();

    await animations.delay(600);

    hideGridWrapper();
    // Aggiorna il saldo
    state.setCaramelle(state.getCaramelle() - state.totalescommessa);
    state.setInGioco(false);

    // Mostra popup di sconfitta
    popups.showLosePopup();
}

// Gestisce il click su un diamante
async function handleDiamondClick(cella, versione) {
    const isCombo = state.trovati >= 2;
    
    animations.addDiamondAnimation(cella, isCombo);
    cella.innerHTML = "💎";
    
    state.incrementTrovati();

    // Aggiorna il moltiplicatore
    const boost = utils.getSafeBoost(versione);
    state.multiplyMoltiplicatore(boost);
    state.aggiornaMoltiplicatore();

    // Controlla se ha vinto (trovato tutti i diamanti)
    if (state.trovati === celle.length - 1) {
        await handleVictory(versione);
    }
}

// Gestisce la vittoria completa
async function handleVictory(versione) {
    await animations.delay(800);

    hideGridWrapper();
    const bonus = utils.getBonusFinale(versione);
    const premio = utils.calcolaPremio(
        state.totalescommessa, 
        state.cmoltiplicatore, 
        bonus
    );

    // Aggiorna il saldo
    state.setCaramelle(state.getCaramelle() + premio);
    state.setInGioco(false);

    // Mostra popup di vittoria
    popups.showWinPopup();
}

// Nasconde il wrapper della griglia
export function hideGridWrapper() {
    const gridWrapper = document.querySelector('.grid-wrapper');
    if (gridWrapper) {
        gridWrapper.classList.add('hidden');
    }
}

// Mostra il wrapper della griglia
export function showGridWrapper() {
    const gridWrapper = document.querySelector('.grid-wrapper');
    if (gridWrapper) {
        gridWrapper.classList.remove('hidden');
    }
}