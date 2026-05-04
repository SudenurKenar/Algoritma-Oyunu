import Phaser from 'phaser';
import { Theme } from '../core/theme.js';

export class LevelSelect extends Phaser.Scene {
    constructor() {
        super('LevelSelect');
    }

    create() {
        const { width, height } = this.scale;
        const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;

        // 1. Arka Plan Sabit Kalmalı
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1).setScrollFactor(0);

        // 2. Kaydırılabilir İçerik İçin Bir Container (Konteyner)
        this.mainContainer = this.add.container(0, 0);

        // Başlık
        const title = this.add.text(width / 2, 60, "ALGO-MAP", {
            fontSize: '36px', fontFamily: Theme.fontFamily, color: '#ffffff', fontStyle: 'bold',
            stroke: Theme.accent, strokeThickness: 6
        }).setOrigin(0.5);
        this.mainContainer.add(title);

        // --- KONU GRUPLARI VE BÖLÜMLER ---
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
                    { id: 5, name: "BAĞLANTI KURMA", scene: "LinkedListLinkPart" }
                ]
            }
        ];

        let currentY = 150;

        // LevelSelect.js içindeki döngü kısmını şu şekilde güncelleyin:

        curriculum.forEach((group) => {
            // Konu Başlığı (Örn: DİZİLER)
            const topicTxt = this.add.text(width / 2, currentY, group.topic, {
                fontSize: '20px', // Fontu biraz küçülterek sığmasını garantiledik
                fontFamily: Theme.fontFamily,
                color: '#00ffcc',
                fontStyle: 'bold',
                backgroundColor: '#00ffcc11',
                padding: { x: 10, y: 5 },
                align: 'center',
                wordWrap: { width: width * 0.9 } // Yazı çok uzunsa yanlardan taşmaz, alt satıra geçer
            }).setOrigin(0.5);
            this.mainContainer.add(topicTxt);
            currentY += 70;

            group.levels.forEach((level) => {
                const isLocked = level.id > unlockedLevel;
                const x = width / 2;

                const boxColor = isLocked ? 0x4a4a4a : 0x7b2cbf;
                const strokeColor = isLocked ? 0x777777 : 0xffffff;

                // Buton genişliğini ekranın %85'ine çıkararak metne daha fazla alan açtık
                const btn = this.add.rectangle(x, currentY, width * 0.85, 60, boxColor).setStrokeStyle(2, strokeColor);

                const txt = this.add.text(x, currentY, isLocked ? `🔒 KİLİTLİ` : level.name, {
                    fontSize: '18px',
                    fontFamily: Theme.fontFamily,
                    color: isLocked ? '#999' : '#fff',
                    fontStyle: 'bold',
                    align: 'center',
                    wordWrap: { width: width * 0.75 } // Buton içindeki yazı da artık taşmaz
                }).setOrigin(0.5);

                this.mainContainer.add([btn, txt]);

                if (!isLocked) {
                    btn.setInteractive({ useHandCursor: true })
                        .on('pointerdown', () => {
                            this.scene.start(level.scene);
                        })
                        .on('pointerover', () => {
                            btn.setStrokeStyle(4, 0xffff00);
                            txt.setColor('#ffff00');
                        })
                        .on('pointerout', () => {
                            btn.setStrokeStyle(2, strokeColor);
                            txt.setColor('#fff');
                        });
                }
                currentY += 80;
            });
            currentY += 50;
        });

        // 3. KAYDIRMA (SCROLL) MEKANİZMASI
        const maxScroll = Math.max(0, currentY - height + 100);

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.mainContainer.y -= deltaY;
            this.mainContainer.y = Phaser.Math.Clamp(this.mainContainer.y, -maxScroll, 0);
        });

        // Mobil Dokunmatik Kaydırma
        let startY = 0;
        this.input.on('pointerdown', (pointer) => { startY = pointer.y; });
        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                const diffY = pointer.y - startY;
                this.mainContainer.y += diffY;
                this.mainContainer.y = Phaser.Math.Clamp(this.mainContainer.y, -maxScroll, 0);
                startY = pointer.y;
            }
        });

        // Geri Dön Butonu (Sabit kalmalı)
        const backBtn = this.add.text(width / 2, height - 40, "🏠 ANA MENÜ", {
            fontSize: '18px', color: '#00ffcc', fontStyle: 'bold', backgroundColor: '#000000aa', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setScrollFactor(0);

        backBtn.on('pointerdown', () => this.scene.start('MainMenu'));
    }
}