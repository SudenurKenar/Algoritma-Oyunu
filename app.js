// app.js
import Phaser from 'phaser';
import { GameConfig } from './src/core/config.js';
import { MainMenu } from './src/scenes/MainMenu.js';
import { SuccessScene } from './src/scenes/SuccessScene.js';
import { LevelSelect } from './src/scenes/LevelSelect.js';

// Diziler (Array) Seviyesi
import { ArrayPart } from './src/scenes/Part1/ArrayPart.js';
import { ArrayANI } from './src/scenes/Part2/ArrayANI.js';
import { ArrayDeletePart } from './src/scenes/Part1/ArrayDeletePart.js';
import { ArrayDeleteANI } from './src/scenes/Part2/ArrayDeleteANI.js';
// Bağlı Liste (Linked List) Seviyesi
import { LinkedListPart } from './src/scenes/Part1/LinkedListPart.js';
import { LinkedListANI } from './src/scenes/Part2/LinkedListANI.js';

const finalConfig = {
    ...GameConfig,
    scene: [MainMenu, LevelSelect, ArrayPart, ArrayANI, ArrayDeletePart, ArrayDeleteANI, LinkedListPart, LinkedListANI, SuccessScene] // <-- Listeye ekledik
};

new Phaser.Game(finalConfig);