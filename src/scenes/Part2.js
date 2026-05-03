// src/scenes/Part2.js
import Phaser from 'phaser';
import { Theme } from '../core/theme.js';

export class Part2 extends Phaser.Scene {
    constructor() {
        super('Part2');
    }

    init(data) {
        this.visualType = data.visualType; // Hangi algoritmayı görselleştireceğiz?
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, 50, "Algoritma Çalışıyor...", {
            fontSize: '24px', fontFamily: Theme.fontFamily, color: Theme.accent
        }).setOrigin(0.5);

        // Örnek bir dizi oluşturalım
        this.array = [60, 40, 90, 30, 70, 50];
        this.bars = [];

        // Diziyi ekrana sütunlar olarak çizelim
        this.array.forEach((val, i) => {
            const bar = this.add.rectangle(60 + (i * 50), 400, 40, val * 2, Theme.primary);
            bar.setOrigin(0.5, 1); // Alt kısımdan yukarı doğru büyüsün
            const txt = this.add.text(60 + (i * 50), 410, val.toString(), { fontSize: '14px' }).setOrigin(0.5);
            this.bars.push({ rect: bar, text: txt, value: val });
        });

        // 2 saniye sonra sıralama animasyonunu başlat
        this.time.delayedCall(2000, () => this.bubbleSortAnimation());
    }

    async bubbleSortAnimation() {
        let n = this.bars.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // Karşılaştırılanları vurgula (Açık Mor yap)
                this.bars[j].rect.setFillStyle(Theme.accent);
                this.bars[j + 1].rect.setFillStyle(Theme.accent);

                await this.wait(600); // Animasyon hızı

                if (this.bars[j].value > this.bars[j + 1].value) {
                    // Yer değiştirme animasyonu (Tween)
                    await this.swapBars(j, j + 1);
                }

                // Renkleri eski haline döndür
                this.bars[j].rect.setFillStyle(Theme.primary);
                this.bars[j + 1].rect.setFillStyle(Theme.primary);
            }
            // Sıralanan sütunu yeşil yap (Mükemmel!)
            this.bars[n - i - 1].rect.setFillStyle(Theme.highlight);
        }
        this.bars[0].rect.setFillStyle(Theme.highlight);

        this.add.text(180, 500, "Sıralama Tamamlandı!", { color: Theme.highlight }).setOrigin(0.5);
    }

    swapBars(i, j) {
        return new Promise(resolve => {
            const tempX_i = this.bars[i].rect.x;
            const tempX_j = this.bars[j].rect.x;

            this.tweens.add({
                targets: [this.bars[i].rect, this.bars[i].text],
                x: tempX_j,
                duration: 400,
                onComplete: resolve
            });

            this.tweens.add({
                targets: [this.bars[j].rect, this.bars[j].text],
                x: tempX_i,
                duration: 400
            });

            // Mantıksal dizide yer değiştir
            [this.bars[i], this.bars[j]] = [this.bars[j], this.bars[i]];
        });
    }

    wait(ms) {
        return new Promise(resolve => this.time.delayedCall(ms, resolve));
    }
}