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
export let bombe = [];
export let cliccata = [];

// Reset degli array
export function resetArrays() {
    celle = [];
    bombe = [];
    cliccata = [];
}

// Rimuove tutte le celle dalla griglia
export function clearGrid() {
    celle.forEach(c => c.remove());
    resetArrays();
    hideGridWrapper(); // ← Aggiunto
}

// Crea la griglia di gioco
export function creaGriglia(versione, numBombe, currentTheme) {
    const grid = document.getElementById("grid");
    if (!grid) {
        console.error("Grid element not found");
        return false;
    }

    clearGrid();

    const gridSize = utils.getTotaleCelle(versione);
    const columns = utils.getGridColumns(versione);

    if (gridSize === 0) {
        console.error("Invalid grid size");
        return false;
    }

    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    // Crea le celle
    for (let i = 0; i < gridSize; i++) {
        const cella = creaCella(i, currentTheme);
        grid.appendChild(cella);
        celle.push(cella);
        cliccata.push(false);
    }

    // Genera gli indici delle bombe (non più solo 1!)
    bombe = utils.getRandomBombIndexes(gridSize, numBombe);

    showGridWrapper();
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
export function addCellClickHandler(cella, index, versione, numBombe) {
    cella.addEventListener("click", () => handleCellClick(index, versione, numBombe));
}

// Aggiunge i listener a tutte le celle
export function addAllClickHandlers(versione, numBombe) {
    celle.forEach((cella, index) => {
        addCellClickHandler(cella, index, versione, numBombe);
    });
}

// Gestisce il click su una cella
async function handleCellClick(index, versione, numBombe) {
    if (cliccata[index]) return;

    cliccata[index] = true;
    const cella = celle[index];

    animations.addRevealAnimation(cella);
    await animations.delay(300);

    cella.innerHTML = "";

    // Controlla se è una bomba
    if (bombe.includes(index)) {
        await handleBombClick(cella, versione, numBombe);
        return;
    }

    // È un diamante
    await handleDiamondClick(cella, versione, numBombe);
}

// Gestisce il click su una bomba
async function handleBombClick(cella, versione, numBombe) {
    animations.addBombAnimation(cella);
    cella.innerHTML = "💣";
    animations.shakeGrid();

    // Rivela tutte le celle
    await animations.delay(300);
    celle.forEach((c, i) => {
        if (!cliccata[i]) {
            c.innerHTML = "";
            if (bombe.includes(i)) {
                c.classList.add('bomb-reveal-secondary');
                c.innerHTML = "💣";
            } else {
                c.classList.add('diamond-reveal-missed');
                c.innerHTML = "💎";
            }
        }
    });

    await animations.delay(700);

    hideGridWrapper();

    // Aggiorna saldo e mostra popup
    state.setCaramelle(state.getCaramelle() - state.totalescommessa);

    // Aggiorna statistiche
    const statEl = document.getElementById("statCelleTrovate");
    if (statEl) statEl.textContent = state.trovati;

    state.setInGioco(false);
    popups.showLosePopup();
}

// Gestisce il click su un diamante
async function handleDiamondClick(cella, versione, numBombe) {
    const isCombo = state.trovati >= 2;

    animations.addDiamondAnimation(cella, isCombo);
    cella.innerHTML = "💎";

    state.incrementTrovati();

    // Calcola moltiplicatore dinamico
    const totaleCelle = utils.getTotaleCelle(versione);
    const celleRimaste = totaleCelle - state.trovati;
    const bombeRimaste = numBombe;

    const stepMolt = utils.calcolaMoltiplicatorePerCella(celleRimaste, bombeRimaste);
    state.multiplyMoltiplicatore(stepMolt);
    state.aggiornaMoltiplicatore(versione, numBombe);

    // Controlla vittoria
    const celleSicureTotali = totaleCelle - numBombe;
    if (state.trovati === celleSicureTotali) {
        await handleVictory(versione, numBombe);
    }
}

// Gestisce la vittoria completa
async function handleVictory(versione, numBombe) {
    // Rivela le bombe rimaste
    await animations.delay(300);
    celle.forEach((c, i) => {
        if (!cliccata[i]) {
            c.innerHTML = "";
            if (bombe.includes(i)) {
                c.classList.add('bomb-reveal-win');
                c.innerHTML = "💣";
            }
        }
    });

    await animations.delay(900);

    const totaleCelle = utils.getTotaleCelle(versione);
    const bonus = utils.getBonusFinale(numBombe, totaleCelle);
    const premio = utils.calcolaPremio(
        state.totalescommessa,
        state.cmoltiplicatore,
        bonus
    );

    hideGridWrapper();

    // Aggiorna saldo
    state.setCaramelle(state.getCaramelle() + premio);

    // Aggiorna statistiche
    const statEl = document.getElementById("statVincita");
    if (statEl) statEl.textContent = premio;

    state.setInGioco(false);
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