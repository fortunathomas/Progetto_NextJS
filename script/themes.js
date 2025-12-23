// ============================================================================
//  THEME MANAGEMENT - Gestione temi
// ============================================================================

export let currentTheme = 'default';

// Definizione dei temi disponibili
export const themes = {
    default: {
        primary: '#ffc400',
        primaryHover: '#ffae00',
        secondary: '#00cc66',
        background: '#0b0f1a',
        cardBg: '#111627',
        cellBg: '#1a2030',
        text: '#ffffff',
        textDark: '#000000'
    },
    neon: {
        primary: '#ec4899',
        primaryHover: '#db2777',
        secondary: '#06b6d4',
        background: '#0f172a',
        cardBg: '#1e293b',
        cellBg: '#334155',
        text: '#f0abfc',
        textDark: '#0f172a'
    },
    forest: {
        primary: '#10b981',
        primaryHover: '#059669',
        secondary: '#34d399',
        background: '#064e3b',
        cardBg: '#065f46',
        cellBg: '#047857',
        text: '#d1fae5',
        textDark: '#064e3b'
    },
    cyberpunk: {
        primary: '#ff00ff',
        primaryHover: '#cc00cc',
        secondary: '#00ffff',
        background: '#0a0a0a',
        cardBg: '#1a0a1f',
        cellBg: '#2d1b3d',
        text: '#00ffff',
        textDark: '#0a0a0a'
    },
    lava: {
        primary: '#ff4500',
        primaryHover: '#ff6347',
        secondary: '#ff8c00',
        background: '#1a0000',
        cardBg: '#330000',
        cellBg: '#4d0000',
        text: '#ffcc99',
        textDark: '#1a0000'
    },
    arctic: {
        primary: '#00d4ff',
        primaryHover: '#00bfea',
        secondary: '#b3e5fc',
        background: '#0a1929',
        cardBg: '#1e3a52',
        cellBg: '#2d4f6b',
        text: '#e1f5fe',
        textDark: '#0a1929'
    },
    goldRush: {
        primary: '#ffd700',
        primaryHover: '#ffed4e',
        secondary: '#ffb347',
        background: '#000000',
        cardBg: '#1a1410',
        cellBg: '#2d2416',
        text: '#fff8dc',
        textDark: '#000000'
    },
    purpleHaze: {
        primary: '#9c27b0',
        primaryHover: '#ba68c8',
        secondary: '#e91e63',
        background: '#1a0033',
        cardBg: '#2d0052',
        cellBg: '#3d006b',
        text: '#f3e5f5',
        textDark: '#1a0033'
    },
    matrix: {
        primary: '#00ff00',
        primaryHover: '#00cc00',
        secondary: '#39ff14',
        background: '#000000',
        cardBg: '#001a00',
        cellBg: '#003300',
        text: '#00ff00',
        textDark: '#000000'
    }
};

// Mappatura tema -> immagine
const themeImages = {
    'default': 'images/gray-square.png',
    'neon': 'images/neon-square.png',
    'forest': 'images/forest-square.png',
    'lava': 'images/lava-square.png',
    'cyberpunk': 'images/cyberpunk-square.png',
    'arctic': 'images/arctic-square.png',
    'goldRush': 'images/gold-square.png',
    'matrix': 'images/matrix-square.png',
    'purpleHaze': 'images/purple-haze-square.png',
};

// Ottiene l'immagine per un tema specifico
export function getThemeImage(theme) {
    return themeImages[theme] || themeImages['default'];
}

// Applica un tema all'interfaccia
export function applyTheme(themeName) {
    currentTheme = themeName;
    const theme = themes[themeName];

    if (!theme) return;

    // Applica le variabili CSS
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-primary-hover', theme.primaryHover);
    document.documentElement.style.setProperty('--color-secondary', theme.secondary);
    document.documentElement.style.setProperty('--color-background', theme.background);
    document.documentElement.style.setProperty('--color-card-bg', theme.cardBg);
    document.documentElement.style.setProperty('--color-cell-bg', theme.cellBg);
    document.documentElement.style.setProperty('--color-text', theme.text);
    document.documentElement.style.setProperty('--color-text-dark', theme.textDark);

    // Aggiorna i pulsanti del menu tema
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.remove('active');
        // ⬇️ USA getAttribute invece di dataset per React
        if (btn.getAttribute('data-theme') === themeName) {
            btn.classList.add('active');
        }
    });
}

// Aggiorna le immagini delle celle durante il gioco
export function updateCellImages(celle, cliccata) {
    celle.forEach((cella, index) => {
        if (!cliccata[index]) {
            const img = cella.querySelector('img.cella-img');
            if (img) {
                img.src = getThemeImage(currentTheme);
            }
        }
    });
}

// Inizializza il theme switcher
export function initThemeSwitcher(onThemeChange) {
    const themeButton = document.getElementById('theme-button');
    const themeMenu = document.getElementById('theme-menu');

    if (!themeButton || !themeMenu) {
        console.error("Theme switcher elements not found");
        return;
    }

    // Toggle del menu
    themeButton.addEventListener('click', () => {
        themeMenu.classList.toggle('hidden');
    });

    // Listener per ogni opzione tema
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.addEventListener('click', () => {
            // ⬇️ USA getAttribute invece di dataset per React
            const themeName = btn.getAttribute('data-theme');
            applyTheme(themeName);
            themeMenu.classList.add('hidden');

            // Callback per aggiornare le celle se il gioco è in corso
            if (onThemeChange) {
                onThemeChange(themeName);
            }
        });
    });

    // Applica il tema default all'avvio
    applyTheme('default');
}