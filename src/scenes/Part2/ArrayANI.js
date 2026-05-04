import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class ArrayANI extends Phaser.Scene {
    constructor() {
        super('ArrayANI');
    }

    create() {
        const { width, height } = this.scale;

        // Arka plan ızgarası
        this.add.grid(width / 2, height / 2, width, height, 30, 30, 0x000000, 0, 0x7b2cbf, 0.1);

        this.add.text(width / 2, 50, "Dizi Simülasyonu", {
            fontSize: '28px',
            fontFamily: Theme.fontFamily,
            color: Theme.accent,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Başlangıç dizi verileri
        this.arrayData = [10, 20, 30];
        this.slots = [];

        this.createArrayVisual();

        // 2 saniye sonra yeni eleman ekleme animasyonunu başlat
        this.time.delayedCall(2000, () => this.animatePush(40));
    }

    createArrayVisual() {
        const startX = 60;
        const startY = 300;

        this.arrayData.forEach((val, i) => {
            const x = startX + (i * 80);

            // Kutular
            this.add.rectangle(x, startY, 70, 70, Theme.surface)
                .setStrokeStyle(2, Theme.primary);

            // Sayılar (Beyaz)
            this.add.text(x, startY, val, {
                fontSize: '24px',
                color: '#ffffff',
                fontFamily: Theme.fontFamily,
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // İndisler (Parlak Sarı)
            this.add.text(x, startY + 60, `[${i}]`, {
                fontSize: '18px',
                color: '#ffff00',
                fontFamily: Theme.fontFamily,
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
        });
    }

    async animatePush(newValue) {
        const { width } = this.scale;
        const nextIndex = this.arrayData.length;
        const targetX = 60 + (nextIndex * 80);
        const targetY = 300;

        // Yeni kutu ve metin
        const newBox = this.add.rectangle(width / 2, 600, 70, 70, Theme.primary).setStrokeStyle(2, 0xffffff);
        const newTxt = this.add.text(width / 2, 600, newValue, {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: Theme.fontFamily,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Yeni indis [3]
        const newIndexTxt = this.add.text(width / 2, 660, `[${nextIndex}]`, {
            fontSize: '18px',
            color: '#ffff00',
            fontFamily: Theme.fontFamily,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setAlpha(0);

        const info = this.add.text(width / 2, 500, `Diziye ${newValue} ekleniyor: .push(${newValue})`, {
            fontSize: '18px',
            color: '#00ffcc',
            fontFamily: Theme.fontFamily,
            backgroundColor: '#1a1a1a',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        await this.wait(1000);
        newIndexTxt.setAlpha(1);

        this.tweens.add({
            targets: [newBox, newTxt, newIndexTxt],
            x: targetX,
            y: (target) => target === newIndexTxt ? targetY + 60 : targetY,
            duration: 800,
            ease: 'Back.easeOut',
            // ArrayANI.js içindeki onComplete kısmını şu şekilde güncelleyin:
            onComplete: () => {
                this.cameras.main.flash(300, 60, 255, 204);

                this.time.delayedCall(1000, () => {
                    // nextScene: 'ArrayDeletePart' -> app.js'deki import edilen sahne ismiyle aynı olmalı
                    this.scene.launch('SuccessScene', {
                        nextScene: 'ArrayDeletePart',
                        currentScene: 'ArrayANI'
                    });
                });
            }
        });
    }

    wait(ms) {
        return new Promise(resolve => this.time.delayedCall(ms, resolve));
    }
}