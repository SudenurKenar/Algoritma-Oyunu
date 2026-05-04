import Phaser from 'phaser';
import { Theme } from '../core/theme.js';

export class GalleryScene extends Phaser.Scene {
    constructor() {
        super('GalleryScene');
    }

    create() {
        const { width, height } = this.scale;

        // localStorage'dan açılmış animasyonları çek
        const unlockedVisuals = JSON.parse(localStorage.getItem('unlockedVisuals') || "[]");

        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1).setScrollFactor(0);

        this.mainContainer = this.add.container(0, 0);

        const title = this.add.text(width / 2, 60, "ANİMASYON ARŞİVİ", {
            fontSize: '32px', fontFamily: Theme.fontFamily, color: '#ffff00', fontStyle: 'bold',
            stroke: Theme.accent, strokeThickness: 4
        }).setOrigin(0.5);
        this.mainContainer.add(title);

        // Gösterilecek Animasyon Listesi
        const animations = [
            { id: 1, name: "DİZİ: VERİ EKLEME", scene: "ArrayANI" },
            { id: 2, name: "DİZİ: VERİ SİLME", scene: "ArrayDeleteANI" },
            { id: 3, name: "DİZİ: GÜNCELLEME", scene: "ArrayUpdateANI" },
            { id: 4, name: "B. LİSTE: NODE YAPISI", scene: "LinkedListNodeANI" },
            { id: 5, name: "B. LİSTE: BAĞLANTI", scene: "LinkedListLinkANI" },
            { id: 6, name: "B. LİSTE: ARAYA EKLEME", scene: "LinkedListInsertANI" },
            { id: 7, name: "B. LİSTE: VERİ SİLME", scene: "LinkedListDeleteANI" }
        ];

        let currentY = 150;

        animations.forEach((anim) => {
            // Eğer sahne ismi unlockedVisuals listesinde varsa açılır
            const isLocked = !unlockedVisuals.includes(anim.scene);

            const btn = this.add.rectangle(width / 2, currentY, width * 0.85, 60, isLocked ? 0x444444 : 0x7b2cbf)
                .setStrokeStyle(2, isLocked ? 0x666666 : 0xffffff);

            const txt = this.add.text(width / 2, currentY, isLocked ? `🔒 KİLİTLİ` : anim.name, {
                fontSize: '18px', fontFamily: Theme.fontFamily, color: isLocked ? '#999' : '#fff', fontStyle: 'bold'
            }).setOrigin(0.5);

            this.mainContainer.add([btn, txt]);

            if (!isLocked) {
                btn.setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => this.scene.start(anim.scene));
            }
            currentY += 80;
        });

        // Kaydırma Mekanizması
        const maxScroll = Math.max(0, currentY - height + 100);
        this.setupScrolling(maxScroll);

        // Geri Dön Butonu (Sabit)
        const backBtn = this.add.text(width / 2, height - 40, "🏠 ANA MENÜ", {
            fontSize: '18px', color: '#00ffcc', fontStyle: 'bold', backgroundColor: '#000000aa', padding: 8
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setScrollFactor(0);
        backBtn.on('pointerdown', () => this.scene.start('MainMenu'));
    }

    setupScrolling(maxScroll) {
        this.input.on('wheel', (pointer, gameObjects, dx, dy) => {
            this.mainContainer.y = Phaser.Math.Clamp(this.mainContainer.y - dy, -maxScroll, 0);
        });

        let startY = 0;
        this.input.on('pointerdown', (p) => { startY = p.y; });
        this.input.on('pointermove', (p) => {
            if (p.isDown) {
                this.mainContainer.y = Phaser.Math.Clamp(this.mainContainer.y + (p.y - startY), -maxScroll, 0);
                startY = p.y;
            }
        });
    }
}