"use client";

import React, { useEffect, useState } from 'react';
import { closePopup, initGame } from "@/script/gameLogic";

import '@/styles/globals.css';
import '@/styles/themes.css';
import '@/styles/layout.css';
import '@/styles/controls.css';
import '@/styles/game.css';
import '@/styles/popups.css';
import '@/styles/animations.css';
import '@/styles/bomb-controls.css';


const Layout = ({ }: { children: React.ReactNode }) => {
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        initGame();

        const gridElement = document.getElementById('grid');
        if (gridElement) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && gridElement.children.length > 0) {
                        setGameStarted(true);
                    } else if (mutation.type === 'childList' && gridElement.children.length === 0) {
                        // ⬇️ AGGIUNGI QUESTA RIGA
                        setGameStarted(false);
                    }
                });
            });

            observer.observe(gridElement, { childList: true });
            return () => observer.disconnect();
        }
    }, []);

    return (
        <html lang="it">
        <head>
            <title>💎 Caccia al Tesoro</title>
            <link rel="stylesheet" href="../styles/globals.css" />
            <script src="../script/gameLogic.js" defer></script>
        </head>
        <body>

        <div id="theme-switcher">
            <button id="theme-button" aria-label="Cambia tema">🎨</button>
            <div id="theme-menu" className="hidden">
                <div className="theme-menu-title">Scegli Tema</div>
                <button className="theme-option" data-theme="default">
                    <span className="theme-preview" style={{background: "linear-gradient(135deg, #ffc400, #00cc66)"}}></span>
                    <span>Classico</span>
                </button>
                <button className="theme-option" data-theme="dark">
                    <span className="theme-preview" style={{background: "linear-gradient(135deg, #60a5fa, #a78bfa)"}}></span>
                    <span>Scuro</span>
                </button>
                <button className="theme-option" data-theme="neon">
                    <span className="theme-preview" style={{background: "linear-gradient(135deg, #ec4899, #06b6d4)"}}></span>
                    <span>Neon</span>
                </button>
                <button className="theme-option" data-theme="forest">
                    <span className="theme-preview" style={{background: "linear-gradient(135deg, #10b981, #34d399)"}}></span>
                    <span>Foresta</span>
                </button>
                <button className="theme-option" data-theme="sunset">
                    <span className="theme-preview" style={{background: "linear-gradient(135deg, #f59e0b, #ef4444)"}}></span>
                    <span>Tramonto</span>
                </button>
                <button className="theme-option" data-theme="ocean">
                    <span className="theme-preview" style={{background: "linear-gradient(135deg, #0ea5e9, #06b6d4)"}}></span>
                    <span>Oceano</span>
                </button>

                {/* Nuovi Temi */}
                <button className="theme-option" data-theme="cyberpunk">
                    <span className="theme-preview" style={{background: "linear-gradient(135deg, #ff00ff, #00ffff)"}}></span>
                    <span>Cyberpunk</span>
                </button>
                <button className="theme-option" data-theme="lava">
                    <span className="theme-preview" style={{background: "linear-gradient(135deg, #ff4500, #ff8c00)"}}></span>
                    <span>Lava</span>
                </button>
                <button className="theme-option" data-theme="arctic">
                    <span className="theme-preview" style={{background: "linear-gradient(135deg, #00d4ff, #b3e5fc)"}}></span>
                    <span>Arctic</span>
                </button>
                <button className="theme-option" data-theme="goldRush">
                    <span className="theme-preview" style={{background: "linear-gradient(135deg, #ffd700, #ffb347)"}}></span>
                    <span>Gold Rush</span>
                </button>
                <button className="theme-option" data-theme="purpleHaze">
                    <span className="theme-preview" style={{background: "linear-gradient(135deg, #9c27b0, #e91e63)"}}></span>
                    <span>Purple Haze</span>
                </button>
                <button className="theme-option" data-theme="matrix">
                    <span className="theme-preview" style={{background: "linear-gradient(135deg, #00ff00, #39ff14)"}}></span>
                    <span>Matrix</span>
                </button>

            </div>
        </div>

        <div className="game-container">

            <header className="game-header">
                <div className="balance-display">
                    <span className="balance-label">💰 Saldo</span>
                    <span className="balance-amount"><span id="caramelle"></span> 💵</span>
                </div>
            </header>

            <div className="game-layout">

                <aside className="controls-panel">

                    <section className="control-section">
                        <h3 className="section-title">Seleziona Difficoltà</h3>
                        <div className="version-buttons">
                            <button id="Versione1" className="version-btn">
                                <span className="version-number">3×3</span>
                                <span className="version-label">Facile</span>
                            </button>
                            <button id="Versione2" className="version-btn">
                                <span className="version-number">4×4</span>
                                <span className="version-label">Medio</span>
                            </button>
                            <button id="Versione3" className="version-btn">
                                <span className="version-number">5×5</span>
                                <span className="version-label">Difficile</span>
                            </button>
                        </div>
                    </section>

                    {/* Bomb Selection */}
                    <section className="control-section">
                        <h3 className="section-title">Numero Bombe 💣</h3>
                        <div className="bomb-control">
                            <button id="decreaseBombs" className="bomb-btn">−</button>
                            <input
                                type="number"
                                id="numBombe"
                                className="bomb-input"
                                min="1"
                                max="20"
                                defaultValue="1"
                            />
                            <button id="increaseBombs" className="bomb-btn">+</button>
                        </div>
                        <div id="riskLevel" className="risk-indicator">SELEZIONA GRIGLIA</div>
                    </section>

                    <section className="control-section">
                        <h3 className="section-title">Imposta Puntata</h3>
                        <div className="bet-input-wrapper">
                            <input type="number" id="scommessa" placeholder="0" defaultValue="0" />
                        </div>
                        <div className="bet-buttons">
                            <button id="somma5" className="bet-btn">+5</button>
                            <button id="somma10" className="bet-btn">+10</button>
                            <button id="somma50" className="bet-btn">+50</button>
                            <button id="somma100" className="bet-btn">+100</button>
                        </div>
                        <button id="maxbet" className="max-bet-btn">MAX BET</button>
                    </section>

                    <section className="control-section info-section">
                        <div className="info-row">
                            <span className="info-label">Moltiplicatore</span>
                            <span className="info-value">×<span id="moltiplicatore"></span></span>
                        </div>
                        <div className="info-row highlight">
                            <span className="info-label">Vincita Potenziale</span>
                            <span className="info-value"><span id="vincita"></span> 💵</span>
                        </div>

                        {/* ⬇️ AGGIUNGI QUESTA RIGA */}
                        <div className="info-row">
                            <span className="info-label">Celle Sicure</span>
                            <span className="info-value"><span id="celleSicure">0</span>/<span id="totaleCelle">0</span></span>
                        </div>


                    </section>

                    <div className="action-buttons">
                        <button id="start" className="action-btn primary-btn">
                            🎮 INIZIA PARTITA
                        </button>
                        <button id="accontentati" className="action-btn secondary-btn">
                            💰 RITIRA VINCITA
                        </button>
                    </div>

                </aside>

                <main className="game-area">
                    <div className={`grid-wrapper ${!gameStarted ? 'hidden' : ''}`}>
                        <div id="grid"></div>
                    </div>
                </main>

            </div>
        </div>

        {/* Popup Sconfitta */}
        <div id="loseOverlay" className="overlay">
            <div id="losePopup" className="popup popup-lose">
                <div className="popup-icon">💣</div>
                <h2 className="popup-title">HAI PERSO!</h2>
                <p className="popup-message">
                    La bomba ti ha fatto saltare in aria!<br/>
                    Hai trovato <strong><span id="statCelleTrovate">0</span></strong> diamanti 💎
                </p>
                <button onClick={closePopup} className="popup-btn">Riprova</button>
            </div>
        </div>

        {/* Popup Vittoria */}
        <div id="winOverlay" className="overlay">
            <div id="winPopup" className="popup popup-win">
                <div className="popup-icon">💎</div>
                <h2 className="popup-title">HAI VINTO!</h2>
                <p className="popup-message">
                    Hai trovato tutti i tesori!<br/>
                    Vincita: <strong><span id="statVincita">0</span> 💵</strong>
                </p>
                <button onClick={closePopup} className="popup-btn">Fantastico!</button>
            </div>
        </div>

        {/* Popup Incasso */}
        <div id="cashoutOverlay" className="overlay">
            <div id="cashoutPopup" className="popup popup-cashout">
                <div className="popup-icon">💰</div>
                <h2 className="popup-title">VINCITA RITIRATA!</h2>
                <p className="popup-message">
                    Hai incassato la tua vincita!<br/>
                    Totale: <strong><span id="statCashout">0</span> 💵</strong>
                </p>
                <button onClick={closePopup} className="popup-btn">Perfetto!</button>
            </div>
        </div>

        </body>
        </html>
    );
};

export default Layout;