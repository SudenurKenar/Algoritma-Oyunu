import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class ArrayUpdatePart extends Phaser.Scene {
    constructor() {
        super('ArrayUpdatePart');
    }

    create() {
        const { width, height } = this.scale;

        // Arka plan (Siyah içermez, derin mor)
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1);

        // Başlık - Konumu ve genişliği sınırlandırıldı
        this.add.text(width / 2, height * 0.08, "VERİ DÜZENLEME", {
            fontSize: '28px',
            fontFamily: Theme.fontFamily,
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: Theme.accent,
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Alt açıklama - Taşkınlığı önlemek için wordWrap (kelime kaydırma) eklendi
        this.add.text(width / 2, height * 0.15, "Aşağıdaki '50' bloğunu dizideki '?' yerine yerleştir!", {
            fontSize: '16px',
            fontFamily: Theme.fontFamily,
            color: '#e0aaff',
            align: 'center',
            wordWrap: { width: width * 0.8 } // Ekranın %80'inden fazlasına yayılmaz
        }).setOrigin(0.5);

        this.targetData = [10, 30, "?", 70];
        this.createLevel();

        // Yama bloğunu daha güvenli bir konuma (alt merkeze) koyuyoruz
        this.createPatchBlock(width / 2, height * 0.85);
    }

    createLevel() {
        const { width, height } = this.scale;
        const spacing = 75; // Aralığı biraz daralttık
        const totalWidth = (this.targetData.length - 1) * spacing;
        const startX = (width - totalWidth) / 2;
        const centerY = height * 0.45;

        this.slots = [];

        this.targetData.forEach((val, i) => {
            const x = startX + (i * spacing);
            const y = centerY;

            const box = this.add.rectangle(x, y, 65, 65, Theme.surface)
                .setStrokeStyle(3, val === "?" ? 0xffff00 : Theme.primary);

            const txt = this.add.text(x, y, val, {
                fontSize: '20px',
                color: val === "?" ? '#ffff00' : '#fff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // İndisler kutuya daha yakın
            this.add.text(x, y + 42, `[${i}]`, {
                fontSize: '14px',
                color: '#888'
            }).setOrigin(0.5);

            if (val === "?") {
                this.updateTarget = { box, txt, index: i };
            }
        });
    }

    createPatchBlock(x, y) {
        this.patchContainer = this.add.container(x, y);

        const patchBox = this.add.rectangle(0, 0, 65, 65, 0x00ffcc, 0.2)
            .setStrokeStyle(3, 0x00ffcc)
            .setInteractive({ draggable: true });

        const patchTxt = this.add.text(0, 0, "50", {
            fontSize: '20px', color: '#00ffcc', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.patchContainer.add([patchBox, patchTxt]);

        // Sürükleme Mantığı (Pointer bazlı, kaçmayı önler)
        patchBox.on('drag', (pointer) => {
            this.patchContainer.x = pointer.worldX;
            this.patchContainer.y = pointer.worldY;
        });

        patchBox.on('dragend', () => {
            const isOnTarget = Phaser.Geom.Intersects.RectangleToRectangle(
                patchBox.getBounds(),
                this.updateTarget.box.getBounds()
            );

            if (isOnTarget) {
                this.handleUpdateSuccess();
            } else {
                // Hatalı bırakılırsa asil bir şekilde yerine döner
                this.tweens.add({ targets: this.patchContainer, x, y, duration: 400, ease: 'Back.easeOut' });
            }
        });
    }

    handleUpdateSuccess() {
        this.patchContainer.destroy();

        this.updateTarget.txt.setText("50").setColor('#00ffcc');
        this.updateTarget.box.setStrokeStyle(4, 0x00ffcc);

        this.cameras.main.flash(400, 0, 255, 204);

        this.time.delayedCall(800, () => {
            this.scene.start('ArrayUpdateANI');
        });
    }
}