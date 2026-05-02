// src/core/config.js
import { Theme } from './theme.js';

export const GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 360,   // Mobil standart genişlik
    height: 740,  // Mobil standart yükseklik (9:16 civarı)
    backgroundColor: Theme.background,
    scale: {
        mode: Phaser.Scale.FIT, // Ekrana sığdır
        autoCenter: Phaser.Scale.CENTER_BOTH // Merkeze hizala
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false } // Fizik istemediğin için kapalı tutuyoruz
    }
};