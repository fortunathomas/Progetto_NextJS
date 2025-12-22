// ============================================================================
//  UTILITY FUNCTIONS - Funzioni helper
// ============================================================================

// Configurazione delle versioni (RIMUOVI questa, non più usata)
// export const versionSettings = { ... }

// Calcola il moltiplicatore per ogni cella scoperta
export function calcolaMoltiplicatorePerCella(celleRimaste, bombeRimaste) {
    const celleSicure = celleRimaste - bombeRimaste;
    if (celleSicure <= 0) return 1;

    const probabilitaSicura = celleSicure / celleRimaste;
    return 1 / probabilitaSicura;
}

// Calcola il moltiplicatore base in base alla percentuale di bombe
export function getMoltiplicatoreBase(numBombe, totaleCelle) {
    const percentualeBombe = numBombe / totaleCelle;

    if (percentualeBombe >= 0.5) return 1.15;
    if (percentualeBombe >= 0.4) return 1.12;
    if (percentualeBombe >= 0.3) return 1.10;
    if (percentualeBombe >= 0.2) return 1.08;
    if (percentualeBombe >= 0.1) return 1.05;
    return 1.03;
}

// Calcola il bonus finale in base alla difficoltà
export function getBonusFinale(numBombe, totaleCelle) {
    const percentualeBombe = numBombe / totaleCelle;

    if (percentualeBombe >= 0.5) return 2.5;
    if (percentualeBombe >= 0.4) return 2.0;
    if (percentualeBombe >= 0.3) return 1.7;
    if (percentualeBombe >= 0.2) return 1.5;
    if (percentualeBombe >= 0.1) return 1.3;
    return 1.2;
}

// Ottiene il totale celle in base alla versione
export function getTotaleCelle(versione) {
    return versione === 1 ? 9 : versione === 2 ? 16 : versione === 3 ? 25 : 0;
}

// Genera array di indici casuali per le bombe
export function getRandomBombIndexes(totaleCelle, numBombe) {
    const bombe = [];
    while (bombe.length < numBombe) {
        const indiceBomba = Math.floor(Math.random() * totaleCelle);
        if (!bombe.includes(indiceBomba)) {
            bombe.push(indiceBomba);
        }
    }
    return bombe;
}

// Calcola il massimo numero di bombe (80% delle celle)
export function getMaxBombe(totaleCelle) {
    return Math.floor(totaleCelle * 0.8);
}

// Valida la scommessa
export function validaScommessa(scommessa, saldo) {
    if (scommessa <= 0) {
        return { valid: false, message: "⚠️ Inserisci una scommessa!" };
    }
    if (scommessa > saldo) {
        return { valid: false, message: "⚠️ Saldo insufficiente!" };
    }
    return { valid: true };
}

// Valida la versione
export function validaVersione(versione) {
    if (versione === 0) {
        return { valid: false, message: "⚠️ Seleziona prima una difficoltà!" };
    }
    return { valid: true };
}

// Calcola il premio finale
export function calcolaPremio(scommessa, moltiplicatore, bonus) {
    return Math.floor((scommessa * moltiplicatore) * bonus);
}

// Calcola il premio del cashout
export function calcolaPremioChashout(scommessa, moltiplicatore) {
    return Math.floor(scommessa * moltiplicatore);
}

// Ottiene il numero di colonne per la griglia
export function getGridColumns(versione) {
    return versione === 1 ? 3 : versione === 2 ? 4 : versione === 3 ? 5 : 3;
}

// Ottiene il numero totale di celle (alias di getTotaleCelle)
export function getGridSize(versione) {
    return getTotaleCelle(versione);
}