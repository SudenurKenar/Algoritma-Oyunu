import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class LinkedListLinkPart extends Phaser.Scene {
    constructor() {
        super('LinkedListLinkPart');
    }

    create() {
        const { width, height } = this.scale;

        // Arka Plan
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1);

        this.add.text(width / 2, height * 0.08, "BÖLÜM 2: BAĞLANTI KURMA", {
            fontSize: '24px', fontFamily: Theme.fontFamily, color: '#ffffff', fontStyle: 'bold',
            stroke: Theme.accent, strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.15, "Düğüm 10'un NEXT noktasından tutup\nDüğüm 20'ye doğru çek!", {
            fontSize: '15px', fontFamily: Theme.fontFamily, color: '#e0aaff', align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        // --- DÜĞÜMLERİ OLUŞTUR ---
        this.node1 = this.createNode(width * 0.3, height * 0.45, "10");
        this.node2 = this.createNode(width * 0.7, height * 0.45, "20");

        // --- BAĞLANTI ÇİZGİSİ ---
        this.graphics = this.add.graphics();
        this.isDrawing = false;

        // Başlangıç noktası (Node 1'in NEXT kutusunun merkezi)
        this.startX = width * 0.3 + 30;
        this.startY = height * 0.45;

        // İnteraktif nokta
        this.linkPoint = this.add.circle(this.startX, this.startY, 15, 0x00ffcc, 0.3)
            .setInteractive({ useHandCursor: true });

        // Parlama efekti ekleyelim ki nereye basılacağı anlaşılsın
        this.tweens.add({
            targets: this.linkPoint,
            alpha: 0.8,
            scale: 1.2,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.setupInteractions();
    }

    createNode(x, y, value) {
        const container = this.add.container(x, y);
        const dBox = this.add.rectangle(-30, 0, 60, 70, Theme.surface).setStrokeStyle(2, 0x00ffcc);
        const nBox = this.add.rectangle(30, 0, 60, 70, Theme.surface).setStrokeStyle(2, 0x7b2cbf);
        const txt = this.add.text(-30, 0, value, { fontSize: '18px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        const nextTxt = this.add.text(30, 0, "next", { fontSize: '12px', color: '#7b2cbf' }).setOrigin(0.5);

        container.add([dBox, nBox, txt, nextTxt]);
        return { container, x, y };
    }

    setupInteractions() {
        this.linkPoint.on('pointerdown', () => {
            this.isDrawing = true;
        });

        this.input.on('pointermove', (pointer) => {
            if (this.isDrawing) {
                this.graphics.clear();
                this.graphics.lineStyle(4, 0x00ffcc, 1);
                this.graphics.lineBetween(this.startX, this.startY, pointer.x, pointer.y);
            }
        });

        this.input.on('pointerup', (pointer) => {
            if (!this.isDrawing) return;
            this.isDrawing = false;

            // MESAFE KONTROLÜ: Farenin bırakıldığı yer Node 2'nin merkezine 50px yakın mı?
            const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.node2.x, this.node2.y);

            if (dist < 60) {
                this.handleLinkSuccess();
            } else {
                this.graphics.clear();
            }
        });
    }

    handleLinkSuccess() {
        this.graphics.clear();
        this.graphics.lineStyle(4, 0x00ffcc, 1);

        const targetX = this.node2.x - 30; // Node 2'nin sol kenarı
        const targetY = this.node2.y;

        // Sabitlenen ok
        this.graphics.lineBetween(this.startX, this.startY, targetX, targetY);

        // Ok ucu
        this.graphics.fillStyle(0x00ffcc, 1);
        this.graphics.fillTriangle(
            targetX, targetY,
            targetX - 12, targetY - 8,
            targetX - 12, targetY + 8
        );

        this.cameras.main.flash(500, 0, 255, 204);
        this.linkPoint.destroy(); // Artık sürüklenmesin

        this.time.delayedCall(1200, () => {
            this.scene.start('LinkedListLinkANI');
        });
    }
}