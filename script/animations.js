// ============================================================================
//  ANIMATIONS - Gestione animazioni
// ============================================================================

// Aggiunge animazione di rivelazione alla cella
export function addRevealAnimation(cella) {
    cella.classList.add('revealing');
}

// Rimuove animazione di rivelazione
export function removeRevealAnimation(cella) {
    cella.classList.remove('revealing');
}

// Aggiunge animazione per la bomba
export function addBombAnimation(cella) {
    cella.classList.remove('revealing');
    cella.classList.add('bomb-reveal');
}

// Aggiunge animazione per il diamante
export function addDiamondAnimation(cella, isCombo = false) {
    cella.classList.remove('revealing');
    cella.classList.add('diamond-reveal');
    
    if (isCombo) {
        cella.classList.add('combo-hit');
    }
}

// Aggiunge shake alla griglia
export function shakeGrid() {
    const gridWrapper = document.querySelector('.grid-wrapper');
    if (gridWrapper) {
        gridWrapper.classList.add('shake');
        setTimeout(() => {
            gridWrapper.classList.remove('shake');
        }, 500);
    }
}

// Rimuove tutte le animazioni da una cella
export function clearCellAnimations(cella) {
    cella.classList.remove('revealing', 'bomb-reveal', 'diamond-reveal', 'combo-hit');
}

// Anima il pulse del moltiplicatore (già gestito in state.js ma qui per consistenza)
export function pulseMoltiplicatore() {
    const moltiplicatoreEl = document.getElementById("moltiplicatore");
    const vincitaEl = document.getElementById("vincita");

    moltiplicatoreEl?.parentElement.classList.add('pulse');
    vincitaEl?.parentElement.classList.add('pulse');

    setTimeout(() => {
        moltiplicatoreEl?.parentElement.classList.remove('pulse');
        vincitaEl?.parentElement.classList.remove('pulse');
    }, 500);
}

// Aggiunge un delay per le animazioni
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Sequenza completa di animazione per la bomba
export async function animateBombSequence(cella) {
    addRevealAnimation(cella);
    await delay(300);
    cella.innerHTML = "";
    addBombAnimation(cella);
    cella.innerHTML = "💣";
    shakeGrid();
    await delay(600);
}

// Sequenza completa di animazione per il diamante
export async function animateDiamondSequence(cella, isCombo = false) {
    addRevealAnimation(cella);
    await delay(300);
    cella.innerHTML = "";
    addDiamondAnimation(cella, isCombo);
    cella.innerHTML = "💎";
}

// Animazione bomba secondaria (per le altre bombe)
export function addBombSecondaryAnimation(cella) {
    cella.classList.add('bomb-reveal-secondary');
}

// Animazione diamante mancato
export function addDiamondMissedAnimation(cella) {
    cella.classList.add('diamond-reveal-missed');
}

// Animazione bomba alla vittoria
export function addBombWinAnimation(cella) {
    cella.classList.add('bomb-reveal-win');
}

// Animazione bomba al cashout
export function addBombCashoutAnimation(cella) {
    cella.classList.add('bomb-reveal-cashout');
}