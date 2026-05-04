import Phaser from 'phaser';
import { Theme } from '../core/theme.js';

export class SuccessScene extends Phaser.Scene {
    constructor() {
        super('SuccessScene');
    }

    create(data) {
        const { nextScene, currentScene } = data;
        const { width, height } = this.scale;

        // 1. Arka Plan Karartma (Siyah rengi %70 şeffaflıkla kullandık, tamamen görünmez değil)
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

        // 2. Tebrik Paneli
        const panel = this.add.rectangle(width / 2, height / 2, 400, 250, Theme.surface)
            .setStrokeStyle(3, Theme.accent);

        this.add.text(width / 2, height / 2 - 60, "TEBRİKLER!", {
            fontSize: '36px', fontFamily: Theme.fontFamily, color: '#ffff00', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 10, "Bölüm Başarıyla Tamamlandı", {
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

            // Eğer bitirilen seviye mevcut kilide eşit veya büyükse kilidi aç
            if (currentLevelId >= unlockedLevel) {
                localStorage.setItem('unlockedLevel', currentLevelId + 1);
            }

            this.scene.stop(currentScene);
            this.scene.stop('SuccessScene');

            if (nextScene && nextScene !== 'LevelSelect') {
                this.scene.start(nextScene);
            } else {
                this.scene.start('LevelSelect');
            }
        }, true);
    }

    // GÜNCELLENMİŞ SEVİYE MANTIĞI
    getCurrentLevelId(sceneName) {
        // Her sahne ismine göre özel bir ID döndürüyoruz
        if (sceneName.includes('ArrayPart')) return 1;       // Veri Ekleme
        if (sceneName.includes('ArrayDeleteANI')) return 2;  // Veri Silme
        if (sceneName.includes('ArrayUpdateANI')) return 3;  // Veri Düzenleme
        if (sceneName.includes('LinkedList')) return 4;     // Bağlı Liste Başlangıç
        return 1;
    }

    createButton(x, y, label, callback, isPrimary = false) {
        const btn = this.add.text(x, y, label, {
            fontSize: '16px',
            fontFamily: Theme.fontFamily,
            color: '#ffffff',
            backgroundColor: isPrimary ? Theme.primary : '#444444', // Siyah yerine koyu gri
            padding: { x: 15, y: 8 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', callback)
            .on('pointerover', () => btn.setStyle({ backgroundColor: Theme.accent }))
            .on('pointerout', () => btn.setStyle({ backgroundColor: isPrimary ? Theme.primary : '#444444' }));

        return btn;
    }
}