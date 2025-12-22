// ============================================================================
//  GAME LOGIC - Logica principale del gioco
// ============================================================================

import * as state from './state.js';
import * as grid from './grid.js';
import * as utils from './utils.js';
import * as popups from './popups.js';
import * as themes from './themes.js';

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

    // ⬇️ SELEZIONA 3×3 PRIMA DI INIZIALIZZARE I CONTROLLI
    state.setVersione(1);
    elementi.v1.classList.add("active");

    // Inizializza i controlli
    initVersionControls(elementi);
    initBetControls(elementi);
    initBombControls(); // Ora versione è già 1, quindi sa che max è 7
    initActionButtons(elementi);
    initThemeSystem();

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

            // Aggiorna max bombe quando cambia versione
            if (window._aggiornaMaxBombe) {
                window._aggiornaMaxBombe();
            }
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
//  INIZIALIZZAZIONE CONTROLLI BOMBE
// ============================================================================
function initBombControls() {
    const numBombeInput = document.getElementById("numBombe");
    const decreaseBombs = document.getElementById("decreaseBombs");
    const increaseBombs = document.getElementById("increaseBombs");
    const riskLevel = document.getElementById("riskLevel");

    if (!numBombeInput || !decreaseBombs || !increaseBombs) {
        console.warn("Bomb control elements not found");
        return;
    }

    // Aggiorna il max quando cambia versione
    function aggiornaMaxBombe() {
        if (state.versione === 0) {
            numBombeInput.max = 1;
            state.setNumBombe(1);
            numBombeInput.value = 1;
            return;
        }

        const maxBombe = utils.getMaxBombe(state.versione);
        numBombeInput.max = maxBombe;

        if (state.numBombe > maxBombe) {
            state.setNumBombe(maxBombe);
            numBombeInput.value = maxBombe;
        }

        aggiornaRischio();
        state.aggiornaMoltiplicatore();
    }

    // Aggiorna livello di rischio
    function aggiornaRischio() {
        if (!riskLevel) return;

        const totaleCelle = utils.getTotaleCelle(state.versione);
        if (totaleCelle === 0) {
            riskLevel.textContent = "SELEZIONA GRIGLIA";
            riskLevel.className = "risk-indicator";
            return;
        }

        const percentuale = (state.numBombe / totaleCelle) * 100;

        if (percentuale >= 50) {
            riskLevel.textContent = "ESTREMO 🔥";
            riskLevel.className = "risk-indicator risk-extreme";
        } else if (percentuale >= 40) {
            riskLevel.textContent = "MOLTO ALTO ⚠️";
            riskLevel.className = "risk-indicator risk-very-high";
        } else if (percentuale >= 30) {
            riskLevel.textContent = "ALTO 📈";
            riskLevel.className = "risk-indicator risk-high";
        } else if (percentuale >= 20) {
            riskLevel.textContent = "MEDIO ⚖️";
            riskLevel.className = "risk-indicator risk-medium";
        } else if (percentuale >= 10) {
            riskLevel.textContent = "BASSO 📉";
            riskLevel.className = "risk-indicator risk-low";
        } else {
            riskLevel.textContent = "MOLTO BASSO 🛡️";
            riskLevel.className = "risk-indicator risk-very-low";
        }
    }

    // Listeners
    decreaseBombs.addEventListener("click", () => {
        if (state.inGioco) return;
        const min = parseInt(numBombeInput.min) || 1;
        if (state.numBombe > min) {
            state.setNumBombe(state.numBombe - 1);
            numBombeInput.value = state.numBombe;
            aggiornaRischio();
            state.aggiornaMoltiplicatore();
        }
    });

    increaseBombs.addEventListener("click", () => {
        if (state.inGioco) return;
        const max = parseInt(numBombeInput.max);
        if (state.numBombe < max) {
            state.setNumBombe(state.numBombe + 1);
            numBombeInput.value = state.numBombe;
            aggiornaRischio();
            state.aggiornaMoltiplicatore();
        }
    });

    numBombeInput.addEventListener("change", () => {
        if (state.inGioco) return;
        let val = parseInt(numBombeInput.value) || 1;
        const min = parseInt(numBombeInput.min) || 1;
        const max = parseInt(numBombeInput.max);

        if (val < min) val = min;
        if (val > max) val = max;

        state.setNumBombe(val);
        numBombeInput.value = val;
        aggiornaRischio();
        state.aggiornaMoltiplicatore();
    });

    // ⬇️ AGGIUNGI LISTENER PER PREVENIRE INPUT MANUALE OLTRE IL MAX
    numBombeInput.addEventListener("input", () => {
        if (state.inGioco) return;
        let val = parseInt(numBombeInput.value) || 1;
        const min = parseInt(numBombeInput.min) || 1;
        const max = parseInt(numBombeInput.max);

        if (val < min) {
            numBombeInput.value = min;
            val = min;
        }
        if (val > max) {
            numBombeInput.value = max;
            val = max;
        }

        state.setNumBombe(val);
        aggiornaRischio();
        state.aggiornaMoltiplicatore();
    });

    // Esporta per usarla quando cambia versione
    window._aggiornaMaxBombe = aggiornaMaxBombe;

    // ⬇️ CHIAMA SUBITO ALL'INIZIALIZZAZIONE
    aggiornaMaxBombe();
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

    // Crea la griglia CON numero bombe
    const success = grid.creaGriglia(state.versione, state.numBombe, themes.currentTheme);
    if (!success) {
        console.error("Failed to create grid");
        state.setInGioco(false);
        return;
    }

    // Aggiunge i listener alle celle CON numero bombe
    grid.addAllClickHandlers(state.versione, state.numBombe);
}

// ============================================================================
//  CASHOUT
// ============================================================================
function cashout() {
    if (!state.inGioco) return;

    if (state.trovati === 0) {
        alert("⚠️ Devi scoprire almeno una cella prima di ritirare!");
        return;
    }

    const premio = utils.calcolaPremioChashout(state.totalescommessa, state.cmoltiplicatore);

    // Rivela tutte le celle
    grid.celle.forEach((c, i) => {
        if (!grid.cliccata[i]) {
            c.innerHTML = "";
            if (grid.bombe.includes(i)) {
                c.classList.add('bomb-reveal-cashout');
                c.innerHTML = "💣";
            } else {
                c.classList.add('diamond-reveal-missed');
                c.innerHTML = "💎";
            }
        }
    });

    setTimeout(() => {
        grid.hideGridWrapper();

        state.setCaramelle(state.getCaramelle() + premio - state.totalescommessa);

        // Aggiorna statistiche
        const statEl = document.getElementById("statCashout");
        if (statEl) statEl.textContent = premio;

        state.setInGioco(false);
        popups.showCashoutPopup();
    }, 500);
}

// ============================================================================
//  RESET PARTITA
// ============================================================================
export function resetGame() {
    popups.hideAllPopups();
    grid.clearGrid();

    // Salva la scommessa corrente prima del reset
    const scommessaCorrente = state.totalescommessa;

    // Reset dello stato
    state.setInGioco(false);
    state.setMoltiplicatore(1);
    state.setTrovati(0);

    // Resetta alla modalità 3x3
    state.setVersione(1);

    // Riattiva il pulsante 3x3
    const v1 = document.getElementById("Versione1");
    const v2 = document.getElementById("Versione2");
    const v3 = document.getElementById("Versione3");

    if (v1 && v2 && v3) {
        v1.classList.add("active");
        v2.classList.remove("active");
        v3.classList.remove("active");
    }

    // Aggiorna max bombe per 3x3
    if (window._aggiornaMaxBombe) {
        window._aggiornaMaxBombe();
    }

    // Mantieni la scommessa precedente
    state.setTotalescommessa(scommessaCorrente);
    state.updateScommessaInput(scommessaCorrente);

    // Aggiorna il moltiplicatore
    state.aggiornaMoltiplicatore();
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