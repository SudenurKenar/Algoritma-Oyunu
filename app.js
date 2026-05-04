// app.js
import Phaser from 'phaser';
import { GameConfig } from './src/core/config.js';
import { MainMenu } from './src/scenes/MainMenu.js';
import { SuccessScene } from './src/scenes/SuccessScene.js';
import { LevelSelect } from './src/scenes/LevelSelect.js';
import { GalleryScene } from './src/scenes/GalleryScene.js';

// Diziler (Array) Seviyesi
import { ArrayPart } from './src/scenes/Part1/ArrayPart.js';
import { ArrayANI } from './src/scenes/Part2/ArrayANI.js';
import { ArrayDeletePart } from './src/scenes/Part1/ArrayDeletePart.js';
import { ArrayDeleteANI } from './src/scenes/Part2/ArrayDeleteANI.js';
import { ArrayUpdatePart } from './src/scenes/Part1/ArrayUpdatePart.js';
import { ArrayUpdateANI } from './src/scenes/Part2/ArrayUpdateANI.js';
// Bağlı Liste (Linked List) Seviyesi
import { LinkedListNodePart } from './src/scenes/Part1/LinkedListNodePart.js';
import { LinkedListNodeANI } from './src/scenes/Part2/LinkedListNodeANI.js';
import { LinkedListLinkPart } from './src/scenes/Part1/LinkedListLinkPart.js';
import { LinkedListLinkANI } from './src/scenes/Part2/LinkedListLinkANI.js';
import { LinkedListInsertPart } from './src/scenes/Part1/LinkedListInsertPart.js';
import { LinkedListInsertANI } from './src/scenes/Part2/LinkedListInsertANI.js';
import { LinkedListDeletePart } from './src/scenes/Part1/LinkedListDeletePart.js';
import { LinkedListDeleteANI } from './src/scenes/Part2/LinkedListDeleteANI.js';

const finalConfig = {
    ...GameConfig,
    scene: [MainMenu, LevelSelect, GalleryScene, ArrayPart, ArrayANI, ArrayDeletePart, ArrayDeleteANI, ArrayUpdatePart, ArrayUpdateANI, LinkedListNodePart, LinkedListNodeANI, LinkedListLinkPart, LinkedListLinkANI, LinkedListInsertPart, LinkedListInsertANI, LinkedListDeletePart, LinkedListDeleteANI, SuccessScene] // <-- Listeye ekledik
};

new Phaser.Game(finalConfig);