"use client";

import React, { useEffect, useState } from 'react';
import '../styles/globals.css';
import { closePopup, setCaramelle, initGame } from "../script/gameLogic.js";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        // Inizializza il gioco dopo che il DOM è pronto
        initGame();

        // Listener per mostrare la griglia quando il gioco inizia
        const gridElement = document.getElementById('grid');
        if (gridElement) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && gridElement.children.length > 0) {
                        setGameStarted(true);
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

                    <section className="control-section">
                        <h3 className="section-title">Imposta Puntata</h3>
                        <div className="bet-input-wrapper">
                            <input type="number" id="scommessa" placeholder="0" />
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
                <p className="popup-message">La bomba ti ha fatto saltare in aria!</p>
                <button onClick={closePopup} className="popup-btn">Riprova</button>
            </div>
        </div>

        {/* Popup Vittoria */}
        <div id="winOverlay" className="overlay">
            <div id="winPopup" className="popup popup-win">
                <div className="popup-icon">💎</div>
                <h2 className="popup-title">HAI VINTO!</h2>
                <p className="popup-message">Hai trovato tutti i tesori!</p>
                <button onClick={closePopup} className="popup-btn">Fantastico!</button>
            </div>
        </div>

        {/* Popup Incasso */}
        <div id="cashoutOverlay" className="overlay">
            <div id="cashoutPopup" className="popup popup-cashout">
                <div className="popup-icon">💰</div>
                <h2 className="popup-title">VINCITA RITIRATA!</h2>
                <p className="popup-message">Hai incassato la tua vincita!</p>
                <button onClick={closePopup} className="popup-btn">Perfetto!</button>
            </div>
        </div>

        </body>
        </html>
    );
};

export default Layout;