// src/core/config.js
import Phaser from 'phaser'; // <-- BU SATIRI EKLEYİN
import { Theme } from './theme.js';

export const GameConfig = {
    type: Phaser.AUTO, // Artık Phaser'ın ne olduğunu biliyor
    parent: 'game-container',
    width: 360,
    height: 740,
    backgroundColor: Theme.background,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    }
};