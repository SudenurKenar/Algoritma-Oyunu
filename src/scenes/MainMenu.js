import Phaser from 'phaser';
import { Theme } from '../core/theme.js';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        const { width, height } = this.scale;

        // 1. Oyun Başlığı
        this.add.text(width / 2, height * 0.15, 'ALGO-QUEST', {
            fontSize: '42px',
            fontFamily: Theme.fontFamily,
            color: '#e0aaff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 2. OYNA Butonu
        // src/scenes/MainMenu.js içindeki buton fonksiyonu
        this.createMenuButton(width / 2, height * 0.45, 'OYNA', () => {
            this.scene.start('ArrayPart'); // Part1 yerine ArrayPart yazdığınızdan emin olun
        });

        // 3. GÖSTERİMLER Butonu (Kilit Mekanizması)
        // LocalStorage kontrolü: Eğer hiç bölüm geçilmediyse kilitli görünür
        const unlockedVisuals = JSON.parse(localStorage.getItem('unlockedVisuals') || "[]");
        const isVisualsEnabled = unlockedVisuals.length > 0;

        this.createMenuButton(width / 2, height * 0.58, 'GÖSTERİMLER', () => {
            if (isVisualsEnabled) {
                this.scene.start('Part2');
            } else {
                this.showLockedMessage();
            }
        }, isVisualsEnabled);

        // 4. Alt Bilgi Metni
        this.add.text(width / 2, height * 0.9, 'Veri Yapıları & Algoritmalar', {
            fontSize: '14px',
            color: '#7b2cbf',
            fontFamily: Theme.fontFamily
        }).setOrigin(0.5);
    }

    /**
     * @param {number} x - Yatay merkez
     * @param {number} y - Dikey merkez
     * @param {string} label - Buton üzerindeki yazı
     * @param {function} callback - Tıklanınca çalışacak fonksiyon
     * @param {boolean} enabled - Buton aktif mi?
     */
    createMenuButton(x, y, label, callback, enabled = true) {
        // Buton Arka Planı
        const btnBg = this.add.rectangle(0, 0, 240, 60, enabled ? Theme.primary : 0x444444)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, Theme.accent);

        // Buton Yazısı
        const btnText = this.add.text(0, 0, label, {
            fontSize: '24px',
            fontFamily: Theme.fontFamily,
            color: enabled ? '#ffffff' : '#888888',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const container = this.add.container(x, y, [btnBg, btnText]);

        if (enabled) {
            // Tıklama Olayı
            btnBg.on('pointerdown', () => {
                this.add.tween({
                    targets: container,
                    scale: 0.95,
                    duration: 100,
                    yoyo: true,
                    onComplete: callback
                });
            });

            // Hover (Üzerine Gelme) Efektleri
            btnBg.on('pointerover', () => btnBg.setFillStyle(Theme.accent));
            btnBg.on('pointerout', () => btnBg.setFillStyle(Theme.primary));
        }
    }

    showLockedMessage() {
        const msg = this.add.text(this.scale.width / 2, this.scale.height * 0.65, 'Bölüm geçtikçe açılır!', {
            fontSize: '16px',
            color: '#ff0054',
            fontFamily: Theme.fontFamily
        }).setOrigin(0.5);

        this.time.delayedCall(2000, () => msg.destroy());
        this.cameras.main.shake(200, 0.005);
    }
}