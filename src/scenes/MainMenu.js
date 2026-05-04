import Phaser from 'phaser';
import { Theme } from '../core/theme.js';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height * 0.15, 'ALGO-QUEST', {
            fontSize: '42px',
            fontFamily: Theme.fontFamily,
            color: '#e0aaff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 1. OYNA Butonu
        this.createMenuButton(width / 2, height * 0.45, 'OYNA', () => {
            this.scene.start('LevelSelect');
        });

        // 2. ANİMASYONLAR Butonu (İsim güncellendi!)
        // Veriyi kontrol ediyoruz
        let unlockedVisuals = [];
        try {
            unlockedVisuals = JSON.parse(localStorage.getItem('unlockedVisuals') || "[]");
        } catch (e) {
            unlockedVisuals = [];
        }

        const isVisualsEnabled = unlockedVisuals.length > 0;

        // "GÖSTERİMLER" yerine "ANİMASYONLAR" yazıyoruz
        this.createMenuButton(width / 2, height * 0.58, 'ANİMASYONLAR', () => {
            if (isVisualsEnabled) {
                this.scene.start('GalleryScene');
            } else {
                this.showLockedMessage();
            }
        }, isVisualsEnabled);

        this.add.text(width / 2, height * 0.9, 'Veri Yapıları & Algoritmalar', {
            fontSize: '14px',
            color: '#7b2cbf',
            fontFamily: Theme.fontFamily
        }).setOrigin(0.5);
    }

    createMenuButton(x, y, label, callback, enabled = true) {
        // Buton rengi: Kilitliyse koyu gri, açıksa ana renk
        // MainMenu.js create() içine ekle:
        const btnBg = this.add.rectangle(0, 0, 260, 60, enabled ? Theme.primary : 0x333333)
            .setInteractive({ useHandCursor: enabled })
            .setStrokeStyle(2, enabled ? Theme.accent : 0x666666);

        const btnText = this.add.text(0, 0, label, {
            fontSize: '22px',
            fontFamily: Theme.fontFamily,
            color: enabled ? '#ffffff' : '#777777',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const container = this.add.container(x, y, [btnBg, btnText]);

        if (enabled) {
            btnBg.on('pointerdown', () => {
                this.add.tween({
                    targets: container,
                    scale: 0.95,
                    duration: 100,
                    yoyo: true,
                    onComplete: callback
                });
            });

            btnBg.on('pointerover', () => btnBg.setFillStyle(Theme.accent));
            btnBg.on('pointerout', () => btnBg.setFillStyle(Theme.primary));
        }
    }

    showLockedMessage() {
        const msg = this.add.text(this.scale.width / 2, this.scale.height * 0.65, 'Bölümleri geçtikçe animasyonlar açılır!', {
            fontSize: '16px', color: '#ff0054', fontFamily: Theme.fontFamily, fontStyle: 'bold'
        }).setOrigin(0.5);

        this.time.delayedCall(2000, () => msg.destroy());
        this.cameras.main.shake(200, 0.005);
    }
}