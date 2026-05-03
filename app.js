// app.js
import Phaser from 'phaser';
import { GameConfig } from './src/core/config.js';
import { MainMenu } from './src/scenes/MainMenu.js';

// Diziler (Array) Seviyesi
import { ArrayPart } from './src/scenes/Part1/ArrayPart.js';
import { ArrayANI } from './src/scenes/Part2/ArrayANI.js';

// Bağlı Liste (Linked List) Seviyesi
import { LinkedListPart } from './src/scenes/Part1/LinkedListPart.js';
import { LinkedListANI } from './src/scenes/Part2/LinkedListANI.js';

const finalConfig = {
    ...GameConfig,
    scene: [MainMenu, ArrayPart, ArrayANI, LinkedListPart, LinkedListANI] // <-- Listeye ekledik
};

new Phaser.Game(finalConfig);