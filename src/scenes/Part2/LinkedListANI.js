import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class LinkedListANI extends Phaser.Scene {
    constructor() {
        super('LinkedListANI');
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, 50, "Bağlı Liste Yapısı", {
            fontSize: '24px', fontFamily: Theme.fontFamily, color: Theme.accent
        }).setOrigin(0.5);

        // Örnek veri kümesi (Düğümler)
        this.data = [10, 25, 40, 55];
        this.nodes = [];
        this.arrows = [];

        // Düğümleri oluştur
        this.createLinkedList();

        // 2 saniye sonra düğüm ekleme simülasyonu başlat
        this.time.delayedCall(2000, () => this.animateInsertion());
    }

    createLinkedList() {
        const startX = 60;
        const startY = 300;

        this.data.forEach((val, i) => {
            const x = startX + (i * 90);

            // Düğüm (Node) Grubu
            const nodeCircle = this.add.circle(x, startY, 25, Theme.primary).setStrokeStyle(2, Theme.accent);
            const nodeText = this.add.text(x, startY, val, { fontSize: '16px', color: '#fff' }).setOrigin(0.5);

            this.nodes.push({ circle: nodeCircle, text: nodeText, value: val });

            // Ok (Pointer) çizimi - Son düğüm değilse
            if (i < this.data.length - 1) {
                const arrow = this.add.line(0, 0, x + 25, startY, x + 65, startY, Theme.accent).setOrigin(0, 0);
                arrow.setLineWidth(2);
                this.arrows.push(arrow);
            }
        });
    }

    async animateInsertion() {
        const { width } = this.scale;
        const insertX = 150;
        const insertY = 450;

        // 1. Yeni düğüm aşağıda belirir
        const newNode = this.add.circle(insertX, insertY, 25, Theme.highlight).setStrokeStyle(2, 0xffffff);
        const newText = this.add.text(insertX, insertY, "99", { fontSize: '16px', color: '#000' }).setOrigin(0.5);

        this.add.text(width / 2, 550, "Yeni Düğüm Ekleniyor...", { color: Theme.highlight }).setOrigin(0.5);

        await this.wait(1000);

        // 2. Mevcut bağın kopuşu ve yeni bağların oluşu (Görsel temsil)
        this.tweens.add({
            targets: [newNode, newText],
            x: 150,
            y: 300,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.cameras.main.flash(500, 123, 44, 191); // Mor bir parlama
                this.add.text(width / 2, 600, "Bağlantılar Güncellendi!", { color: '#3cff00' }).setOrigin(0.5);
            }
        });
    }

    wait(ms) {
        return new Promise(resolve => this.time.delayedCall(ms, resolve));
    }
}