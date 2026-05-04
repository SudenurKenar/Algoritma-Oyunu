import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class ArrayUpdateANI extends Phaser.Scene {
    constructor() {
        super('ArrayUpdateANI');
    }

    create() {
        const { width, height } = this.scale;

        // Arka plan (Siyahsız, derin mor ızgara)
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1);

        this.add.text(width / 2, height * 0.1, "DÜZENLEME ANİMASYONU", {
            fontSize: '28px', fontFamily: Theme.fontFamily, color: '#ffffff', fontStyle: 'bold',
            stroke: Theme.accent, strokeThickness: 4
        }).setOrigin(0.5);

        // Başlangıç Dizisi: [10, 30, "?", 70]
        this.arrayData = [10, 30, "?", 70];
        this.elements = [];

        this.createArrayVisual();

        // 1.5 saniye sonra "50" değerini 2. indise yerleştirme animasyonunu başlat
        this.time.delayedCall(1500, () => this.animateUpdate(2, "50"));
    }

    createArrayVisual() {
        const { width, height } = this.scale;
        const spacing = 85;
        const startX = (width - (this.arrayData.length - 1) * spacing) / 2;

        this.arrayData.forEach((val, i) => {
            const x = startX + (i * spacing);
            const y = height / 2;

            const box = this.add.rectangle(x, y, 70, 70, Theme.surface).setStrokeStyle(3, Theme.primary);
            const txt = this.add.text(x, y, val, { fontSize: '22px', color: val === "?" ? '#ffff00' : '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
            const idx = this.add.text(x, y + 50, `[${i}]`, { fontSize: '16px', color: '#888' }).setOrigin(0.5);

            this.elements.push({ box, txt, idx });
        });
    }

    async animateUpdate(index, newValue) {
        const { width, height } = this.scale;
        const target = this.elements[index];

        const info = this.add.text(width / 2, height * 0.75, `dizi[${index}] = ${newValue} işlemi yapılıyor...`, {
            fontSize: '18px', color: '#00ffcc', backgroundColor: '#ffffff11', padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        // 1. Yeni değer yukardan süzülerek gelir
        const patchTxt = this.add.text(target.box.x, target.box.y - 100, newValue, {
            fontSize: '28px', color: '#00ffcc', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        await this.wait(1000);

        // 2. Eski değer ("?") aşağı doğru düşerken yeni değer yerine oturur
        this.tweens.add({
            targets: target.txt,
            y: '+=50',
            alpha: 0,
            duration: 500
        });

        this.tweens.add({
            targets: patchTxt,
            y: target.box.y,
            alpha: 1,
            duration: 600,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                target.box.setStrokeStyle(4, 0x00ffcc);
                this.cameras.main.flash(300, 0, 255, 204);
                info.setText("Değer Başarıyla Güncellendi!");

                this.finishModule();
            }
        });
    }

    finishModule() {
        this.time.delayedCall(2000, () => {
            // Tüm Dizi modülünü bitirdik, LevelSelect'e döndürebiliriz
            this.scene.launch('SuccessScene', {
                nextScene: 'LevelSelect',
                currentScene: 'ArrayUpdateANI'
            });
        });
    }

    wait(ms) { return new Promise(resolve => this.time.delayedCall(ms, resolve)); }
}