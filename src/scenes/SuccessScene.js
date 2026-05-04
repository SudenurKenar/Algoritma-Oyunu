import Phaser from 'phaser';
import { Theme } from '../core/theme.js';

export class SuccessScene extends Phaser.Scene {
    constructor() {
        super('SuccessScene');
    }

    create(data) {
        const { nextScene, currentScene } = data;
        const { width, height } = this.scale;

        // 1. Arka Plan Karartma
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

        // 2. Tebrik Paneli
        const panel = this.add.rectangle(width / 2, height / 2, 400, 250, Theme.surface)
            .setStrokeStyle(3, Theme.accent);

        this.add.text(width / 2, height / 2 - 60, "TEBRİKLER!", {
            fontSize: '36px', fontFamily: Theme.fontFamily, color: '#ffff00', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 10, "Bölüm Tamamlandı", {
            fontSize: '18px', fontFamily: Theme.fontFamily, color: '#ffffff'
        }).setOrigin(0.5);

        // 3. Butonlar
        this.createButton(width / 2 - 100, height / 2 + 60, "Ana Menü", () => {
            this.scene.stop(currentScene);
            this.scene.stop('SuccessScene');
            this.scene.start('MainMenu');
        });

        this.createButton(width / 2 + 100, height / 2 + 60, "➡ SONRAKİ", () => {
            const currentLevelId = this.getCurrentLevelId(currentScene);
            const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;

            if (currentLevelId >= unlockedLevel) {
                localStorage.setItem('unlockedLevel', currentLevelId + 1);
            }

            this.scene.stop(currentScene);
            this.scene.stop('SuccessScene');
            if (nextScene) this.scene.start(nextScene);
        }, true);
    }

    // YARDIMCI FONKSİYONLAR - Sınıfın (class) içinde ama create'in dışında olmalı
    getCurrentLevelId(sceneName) {
        if (sceneName.includes('Array')) return 1;
        if (sceneName.includes('LinkedList')) return 2;
        return 1;
    }

    createButton(x, y, label, callback, isPrimary = false) {
        const btn = this.add.text(x, y, label, {
            fontSize: '16px',
            fontFamily: Theme.fontFamily,
            color: '#ffffff',
            backgroundColor: isPrimary ? Theme.primary : '#333',
            padding: { x: 15, y: 8 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', callback)
            .on('pointerover', () => btn.setStyle({ backgroundColor: Theme.accent }))
            .on('pointerout', () => btn.setStyle({ backgroundColor: isPrimary ? Theme.primary : '#333' }));

        return btn;
    }
}