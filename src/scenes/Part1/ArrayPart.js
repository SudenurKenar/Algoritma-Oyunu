import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';
import { Levels } from '../../data/levels.js';

export class ArrayPart extends Phaser.Scene {
    constructor() {
        super('ArrayPart');
        this.currentLevelIndex = 0;
    }

    create() {
        const level = Levels[this.currentLevelIndex];
        const { width, height } = this.scale;

        this.add.grid(width / 2, height / 2, width, height, 30, 30, 0x000000, 0, 0x7b2cbf, 0.1);

        this.add.text(width / 2, 50, level.title, {
            fontSize: '28px', color: '#e0aaff', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Editör Panelini biraz daha yüksek yapalım (İki satır için)
        const editorBg = this.add.rectangle(width / 2, 230, 360, 220, 0x0d0221).setStrokeStyle(2, 0x9d4edd);

        // --- SYNTAX HIGHLIGHTING (Satır Satır Düzen) ---
        const startX = width / 2 - 130;
        const line1Y = 180;
        const line2Y = 250; // İkinci satır koordinatı

        // SATIR 1: let sayilar = [
        const p1 = this.add.text(startX, line1Y, "let ", { fontSize: '22px', fontFamily: 'Courier New', color: '#c792ea' });
        const p2 = this.add.text(p1.x + p1.width, line1Y, "sayilar", { fontSize: '22px', fontFamily: 'Courier New', color: '#f07178' });
        const p3 = this.add.text(p2.x + p2.width, line1Y, " = [", { fontSize: '22px', fontFamily: 'Courier New', color: '#ffffff' });

        // SATIR 2: (Boşluk) 10, 20, 30
        // Drop Zone'u ikinci satırın başına alıyoruz
        const zoneX = startX + 45;
        this.dropZone = this.add.zone(zoneX, line2Y + 12, 80, 55).setRectangleDropZone(80, 55);

        // Boşluktan sonra gelen değerler
        const p4 = this.add.text(zoneX + 45, line2Y, "10, 20, 30", { fontSize: '22px', fontFamily: 'Courier New', color: '#f78c6c' });

        this.zoneGraphics = this.add.graphics();
        this.drawZoneFrame(0x7b2cbf);

        this.createOptions(level.options, level.missing);
    }

    drawZoneFrame(color) {
        this.zoneGraphics.clear();
        this.zoneGraphics.lineStyle(2, color, 1);
        this.zoneGraphics.strokeRect(this.dropZone.x - 40, this.dropZone.y - 27, 80, 55);
        this.zoneGraphics.fillStyle(color, 0.1);
        this.zoneGraphics.fillRect(this.dropZone.x - 40, this.dropZone.y - 27, 80, 55);
    }

    createOptions(options, correctOne) {
        const { width } = this.scale;

        options.forEach((opt, index) => {
            const startX = (width / (options.length + 1)) * (index + 1);
            const startY = 600;

            const container = this.add.container(startX, startY);
            const bg = this.add.rectangle(0, 0, 75, 60, 0x240046).setStrokeStyle(2, 0xff00ff);
            const txt = this.add.text(0, 0, opt, {
                fontSize: '26px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Courier New'
            }).setOrigin(0.5);

            container.add([bg, txt]);
            container.setData({ 'startX': startX, 'startY': startY, 'value': opt });

            container.setInteractive(new Phaser.Geom.Rectangle(-37, -30, 75, 60), Phaser.Geom.Rectangle.Contains);
            this.input.setDraggable(container);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            gameObject.depth = 1000;
        });

        this.input.on('dragend', (pointer, gameObject, dropped) => {
            if (!dropped) {
                this.moveToStart(gameObject);
                return;
            }

            if (gameObject.getData('value') === correctOne) {
                gameObject.x = this.dropZone.x;
                gameObject.y = this.dropZone.y - 12; // Hizalama düzeltmesi
                gameObject.input.enabled = false;
                this.drawZoneFrame(0x00ffcc);
                this.handleLevelComplete();
            } else {
                this.cameras.main.shake(200, 0.01);
                this.drawZoneFrame(0xff0054);
                this.moveToStart(gameObject);
                this.time.delayedCall(500, () => this.drawZoneFrame(0x7b2cbf));
            }
        });
    }

    moveToStart(gameObject) {
        this.tweens.add({
            targets: gameObject,
            x: gameObject.getData('startX'),
            y: gameObject.getData('startY'),
            duration: 500,
            ease: 'Expo.easeOut',
            onComplete: () => { gameObject.depth = 1; }
        });
    }

    handleLevelComplete() {
        this.add.text(this.scale.width / 2, 450, 'ERİŞİM ONAYLANDI!', {
            fontSize: '28px', color: '#00ffcc', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.time.delayedCall(1500, () => {
            this.scene.start('ArrayANI');
        });
    }
} 