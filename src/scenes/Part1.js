// src/scenes/Part1.js
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

        // 1. Bölüm Başlığı
        this.add.text(width / 2, 50, level.title, {
            fontSize: '28px', color: Theme.accent, fontFamily: Theme.fontFamily
        }).setOrigin(0.5);

        // 2. Kod Editörü Arka Planı (Koyu Mor Yüzey)
        const editorBg = this.add.rectangle(width / 2, 220, 320, 180, Theme.surface)
            .setStrokeStyle(2, Theme.primary);

        // 3. Kod Metni (Eksik alan için boşluk bırakıyoruz)
        this.add.text(40, 160, level.description, { fontSize: '14px', color: '#ccc', wordWrap: { width: 280 } });

        const displayCode = level.code.replace('____', '      '); // Boşluk bırak
        this.codeDisplay = this.add.text(width / 2, 240, displayCode, {
            fontSize: '20px',
            fontFamily: Theme.fontFamily,
            color: Theme.text
        }).setOrigin(0.5);

        // 4. Drop Zone (Bırakma Alanı)
        // Koordinatı koda göre manuel ayarlamak gerekebilir, şimdilik dinamik bir kutu:
        this.dropZone = this.add.zone(width / 2 + 50, 240, 60, 40).setRectangleDropZone(60, 40);

        // Görsel Drop Zone Sınırı (Opsiyonel)
        this.dropZoneGraphics = this.add.graphics();
        this.dropZoneGraphics.lineStyle(2, Theme.accent, 0.5);
        this.dropZoneGraphics.strokeRect(this.dropZone.x - 30, this.dropZone.y - 20, 60, 40);

        // 5. Seçenekler (Parçalar)
        this.createOptions(level.options, level.missing);
    }

    createOptions(options, correctOnes) {
        const { width, height } = this.scale;
        options.forEach((opt, index) => {
            const x = 70 + (index * 75);
            const y = 600;

            const container = this.add.container(x, y);
            const bg = this.add.rectangle(0, 0, 60, 50, Theme.primary).setInteractive({ useHandCursor: true });
            const txt = this.add.text(0, 0, opt, { fontSize: '20px', color: '#fff' }).setOrigin(0.5);

            container.add([bg, txt]);
            container.setData('value', opt);

            this.input.setDraggable(container);

            // Sürükleme Olayları
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

        // Bırakma Kontrolü
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            const val = gameObject.getData('value');
            if (val === Levels[this.currentLevelIndex].missing) {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                this.handleLevelComplete();
            } else {
                this.cameras.main.shake(200, 0.01); // Hata geri bildirimi
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });
    }

    handleLevelComplete() {
        const level = Levels[this.currentLevelIndex];

        // Başarı Mesajı
        this.add.text(180, 400, 'MÜKEMMEL!', { fontSize: '32px', color: Theme.highlight }).setOrigin(0.5);

        // Kilidi aç (LocalStorage güncelle)
        let unlocked = JSON.parse(localStorage.getItem('unlockedVisuals') || "[]");
        if (!unlocked.includes(level.visualTarget)) {
            unlocked.push(level.visualTarget);
            localStorage.setItem('unlockedVisuals', JSON.stringify(unlocked));
        }

        // 2 saniye sonra Part 2'ye (Görselleştirme) geç
        this.time.delayedCall(1500, () => {
            this.scene.start('Part2', { visualType: level.visualTarget });
        });
    }
}