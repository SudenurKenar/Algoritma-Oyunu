import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class ArrayDeleteANI extends Phaser.Scene {
    constructor() {
        super('ArrayDeleteANI');
    }

    create() {
        const { width, height } = this.scale;

        // Arka plan (Koyu mor tonları, siyahsız)
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1);

        // Başlık - Boyutu biraz küçülttük ve dinamik konuma aldık
        this.add.text(width / 2, height * 0.1, "SİLME ANİMASYONU", {
            fontSize: '28px',
            fontFamily: Theme.fontFamily,
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: Theme.accent,
            strokeThickness: 4
        }).setOrigin(0.5);

        // Başlangıç Dizisi
        this.arrayData = [10, 20, "ERR", 30];
        this.elements = [];

        this.createArrayVisual();

        // 1.5 saniye sonra "ERR" silme işlemini başlat
        this.time.delayedCall(1500, () => this.processDeletion(2));
    }

    createArrayVisual() {
        const { width, height } = this.scale;

        // Kutular arası boşluğu ekran genişliğine göre daralttık (90 -> 80)
        const spacing = 80;
        const totalWidth = (this.arrayData.length - 1) * spacing;
        const startX = (width - totalWidth) / 2;

        this.arrayData.forEach((val, i) => {
            const x = startX + (i * spacing);
            const y = height / 2;

            // Kutu boyutunu 70x70 yaparak yer kazandık
            const box = this.add.rectangle(x, y, 70, 70, Theme.surface).setStrokeStyle(3, Theme.primary);

            // Değer metni - Sığmama riskine karşı boyutu 20px yaptık
            const txt = this.add.text(x, y, val, {
                fontSize: '20px',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // İndis metni - Daha yakın (60 -> 50)
            const idx = this.add.text(x, y + 50, `[${i}]`, {
                fontSize: '16px',
                color: '#ffff00',
                fontStyle: 'bold',
                stroke: '#000',
                strokeThickness: 2
            }).setOrigin(0.5);

            this.elements.push({ box, txt, idx });
        });
    }

    async processDeletion(indexToDelete) {
        const { width, height } = this.scale;
        const target = this.elements[indexToDelete];

        // Bilgi metni konumu dinamik ve fontu sığacak şekilde 18px
        const info = this.add.text(width / 2, height * 0.75, `dizi.splice(${indexToDelete}, 1) uygulanıyor...`, {
            fontSize: '18px',
            color: '#ff0054',
            backgroundColor: '#ffffff11',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        await this.wait(1000);

        this.tweens.add({
            targets: [target.box, target.txt, target.idx],
            y: '-=30',
            alpha: 0,
            scale: 0.3,
            duration: 500,
            ease: 'Back.easeIn',
            onComplete: () => {
                target.box.destroy();
                target.txt.destroy();
                target.idx.destroy();

                this.elements.splice(indexToDelete, 1);
                this.reorganizeArray(indexToDelete, info);
            }
        });
    }

    reorganizeArray(startIndex, infoText) {
        const { width } = this.scale;
        const spacing = 80;
        const totalWidth = (this.elements.length - 1) * spacing;
        const newStartX = (width - totalWidth) / 2;

        this.elements.forEach((el, i) => {
            const newX = newStartX + (i * spacing);

            this.tweens.add({
                targets: [el.box, el.txt, el.idx],
                x: newX,
                duration: 600,
                ease: 'Power2.easeInOut',
                onUpdate: () => {
                    el.idx.setText(`[${i}]`);
                },
                onComplete: () => {
                    if (i === this.elements.length - 1) {
                        infoText.setText("Dizi Yeniden Hizalandı!");
                        this.finishChapter();
                    }
                }
            });
        });
    }

    finishChapter() {
        this.time.delayedCall(1500, () => {
            this.scene.launch('SuccessScene', {
                nextScene: 'ArrayUpdatePart',
                currentScene: 'ArrayDeleteANI'
            });
        });
    }

    wait(ms) { return new Promise(resolve => this.time.delayedCall(ms, resolve)); }
}