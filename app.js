// app.js
import Phaser from 'phaser';
import { GameConfig } from './src/core/config.js'; // Başında ./ olduğundan emin olalım
import { MainMenu } from './src/scenes/MainMenu.js';
import { Part1 } from './src/scenes/Part1.js';

// Eğer hala hata alırsanız, yukarıdaki yolları şu şekilde deneyin:
// import { Part1 } from '/src/scenes/Part1.js'; (Baştaki / kök dizini temsil eder)

const finalConfig = {
    ...GameConfig,
    scene: [MainMenu, Part1]
};

// Oyunu başlatan asil komut
new Phaser.Game(finalConfig);

console.log("Algo-Quest Başlatılıyor, Hanımım!");