import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class LinkedListDeletePart extends Phaser.Scene {
    constructor() {
        super('LinkedListDeletePart');
    }

    create() {
        const { width, height } = this.scale;

        // Arka Plan
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1);

        this.add.text(width / 2, height * 0.08, "BÖLÜM 4: VERİ SİLME", {
            fontSize: '22px', fontFamily: Theme.fontFamily, color: '#ffffff', fontStyle: 'bold',
            stroke: Theme.accent, strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.16, "15 düğümünü silmek için üzerine çift tıkla!", {
            fontSize: '14px', fontFamily: Theme.fontFamily, color: '#e0aaff', align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        // --- DÜĞÜMLER ---
        this.nodes = [
            this.createNode(width * 0.25, height * 0.45, "10"),
            this.createNode(width * 0.5, height * 0.45, "15", true), // Silinebilir eleman
            this.createNode(width * 0.75, height * 0.45, "20")
        ];

        this.linkGraphics = this.add.graphics();
        this.updateLinks();
    }

    createNode(x, y, value, deletable = false) {
        const container = this.add.container(x, y);
        const dBox = this.add.rectangle(-22, 0, 45, 55, Theme.surface).setStrokeStyle(2, 0x00ffcc);
        const nBox = this.add.rectangle(22, 0, 45, 55, Theme.surface).setStrokeStyle(2, 0x7b2cbf);
        const txt = this.add.text(-22, 0, value, { fontSize: '14px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        container.add([dBox, nBox, txt]);

        if (deletable) {
            dBox.setInteractive({ useHandCursor: true });
            // Çift tıklama ile silme simülasyonu
            dBox.on('pointerdown', () => {
                this.handleDelete(container);
            });
        }
        return container;
    }

    updateLinks() {
        this.linkGraphics.clear().lineStyle(3, 0x00ffcc, 1);
        // Aktif olan düğümler arasında bağ çiz
        for (let i = 0; i < this.nodes.length - 1; i++) {
            if (this.nodes[i].active && this.nodes[i + 1].active) {
                this.linkGraphics.lineBetween(this.nodes[i].x + 22, this.nodes[i].y, this.nodes[i + 1].x - 22, this.nodes[i + 1].y);
            }
        }
    }

    handleDelete(target) {
        // Silme animasyonu (Küçülerek kaybolma)
        this.tweens.add({
            targets: target,
            scale: 0,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                target.active = false;
                this.animateBypass();
            }
        });
    }

    animateBypass() {
        // 10'dan 20'ye yeni köprü kurulur
        this.linkGraphics.clear().lineStyle(3, 0xffff00, 1); // Yeni bağ sarı parlar

        const startX = this.nodes[0].x + 22;
        const startY = this.nodes[0].y;
        const endX = this.nodes[2].x - 22;
        const endY = this.nodes[2].y;

        this.tweens.addCounter({
            from: 0, to: 1, duration: 800,
            onUpdate: (t) => {
                const v = t.getValue();
                this.linkGraphics.clear().lineStyle(4, 0xffff00, 1);
                this.linkGraphics.lineBetween(startX, startY, startX + (endX - startX) * v, startY);
            },
            onComplete: () => {
                this.cameras.main.flash(500, 255, 255, 0);
                this.time.delayedCall(1000, () => {
                    this.scene.start('LinkedListDeleteANI');
                });
            }
        });
    }
}