import Phaser from 'phaser'; // <-- BU SATIR ÇOK KRİTİK! Vite için Phaser'ı tanıtmalısınız.
import { Theme } from '../core/theme.js';
import { Levels } from '../data/levels.js';

export class Part1 extends Phaser.Scene {
    constructor() {
        super('Part1');
        this.currentLevelIndex = 0;
    }

    create() {
        const level = Levels[this.currentLevelIndex];
        const { width, height } = this.scale;

        // 1. Başlık
        this.add.text(width / 2, 50, level.title, {
            fontSize: '28px', color: '#e0aaff', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // 2. Editör Kutusu
        this.add.rectangle(width / 2, 220, 320, 180, 0x2d004d).setStrokeStyle(2, 0x7b2cbf);

        // 3. Kod
        const displayCode = level.code.replace('____', '      ');
        this.add.text(width / 2, 240, displayCode, {
            fontSize: '20px', fontFamily: 'Courier New', color: '#ffffff'
        }).setOrigin(0.5);

        // 4. Drop Zone
        this.dropZone = this.add.zone(width / 2 + 50, 240, 60, 40).setRectangleDropZone(60, 40);

        // 5. Seçenekleri Oluştur
        this.createOptions(level.options, level.missing);
    }

    createOptions(options, correctOne) {
        const { width } = this.scale;
        options.forEach((opt, index) => {
            const x = 70 + (index * 75);
            const y = 600;

            const container = this.add.container(x, y);
            const bg = this.add.rectangle(0, 0, 60, 50, 0x7b2cbf).setInteractive({ useHandCursor: true });
            const txt = this.add.text(0, 0, opt, { fontSize: '20px', color: '#fff' }).setOrigin(0.5);

            container.add([bg, txt]);
            container.setData('value', opt);
            this.input.setDraggable(container);

            container.on('drag', (pointer, dragX, dragY) => {
                container.x = dragX;
                container.y = dragY;
                container.depth = 10;
            });

            container.on('dragend', (pointer, dropped) => {
                if (!dropped) {
                    container.x = x;
                    container.y = y;
                }
            });
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            if (gameObject.getData('value') === correctOne) {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                this.handleLevelComplete();
            } else {
                this.cameras.main.shake(200, 0.01);
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });
    }

    handleLevelComplete() {
        this.add.text(180, 400, 'MÜKEMMEL!', { fontSize: '32px', color: '#3cff00' }).setOrigin(0.5);
        this.time.delayedCall(1500, () => {
            // Part 2'yi henüz yazmadığımız için şimdilik konsola yazalım
            console.log("Sıradaki durak: Algoritma Görselleştirme!");
        });
    }
}