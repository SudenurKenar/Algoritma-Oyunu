import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class LinkedListNodePart extends Phaser.Scene {
    constructor() {
        super('LinkedListNodePart');
    }

    create() {
        const { width, height } = this.scale;

        // 1. Arka Planı Sabitle
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1);

        // 2. Başlık ve Açıklama (Yüzdelik ve Kesin Merkezleme)
        this.add.text(width / 2, height * 0.12, "BÖLÜM 1: DÜĞÜM OLUŞTURMA", {
            fontSize: '24px', fontFamily: Theme.fontFamily, color: '#ffffff', fontStyle: 'bold',
            stroke: Theme.accent, strokeThickness: 4, align: 'center'
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.22, "Veriyi (Data) uygun yuvaya yerleştirerek\nNode yapısını tamamla!", {
            fontSize: '14px', fontFamily: Theme.fontFamily, color: '#e0aaff', align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        // 3. DÜĞÜM İSKELETİ (Tam Ekran Ortası)
        // Container'ın kendisini merkeze alıyoruz
        this.nodeGroup = this.add.container(width / 2, height * 0.5);

        // Data Yuvası (Soldaki kutu)
        this.dataSlot = this.add.rectangle(-45, 0, 80, 90, 0x00ffcc, 0.05)
            .setStrokeStyle(2, 0x00ffcc, 0.3);
        const dataLabel = this.add.text(-45, 60, "DATA", { fontSize: '12px', color: '#00ffcc', fontStyle: 'bold' }).setOrigin(0.5);

        // Next Yuvası (Sağdaki kutu)
        this.nextSlot = this.add.rectangle(45, 0, 80, 90, 0x7b2cbf, 0.2)
            .setStrokeStyle(2, 0x7b2cbf);
        const nextText = this.add.text(45, 0, "NEXT", { fontSize: '16px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
        const nextLabel = this.add.text(45, 60, "POINTER", { fontSize: '12px', color: '#7b2cbf', fontStyle: 'bold' }).setOrigin(0.5);

        this.nodeGroup.add([this.dataSlot, dataLabel, this.nextSlot, nextText, nextLabel]);

        // 4. SÜRÜKLENEBİLİR VERİ (Alt Kısım)
        this.createDraggableData(width / 2, height * 0.82);
    }

    createDraggableData(x, y) {
        this.dragContainer = this.add.container(x, y);

        const box = this.add.rectangle(0, 0, 70, 70, 0x00ffcc, 0.2)
            .setStrokeStyle(3, 0x00ffcc)
            .setInteractive({ draggable: true });

        const txt = this.add.text(0, 0, "42", {
            fontSize: '22px', color: '#00ffcc', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.dragContainer.add([box, txt]);

        box.on('drag', (pointer) => {
            // Container'ı farenin tam ucuna bağla
            this.dragContainer.x = pointer.worldX;
            this.dragContainer.y = pointer.worldY;
        });

        box.on('dragend', () => {
            // getBounds() ile dünya koordinatlarında çakışma kontrolü
            const slotBounds = this.dataSlot.getBounds();
            const boxBounds = box.getBounds();

            if (Phaser.Geom.Intersects.RectangleToRectangle(slotBounds, boxBounds)) {
                this.handleSuccess();
            } else {
                // Yerine yumuşakça geri döner
                this.tweens.add({ targets: this.dragContainer, x, y, duration: 400, ease: 'Back.easeOut' });
            }
        });
    }

    handleSuccess() {
        this.dragContainer.destroy();

        // Veriyi yuvaya (Container içine) ekle
        const finalData = this.add.text(-45, 0, "42", {
            fontSize: '24px', color: '#00ffcc', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.nodeGroup.add(finalData);
        this.dataSlot.setAlpha(1).setStrokeStyle(3, 0x00ffcc);

        this.cameras.main.flash(400, 0, 255, 204);

        this.time.delayedCall(800, () => {
            this.scene.start('LinkedListNodeANI');
        });
    }
}