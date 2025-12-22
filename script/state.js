// ============================================================================
//  STATE MANAGEMENT - Gestione stato del gioco
// ============================================================================

// Variabili di stato
export let versione = 0;
export let inGioco = false;
export let totalescommessa = 0;
export let cmoltiplicatore = 1;
export let trovati = 0;

export let numBombe = 1;  // Numero di bombe selezionate

// Setter per numBombe
export function setNumBombe(value) {
    numBombe = value;
}

// Setters per modificare lo stato
export function setVersione(v) {
    versione = v;
}

export function setInGioco(value) {
    inGioco = value;
}

export function setTotalescommessa(value) {
    totalescommessa = value;
}

export function setMoltiplicatore(value) {
    cmoltiplicatore = value;
}

export function setTrovati(value) {
    trovati = value;
}

export function incrementTrovati() {
    trovati++;
}

export function multiplyMoltiplicatore(factor) {
    cmoltiplicatore *= factor;
}

// ============================================================================
//  GESTIONE SALDO (CARAMELLE)
// ============================================================================
export function setCaramelle(n) {
    if (n < 0) n = 0;
    const elemento = document.getElementById("caramelle");
    if (elemento) {
        elemento.textContent = n;
    }
}

export function getCaramelle() {
    return parseInt(document.getElementById("caramelle")?.textContent) || 0;
}

// ============================================================================
//  GESTIONE SCOMMESSA
// ============================================================================
export function updateScommessaInput(value) {
    const scommessa = document.getElementById("scommessa");
    if (scommessa) {
        scommessa.value = value;
    }
}

export function resetScommessa() {
    totalescommessa = 0;
    updateScommessaInput(0);
}

// ============================================================================
//  GESTIONE MOLTIPLICATORE
// ============================================================================
export function aggiornaMoltiplicatore(versione = 0, numBombe = 1) {
    const moltiplicatoreEl = document.getElementById("moltiplicatore");
    const vincitaEl = document.getElementById("vincita");
    const celleSicureEl = document.getElementById("celleSicure");
    const totaleCelleEl = document.getElementById("totaleCelle");

    if (moltiplicatoreEl) moltiplicatoreEl.textContent = cmoltiplicatore.toFixed(2);
    if (vincitaEl) vincitaEl.textContent = Math.floor(totalescommessa * cmoltiplicatore);

    // Aggiorna contatore celle sicure
    const totaleCelle = getTotaleCelle(versione);
    const celleSicureTotali = totaleCelle - numBombe;
    if (celleSicureEl) celleSicureEl.textContent = trovati;
    if (totaleCelleEl) totaleCelleEl.textContent = celleSicureTotali;

    if (inGioco && cmoltiplicatore > 1) {
        moltiplicatoreEl?.parentElement.classList.add('pulse');
        vincitaEl?.parentElement.classList.add('pulse');

        setTimeout(() => {
            moltiplicatoreEl?.parentElement.classList.remove('pulse');
            vincitaEl?.parentElement.classList.remove('pulse');
        }, 500);
    }
}

// Helper per ottenere il totale celle
function getTotaleCelle(versione) {
    return versione === 1 ? 9 : versione === 2 ? 16 : versione === 3 ? 25 : 0;
}

// ============================================================================
//  RESET STATO
// ============================================================================
export function resetState() {
    versione = 0;
    inGioco = false;
    totalescommessa = 0;
    cmoltiplicatore = 1;
    trovati = 0;
    numBombe = 1;  // ← AGGIUNGI questa riga
    resetScommessa();
    aggiornaMoltiplicatore();
}
