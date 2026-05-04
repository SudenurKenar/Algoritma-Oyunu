import Phaser from 'phaser';
import { Theme } from '../core/theme.js';

export class LevelSelect extends Phaser.Scene {
    constructor() {
        super('LevelSelect');
    }

    create() {
        const { width, height } = this.scale;
        const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;

        // 1. Arka Plan (Sabit)
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1).setScrollFactor(0);

        this.mainContainer = this.add.container(0, 0);

        // Başlık
        const title = this.add.text(width / 2, 60, "ALGO-MAP", {
            fontSize: '36px', fontFamily: Theme.fontFamily, color: '#ffffff', fontStyle: 'bold',
            stroke: Theme.accent, strokeThickness: 6
        }).setOrigin(0.5);
        this.mainContainer.add(title);

        const curriculum = [
            {
                topic: "BÖLÜM I: DİZİLER (ARRAYS)",
                levels: [
                    { id: 1, name: "VERİ EKLEME", scene: "ArrayPart" },
                    { id: 2, name: "VERİ SİLME", scene: "ArrayDeletePart" },
                    { id: 3, name: "VERİ DÜZENLEME", scene: "ArrayUpdatePart" }
                ]
            },
            {
                topic: "BÖLÜM II: BAĞLI LİSTELER (LINKED LIST)",
                levels: [
                    { id: 4, name: "NODE OLUŞTURMA", scene: "LinkedListNodePart" },
                    { id: 5, name: "BAĞLANTI KURMA", scene: "LinkedListLinkPart" },
                    { id: 6, name: "ARAYA EKLEME", scene: "LinkedListInsertPart" },
                    { id: 7, name: "SİLME", scene: "LinkedListDeletePart" },
                ]
            }
        ];

        let currentY = 150;

        curriculum.forEach((group) => {
            const topicTxt = this.add.text(width / 2, currentY, group.topic, {
                fontSize: '20px', fontFamily: Theme.fontFamily, color: '#00ffcc', fontStyle: 'bold',
                backgroundColor: '#00ffcc11', padding: { x: 10, y: 5 }, align: 'center', wordWrap: { width: width * 0.9 }
            }).setOrigin(0.5);
            this.mainContainer.add(topicTxt);
            currentY += 70;

            group.levels.forEach((level) => {
                const isLocked = level.id > unlockedLevel;
                const x = width / 2;
                const boxColor = isLocked ? 0x4a4a4a : 0x7b2cbf;
                const strokeColor = isLocked ? 0x777777 : 0xffffff;

                const btn = this.add.rectangle(x, currentY, width * 0.85, 60, boxColor).setStrokeStyle(2, strokeColor);

                // Kilit İkonu (FontAwesome)
                const lockIcon = isLocked ? "\uf023 " : "";
                const txt = this.add.text(x, currentY, lockIcon + (isLocked ? `KİLİTLİ` : level.name), {
                    fontSize: '18px',
                    fontFamily: isLocked ? '"Font Awesome 6 Free", ' + Theme.fontFamily : Theme.fontFamily,
                    fontWeight: '900',
                    color: isLocked ? '#999' : '#fff',
                    fontStyle: 'bold'
                }).setOrigin(0.5);

                this.mainContainer.add([btn, txt]);

                if (!isLocked) {
                    btn.setInteractive({ useHandCursor: true })
                        .on('pointerdown', () => this.scene.start(level.scene))
                        .on('pointerover', () => { btn.setStrokeStyle(4, 0xffff00); txt.setColor('#ffff00'); })
                        .on('pointerout', () => { btn.setStrokeStyle(2, strokeColor); txt.setColor('#fff'); });
                }
                currentY += 80;
            });
            currentY += 50;
        });

        const maxScroll = Math.max(0, currentY - height + 100);

        // Kaydırma Mekanizması
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

        // --- SABİT ALT BUTON (Emoji yerine FontAwesome) ---
        const footerBg = this.add.rectangle(width / 2, height - 40, 160, 45, 0x000000, 0.7)
            .setStrokeStyle(2, 0x00ffcc).setScrollFactor(0).setInteractive({ useHandCursor: true });

        const backIcon = this.add.text(width / 2 - 55, height - 40, "\uf015", {
            fontFamily: '"Font Awesome 6 Free"', fontWeight: '900', fontSize: '18px', color: '#00ffcc'
        }).setOrigin(0.5).setScrollFactor(0);

        const backTxt = this.add.text(width / 2 + 15, height - 40, "ANA MENÜ", {
            fontSize: '16px', fontFamily: Theme.fontFamily, color: '#00ffcc', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0);

        footerBg.on('pointerdown', () => this.scene.start('MainMenu'));
        footerBg.on('pointerover', () => { footerBg.setStrokeStyle(3, 0xffff00); backIcon.setColor('#ffff00'); backTxt.setColor('#ffff00'); });
        footerBg.on('pointerout', () => { footerBg.setStrokeStyle(2, 0x00ffcc); backIcon.setColor('#00ffcc'); backTxt.setColor('#00ffcc'); });
    }
}