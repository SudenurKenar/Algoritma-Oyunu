import Phaser from 'phaser';
import { Theme } from '../core/theme.js';

export class LevelSelect extends Phaser.Scene {
    constructor() {
        super('LevelSelect');
    }

    create() {
        const { width, height } = this.scale;
        const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;

        // Başlık daha zarif ve yukarıda
        this.add.text(width / 2, 60, "BÖLÜMLER", {
            fontSize: '32px',
            fontFamily: Theme.fontFamily,
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: Theme.accent,
            strokeThickness: 4
        }).setOrigin(0.5);


        const levels = [
            { id: 1, name: "VERİ EKLEME", scene: "ArrayPart" },       // İlk sahne ArrayPart olmalı
            { id: 2, name: "VERİ SİLME", scene: "ArrayDeletePart" },  // Yeni tasarladığımız bölüm
            { id: 3, name: "VERİ DÜZENLEME", scene: "ArrayUpdatePart" }
        ];

        levels.forEach((level, index) => {
            const isLocked = level.id > unlockedLevel;
            const x = width / 2;
            const y = 180 + (index * 90); // Aradaki boşlukları ve yüksekliği daralttık

            // Siyah içermeyen, canlı renk paleti
            const boxColor = isLocked ? 0x5a5a5a : 0x7b2cbf;
            const strokeColor = isLocked ? 0x999999 : 0x00ffcc;
            const textColor = isLocked ? '#bbbbbb' : '#ffffff';

            // Daha küçük ve kompakt kutu (300x60)
            const btn = this.add.rectangle(x, y, 300, 60, boxColor)
                .setStrokeStyle(3, strokeColor);

            // Doğrudan KONU ismi yazıyor
            const txt = this.add.text(x, y, isLocked ? `🔒 KİLİTLİ` : level.name, {
                fontSize: '20px',
                fontFamily: Theme.fontFamily,
                color: textColor,
                fontStyle: 'bold'
            }).setOrigin(0.5);

            if (!isLocked) {
                btn.setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => {
                        this.cameras.main.fadeOut(300, 0, 0, 0);
                        this.cameras.main.once('camerafadeoutcomplete', () => {
                            this.scene.start(level.scene);
                        });
                    })
                    .on('pointerover', () => {
                        btn.setFillStyle(0x9d4edd);
                        btn.setStrokeStyle(3, 0xffff00);
                        txt.setColor('#ffff00');
                    })
                    .on('pointerout', () => {
                        btn.setFillStyle(0x7b2cbf);
                        btn.setStrokeStyle(3, 0x00ffcc);
                        txt.setColor('#ffffff');
                    });
            }
        });

        // Geri Dön Butonu
        const backBtn = this.add.text(width / 2, height - 50, "🏠 ANA MENÜ", {
            fontSize: '18px',
            fontFamily: Theme.fontFamily,
            color: '#00ffcc',
            fontStyle: 'bold'
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('MainMenu'))
            .on('pointerover', () => backBtn.setStyle({ color: '#ffffff' }))
            .on('pointerout', () => backBtn.setStyle({ color: '#00ffcc' }));
    }
}