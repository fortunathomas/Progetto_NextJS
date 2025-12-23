// ============================================================================
//  GRID MANAGEMENT - Gestione griglia e celle
// ============================================================================

import * as state from './state.js';
import * as utils from './utils.js';
import * as animations from './animations.js';
import * as popups from './popups.js';
import { getThemeImage } from './themes.js';
import { onBalanceUpdate } from './gameLogic.js';

// Array per gestire le celle
export let celle = [];
export let bombe = []; // ← CAMBIATO da tesori
export let cliccata = [];

// Flag per prevenire click multipli rapidi
let isProcessingClick = false;

// Reset degli array
export function resetArrays() {
    celle = [];
    bombe = []; // ← CAMBIATO da tesori
    cliccata = [];
    isProcessingClick = false; // Reset del flag
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

// Rimuove tutte le celle dalla griglia
export function clearGrid() {
    celle.forEach(c => c.remove());
    resetArrays();
    isProcessingClick = false; // Reset del flag
    hideGridWrapper();
}

// Crea la griglia di gioco
export function creaGriglia(versione, numBombe, currentTheme) {
    const grid = document.getElementById("grid");
    if (!grid) {
        console.error("Grid element not found");
        return false;
    }

    // Pulisce la griglia esistente
    clearGrid();

    // Ottiene le dimensioni dalla versione
    const gridSize = utils.getTotaleCelle(versione);
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

    // Genera gli indici delle bombe (multiple!)
    bombe = utils.getRandomBombIndexes(gridSize, numBombe);

    // Mostra il wrapper della griglia
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
    // ⬇️ BLOCCA TUTTI I CLICK SE STA GIÀ PROCESSANDO
    if (isProcessingClick) return;

    // Previene click multipli sulla stessa cella
    if (cliccata[index]) return;

    // ⬇️ ATTIVA IL FLAG PER BLOCCARE ALTRI CLICK
    isProcessingClick = true;

    cliccata[index] = true;
    const cella = celle[index];

    // Animazione iniziale
    animations.addRevealAnimation(cella);

    await animations.delay(150); // ← RIDOTTO da 200 a 150

    cella.innerHTML = "";

    // Controlla se è una bomba
    if (bombe.includes(index)) {
        await handleBombClick(cella, versione, numBombe);
        // Non resetta il flag perché il gioco è finito
        return;
    }

    // È un diamante
    await handleDiamondClick(cella, versione, numBombe);

    // ⬇️ RILASCIA IL FLAG DOPO CHE L'ANIMAZIONE È FINITA
    isProcessingClick = false;
}

// Gestisce il click su una bomba
async function handleBombClick(cella, versione, numBombe) {
    animations.addBombAnimation(cella);
    cella.innerHTML = "💣";
    animations.shakeGrid();

    // Rivela tutte le celle
    await animations.delay(150); // ← RIDOTTO da 200 a 150
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

    await animations.delay(300); // ← RIDOTTO da 400 a 300

    hideGridWrapper();

    // Aggiorna il saldo
    state.setCaramelle(state.getCaramelle() - state.totalescommessa);

    // ⬇️ VALIDA LA SCOMMESSA DOPO AVER PERSO
    onBalanceUpdate();

    // Aggiorna statistiche
    const statEl = document.getElementById("statCelleTrovate");
    if (statEl) statEl.textContent = state.trovati;

    state.setInGioco(false);

    // Mostra popup di sconfitta
    popups.showLosePopup();
}

// Gestisce il click su un diamante
async function handleDiamondClick(cella, versione, numBombe) {
    const isCombo = state.trovati >= 2;

    animations.addDiamondAnimation(cella, isCombo);
    cella.innerHTML = "💎";

    state.incrementTrovati();

    // Calcola moltiplicatore con la formula corretta
    const totaleCelle = utils.getTotaleCelle(versione);
    const nuovoMoltiplicatore = utils.calcolaMoltiplicatorePerCella(
        totaleCelle,
        numBombe,
        state.trovati
    );

    // DEBUG
    console.log(`🎲 Trovati: ${state.trovati}/${totaleCelle - numBombe}`);
    console.log(`📊 Nuovo moltiplicatore: ${nuovoMoltiplicatore.toFixed(4)}x`);

    state.setMoltiplicatore(nuovoMoltiplicatore);
    state.aggiornaMoltiplicatore();

    // Controlla se ha vinto (trovato tutti i diamanti)
    const celleSicureTotali = totaleCelle - numBombe;
    if (state.trovati === celleSicureTotali) {
        await handleVictory(versione, numBombe);
    }
}

// Gestisce la vittoria completa
async function handleVictory(versione, numBombe) {
    // Rivela le bombe rimaste
    await animations.delay(150); // ← RIDOTTO da 200 a 150
    celle.forEach((c, i) => {
        if (!cliccata[i]) {
            c.innerHTML = "";
            if (bombe.includes(i)) {
                c.classList.add('bomb-reveal-win');
                c.innerHTML = "💣";
            }
        }
    });

    await animations.delay(400); // ← RIDOTTO da 500 a 400

    const totaleCelle = utils.getTotaleCelle(versione);
    const bonus = utils.getBonusFinale(numBombe, totaleCelle);
    const premio = utils.calcolaPremio(
        state.totalescommessa,
        state.cmoltiplicatore,
        bonus
    );

    // Nascondi la griglia
    hideGridWrapper();

    // Aggiorna il saldo
    state.setCaramelle(state.getCaramelle() + premio);

    // ⬇️ VALIDA LA SCOMMESSA DOPO AVER VINTO
    onBalanceUpdate();

    // Aggiorna statistiche
    const statEl = document.getElementById("statVincita");
    if (statEl) statEl.textContent = premio;

    state.setInGioco(false);

    // Mostra popup di vittoria
    popups.showWinPopup();
}