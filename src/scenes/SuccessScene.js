import Phaser from 'phaser';
import { Theme } from '../core/theme.js';

export class SuccessScene extends Phaser.Scene {
    constructor() {
        super('SuccessScene');
    }

    create(data) {
        const { nextScene, currentScene } = data;
        const { width, height } = this.scale;

        // 1. Arka Plan Karartma
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

        // 2. Tebrik Paneli
        const panel = this.add.rectangle(width / 2, height / 2, 420, 280, Theme.surface)
            .setStrokeStyle(3, Theme.accent);

        this.add.text(width / 2, height / 2 - 85, "TEBRİKLER!", {
            fontSize: '32px', fontFamily: Theme.fontFamily, color: '#ffff00', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 35, "Bölüm Başarıyla Tamamlandı", {
            fontSize: '16px', fontFamily: Theme.fontFamily, color: '#ffffff'
        }).setOrigin(0.5);

        // --- BUTONLAR (FontAwesome İkonlu Üçlü Nizam) ---

        // A. Ana Menü Butonu (İkon: \uf015 - Home)
        this.createIconButton(width / 2 - 130, height / 2 + 55, "\uf015", "MENU", () => {
            this.stopAll(currentScene);
            this.scene.start('MainMenu');
        });

        // B. Bölümler Butonu (İkon: \uf279 - Map)
        this.createIconButton(width / 2, height / 2 + 55, "\uf279", "MAP", () => {
            this.stopAll(currentScene);
            this.scene.start('LevelSelect');
        });

        // C. Sonraki / Arşive Dön Butonu (İkon: \uf061 - Arrow Right / \uf008 - Film)
        const isFromGallery = currentScene.endsWith('ANI');
        const nextLabel = isFromGallery ? "ARCHIVE" : "NEXT";
        const nextIcon = isFromGallery ? "\uf008" : "\uf061";

        this.createIconButton(width / 2 + 130, height / 2 + 55, nextIcon, nextLabel, () => {
            const levelData = this.getLevelData(currentScene);
            const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;

            if (levelData.id >= unlockedLevel) {
                localStorage.setItem('unlockedLevel', levelData.id + 1);
            }

            if (levelData.ani) {
                let visuals = JSON.parse(localStorage.getItem('unlockedVisuals') || "[]");
                if (!visuals.includes(levelData.ani)) {
                    visuals.push(levelData.ani);
                    localStorage.setItem('unlockedVisuals', JSON.stringify(visuals));
                }
            }

            this.stopAll(currentScene);

            if (isFromGallery) {
                this.scene.start('GalleryScene');
            } else if (nextScene && nextScene !== 'LevelSelect') {
                this.scene.start(nextScene);
            } else {
                this.scene.start('LevelSelect');
            }
        }, true);
    }

    stopAll(currentScene) {
        this.scene.stop(currentScene);
        this.scene.stop('SuccessScene');
    }

    getLevelData(sceneName) {
        const config = {
            'ArrayPart': { id: 1, ani: 'ArrayPartANI' },
            'ArrayDeletePart': { id: 2, ani: 'ArrayDeleteANI' },
            'ArrayUpdatePart': { id: 3, ani: 'ArrayUpdateANI' },
            'LinkedListNodePart': { id: 4, ani: 'LinkedListNodeANI' },
            'LinkedListLinkPart': { id: 5, ani: 'LinkedListLinkANI' },
            'LinkedListInsertPart': { id: 6, ani: 'LinkedListInsertANI' },
            'LinkedListDeletePart': { id: 7, ani: 'LinkedListDeleteANI' }
        };
        const baseName = sceneName.endsWith('ANI') ? sceneName.replace('ANI', 'Part') : sceneName;
        return config[baseName] || { id: 1, ani: null };
    }

    // YENİ: İkonlu Buton Oluşturucu
    createIconButton(x, y, iconUnicode, label, callback, isPrimary = false) {
        const container = this.add.container(x, y);

        // Buton Kutusu
        const btnBg = this.add.rectangle(0, 0, 100, 70, isPrimary ? Theme.primary : '#333333')
            .setStrokeStyle(2, Theme.accent)
            .setInteractive({ useHandCursor: true });

        // FontAwesome İkonu
        // SuccessScene.js içinde createIconButton metodundaki icon kısmını şununla değiştirin:

        const icon = this.add.text(0, -10, iconUnicode, {
            fontFamily: 'fontAwesome', // index.html'de tanımlayacağımız isim
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Alt Metin
        const text = this.add.text(0, 20, label, {
            fontSize: '11px',
            fontFamily: Theme.fontFamily,
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        container.add([btnBg, icon, text]);

        // Efektler
        btnBg.on('pointerdown', callback);
        btnBg.on('pointerover', () => {
            btnBg.setFillStyle(Theme.accent);
            icon.setColor('#000000');
            text.setColor('#000000');
        });
        btnBg.on('pointerout', () => {
            btnBg.setFillStyle(isPrimary ? Theme.primary : '#333333');
            icon.setColor('#ffffff');
            text.setColor('#ffffff');
        });

        return container;
    }
}