import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class LinkedListInsertPart extends Phaser.Scene {
    constructor() {
        super('LinkedListInsertPart');
    }

    create() {
        const { width, height } = this.scale;

        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1);

        // Başlık - wordWrap eklendi
        this.add.text(width / 2, height * 0.08, "BÖLÜM 3: ARAYA EKLEME", {
            fontSize: '20px', fontFamily: Theme.fontFamily, color: '#ffffff', fontStyle: 'bold',
            align: 'center', wordWrap: { width: width * 0.9 }
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.18, "15 düğümünü 10 ve 20'nin arasına sürükle!", {
            fontSize: '13px', fontFamily: Theme.fontFamily, color: '#e0aaff', align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        this.node10 = this.createNode(width * 0.22, height * 0.45, "10");
        this.node20 = this.createNode(width * 0.78, height * 0.45, "20");
        this.node15 = this.createNode(width * 0.5, height * 0.8, "15", true);

        this.mainLink = this.add.graphics();
        this.drawMainLink();
        this.setupInsertionLogic();
    }

    createNode(x, y, value, draggable = false) {
        const container = this.add.container(x, y);
        const dBox = this.add.rectangle(-22, 0, 45, 55, Theme.surface).setStrokeStyle(2, 0x00ffcc);
        const nBox = this.add.rectangle(22, 0, 45, 55, Theme.surface).setStrokeStyle(2, 0x7b2cbf);
        const txt = this.add.text(-22, 0, value, { fontSize: '14px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        container.add([dBox, nBox, txt]);

        if (draggable) {
            dBox.setInteractive({ draggable: true, useHandCursor: true });
            dBox.on('drag', (p) => { container.setPosition(p.worldX, p.worldY); });
        }
        return { container, x, y, dBox };
    }

    drawMainLink() {
        this.mainLink.clear().lineStyle(2, 0x00ffcc, 0.4);
        this.mainLink.lineBetween(this.node10.container.x + 22, this.node10.container.y, this.node20.container.x - 22, this.node20.container.y);
    }

    setupInsertionLogic() {
        const { width, height } = this.scale;
        this.input.on('dragend', () => {
            const dist = Phaser.Math.Distance.Between(this.node15.container.x, this.node15.container.y, width / 2, height * 0.45);
            if (dist < 50) {
                this.handleInsertSuccess();
            } else {
                this.tweens.add({ targets: this.node15.container, x: width * 0.5, y: height * 0.8, duration: 400, ease: 'Back.out' });
            }
        });
    }

    handleInsertSuccess() {
        const { width, height } = this.scale;
        this.node15.container.setPosition(width * 0.5, height * 0.45);
        this.mainLink.clear();
        const g = this.add.graphics().lineStyle(3, 0x00ffcc, 1);
        g.lineBetween(this.node10.container.x + 22, this.node10.container.y, width * 0.5 - 22, height * 0.45);
        g.lineBetween(width * 0.5 + 22, height * 0.45, this.node20.container.x - 22, height * 0.45);
        this.cameras.main.flash(500, 0, 255, 204);
        this.time.delayedCall(1000, () => { this.scene.start('LinkedListInsertANI'); });
    }
}