// ============================================================================
//  GAME LOGIC - Logica principale del gioco
// ============================================================================

import * as state from './state.js';
import * as grid from './grid.js';
import * as utils from './utils.js';
import * as popups from './popups.js';
import * as themes from './themes.js';
import {hideGridWrapper} from "./grid.js";

// ============================================================================
//  FUNZIONE DI INIZIALIZZAZIONE PRINCIPALE
// ============================================================================
export function initGame() {
    console.log("Initializing game...");

    // Verifica elementi DOM essenziali
    const elementi = verificaElementiDOM();
    if (!elementi.success) {
        console.error("Elementi del gioco non trovati");
        return;
    }

    // Inizializza i controlli
    initVersionControls(elementi);
    initBetControls(elementi);
    initActionButtons(elementi);
    initThemeSystem();

    // Seleziona automaticamente la difficoltà Facile
    state.setVersione(1);
    elementi.v1.classList.add("active");

    // Inizializza il saldo iniziale
    state.setCaramelle(500);

    console.log("Game initialized successfully");
}

// ============================================================================
//  VERIFICA ELEMENTI DOM
// ============================================================================
function verificaElementiDOM() {
    const v1 = document.getElementById("Versione1");
    const v2 = document.getElementById("Versione2");
    const v3 = document.getElementById("Versione3");
    const start = document.getElementById("start");
    const accontentati = document.getElementById("accontentati");
    const scommessa = document.getElementById("scommessa");

    if (!v1 || !v2 || !v3 || !start || !accontentati || !scommessa) {
        return { success: false };
    }

    return {
        success: true,
        v1, v2, v3, start, accontentati, scommessa
    };
}

// ============================================================================
//  INIZIALIZZAZIONE CONTROLLI VERSIONE
// ============================================================================
function initVersionControls({ v1, v2, v3 }) {
    const versioni = [v1, v2, v3];

    // Listener per cambiare la versione
    versioni.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            if (state.inGioco) return;
            
            versioni.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            state.setVersione(index + 1);
        });
    });
}

// ============================================================================
//  INIZIALIZZAZIONE CONTROLLI SCOMMESSA
// ============================================================================
function initBetControls({ scommessa }) {
    const somma5 = document.getElementById("somma5");
    const somma10 = document.getElementById("somma10");
    const somma50 = document.getElementById("somma50");
    const somma100 = document.getElementById("somma100");
    const maxbet = document.getElementById("maxbet");

    if (!somma5 || !somma10 || !somma50 || !somma100 || !maxbet) {
        console.error("Bet control buttons not found");
        return;
    }

    // Input manuale della scommessa
    scommessa.addEventListener("input", () => {
        if (state.inGioco) {
            scommessa.value = state.totalescommessa;
            return;
        }
        const valore = parseInt(scommessa.value) || 0;
        setTotaleScommessa(valore);
    });

    // Pulsanti per aggiungere importi
    somma5.addEventListener("click", () => aggiungiScommessa(5));
    somma10.addEventListener("click", () => aggiungiScommessa(10));
    somma50.addEventListener("click", () => aggiungiScommessa(50));
    somma100.addEventListener("click", () => aggiungiScommessa(100));
    maxbet.addEventListener("click", () => aggiungiScommessa(state.getCaramelle()));
}

// Imposta il totale della scommessa
function setTotaleScommessa(n) {
    if (state.inGioco) {
        state.updateScommessaInput(state.totalescommessa);
        return;
    }

    if (n < 0) n = 0;
    if (n > state.getCaramelle()) n = state.getCaramelle();

    state.setTotalescommessa(n);
    state.updateScommessaInput(n);
    state.aggiornaMoltiplicatore();
}

// Aggiunge un importo alla scommessa
function aggiungiScommessa(amount) {
    if (state.inGioco) return;
    setTotaleScommessa(state.totalescommessa + amount);
}

// ============================================================================
//  INIZIALIZZAZIONE PULSANTI AZIONE
// ============================================================================
function initActionButtons({ start, accontentati }) {
    // Pulsante Start
    start.addEventListener("click", startGame);

    // Pulsante Cashout
    accontentati.addEventListener("click", cashout);
}

// ============================================================================
//  AVVIO PARTITA
// ============================================================================
function startGame() {
    // Valida la versione
    const versionCheck = utils.validaVersione(state.versione);
    if (!versionCheck.valid) {
        alert(versionCheck.message);
        return;
    }

    // Valida la scommessa
    const betCheck = utils.validaScommessa(state.totalescommessa, state.getCaramelle());
    if (!betCheck.valid) {
        alert(betCheck.message);
        return;
    }

    // Reset stato
    state.setInGioco(true);
    state.setMoltiplicatore(1);
    state.setTrovati(0);
    state.aggiornaMoltiplicatore();

    // Crea la griglia
    const success = grid.creaGriglia(state.versione, themes.currentTheme);
    if (!success) {
        console.error("Failed to create grid");
        state.setInGioco(false);
        return;
    }

    // Aggiunge i listener alle celle
    grid.addAllClickHandlers(state.versione);
}

// ============================================================================
//  CASHOUT
// ============================================================================
function cashout() {
    if (!state.inGioco) return;

    const premio = utils.calcolaPremioChashout(state.totalescommessa, state.cmoltiplicatore);

    hideGridWrapper(); // ← Aggiunto

    // Aggiorna il saldo (premio - scommessa iniziale)
    state.setCaramelle(state.getCaramelle() + premio - state.totalescommessa);
    state.setInGioco(false);

    // Mostra popup di cashout
    popups.showCashoutPopup();
}

// ============================================================================
//  RESET PARTITA
// ============================================================================
export function resetGame() {
    popups.hideAllPopups();
    grid.clearGrid();
    state.resetState();
}

// Funzione wrapper per chiudere i popup (compatibilità con HTML)
export function closePopup() {
    resetGame();
}

// ============================================================================
//  INIZIALIZZAZIONE SISTEMA TEMI
// ============================================================================
function initThemeSystem() {
    themes.initThemeSwitcher((newTheme) => {
        // Callback: aggiorna le immagini delle celle se il gioco è in corso
        if (state.inGioco) {
            themes.updateCellImages(grid.celle, grid.cliccata);
        }
    });
}

// ============================================================================
//  ESPORTAZIONI PER COMPATIBILITÀ
// ============================================================================
export { state, grid, utils, popups, themes };
export const setCaramelle = state.setCaramelle;
