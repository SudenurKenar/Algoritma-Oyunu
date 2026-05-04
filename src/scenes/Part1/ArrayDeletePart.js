import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class ArrayDeletePart extends Phaser.Scene {
    constructor() {
        super('ArrayDeletePart');
    }

    create() {
        const { width, height } = this.scale;

        // Arka plan (Siyah içermez)
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1);

        // Başlıklar - Konumlar dinamik (Yüzdelik)
        this.add.text(width / 2, height * 0.1, "VERİ AYIKLAMA", {
            fontSize: '28px', fontFamily: Theme.fontFamily, color: '#ffffff', fontStyle: 'bold',
            stroke: Theme.accent, strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.16, "Hatalı [ERR] bloğunu çöpe sürükle!", {
            fontSize: '16px', fontFamily: Theme.fontFamily, color: '#e0aaff'
        }).setOrigin(0.5);

        this.dataList = [
            { val: 10, isError: false },
            { val: 20, isError: false },
            { val: "ERR", isError: true },
            { val: 30, isError: false }
        ];

        // SİLME ALANI (Ekranın alt kısmına sabitlendi)
        this.bin = this.add.container(width / 2, height * 0.85);
        const binBg = this.add.rectangle(0, 0, 200, 80, 0xff0054, 0.15).setStrokeStyle(2, 0xff0054);
        const binText = this.add.text(0, 0, "ÇÖP KUTUSU", { fontSize: '18px', color: '#ff0054', fontStyle: 'bold' }).setOrigin(0.5);
        this.bin.add([binBg, binText]);

        // Seviyeyi oluştur
        this.createLevel();
    }

    createLevel() {
        const { width, height } = this.scale;
        const spacing = 85;
        const startX = (width - (this.dataList.length - 1) * spacing) / 2;
        const centerY = height * 0.5;

        this.dataList.forEach((item, i) => {
            const initialX = startX + (i * spacing);
            const initialY = centerY;

            const container = this.add.container(initialX, initialY);

            const box = this.add.rectangle(0, 0, 70, 70, Theme.surface)
                .setStrokeStyle(3, item.isError ? 0xff0054 : Theme.primary)
                .setInteractive({ draggable: true });

            const txt = this.add.text(0, 0, item.val, {
                fontSize: '20px', color: '#fff', fontStyle: 'bold'
            }).setOrigin(0.5);

            const idx = this.add.text(0, 45, `[${i}]`, { fontSize: '14px', color: '#ffff00' }).setOrigin(0.5);

            container.add([box, txt, idx]);

            // GÜNCELLENMİŞ SÜRÜKLEME MANTIĞI (Işınlanmayı Önler)
            box.on('dragstart', () => {
                container.setDepth(100);
                box.setStrokeStyle(4, 0xffff00);
            });

            box.on('drag', (pointer, dragX, dragY) => {
                // Container'ın konumunu doğrudan farenin dünyadaki konumuna eşitliyoruz
                container.x = pointer.worldX;
                container.y = pointer.worldY;
            });

            box.on('dragend', () => {
                box.setStrokeStyle(3, item.isError ? 0xff0054 : Theme.primary);

                // Kutu silme alanına değiyor mu?
                const isOverBin = Phaser.Geom.Intersects.RectangleToRectangle(
                    box.getBounds(),
                    this.bin.getBounds()
                );

                if (isOverBin && item.isError) {
                    this.handleSuccess(container);
                } else if (isOverBin && !item.isError) {
                    this.cameras.main.shake(200, 0.005);
                    this.returnToPosition(container, initialX, initialY);
                } else {
                    this.returnToPosition(container, initialX, initialY);
                }
            });
        });
    }

    handleSuccess(target) {
        this.tweens.add({
            targets: target,
            scale: 0,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                target.destroy();
                this.cameras.main.flash(400, 255, 0, 84);
                this.time.delayedCall(500, () => this.scene.start('ArrayDeleteANI'));
            }
        });
    }

    returnToPosition(container, x, y) {
        this.tweens.add({ targets: container, x, y, duration: 400, ease: 'Back.easeOut' });
    }
}