import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class LinkedListDeleteANI extends Phaser.Scene {
    constructor() {
        super('LinkedListDeleteANI');
    }

    create() {
        const { width, height } = this.scale;

        // Arka Plan
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1);

        this.add.text(width / 2, height * 0.05, "BELLEKTE VERİ SİLME MANTIĞI", {
            fontSize: '18px', fontFamily: Theme.fontFamily, color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        // 1. KOD BLOĞU (Sol Üst - Kesin Hizalama)
        const codeText = [
            "// 15 düğümünü aradan çıkar",
            "// 10'un işaretçisini güncelle",
            "n10.next = n10.next.next;",
            "",
            "// 15 artık sahipsiz kaldı!"
        ];

        this.codeBg = this.add.rectangle(width * 0.25, height * 0.4, width * 0.45, 180, 0x000000, 0.6)
            .setStrokeStyle(2, 0x00ffcc).setAlpha(0);

        this.codeDisp = this.add.text(width * 0.05, height * 0.3, codeText.join("\n"), {
            fontSize: width < 450 ? '11px' : '13px',
            fontFamily: 'monospace',
            color: '#00ffcc',
            lineSpacing: 15,
            wordWrap: { width: width * 0.4 }
        }).setAlpha(0);

        // 2. GÖRSEL DÜĞÜMLER
        this.node10 = this.createNodeVisual(width * 0.8, height * 0.25, "10", "ADDR15");
        this.node15 = this.createNodeVisual(width * 0.8, height * 0.45, "15", "ADDR20");
        this.node20 = this.createNodeVisual(width * 0.8, height * 0.65, "20", "null");

        // Bağlantı Grafikleri
        this.arrow10to15 = this.add.graphics();
        this.arrow15to20 = this.add.graphics();
        this.bypassArrow = this.add.graphics().setAlpha(0);

        this.drawStaticArrow(this.arrow10to15, this.node10, this.node15);
        this.drawStaticArrow(this.arrow15to20, this.node15, this.node20);

        this.startDeleteSequence();
    }

    createNodeVisual(x, y, data, next) {
        const container = this.add.container(x, y);
        const dBox = this.add.rectangle(-25, 0, 50, 60, Theme.surface).setStrokeStyle(2, 0x00ffcc);
        const nBox = this.add.rectangle(25, 0, 50, 60, Theme.surface).setStrokeStyle(2, 0x7b2cbf);
        const dVal = this.add.text(-25, 0, data, { fontSize: '15px', color: '#fff' }).setOrigin(0.5);
        const nVal = this.add.text(25, 0, next, { fontSize: '9px', color: '#7b2cbf' }).setOrigin(0.5);
        container.add([dBox, nBox, dVal, nVal]);
        container.nVal = nVal;
        return container;
    }

    drawStaticArrow(g, from, to) {
        g.clear().lineStyle(3, 0x00ffcc, 0.6);
        g.lineBetween(from.x, from.y + 30, to.x, to.y - 30);
    }

    async startDeleteSequence() {
        const { width, height } = this.scale;
        const lineH = 28;
        const startY = this.codeDisp.y + 70; // "n10.next = n10.next.next" satırı

        this.tweens.add({ targets: [this.codeBg, this.codeDisp], alpha: 1, duration: 800 });
        await this.wait(1500);

        const guide = this.add.text(width / 2, height * 0.88, "", {
            fontSize: '14px', color: '#ffff00', backgroundColor: '#000000cc', padding: 8, align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5).setAlpha(0);

        // ADIM 1: Vurgu ve Mantık
        guide.setText("n10'un 'next' değerini, n15'in tuttuğu adrese (20) yönlendiriyoruz.").setAlpha(1);
        const highlight = this.add.rectangle(this.codeBg.x, startY, this.codeBg.width * 0.9, 26, 0xffff00, 0.2);
        await this.wait(2000);

        // ADIM 2: Eski Bağın Kopuşu ve Yeni Ok
        this.tweens.add({ targets: this.arrow10to15, alpha: 0, duration: 500 });
        this.node10.nVal.setText("ADDR20").setColor("#ffff00");

        this.bypassArrow.setAlpha(1);
        this.tweens.addCounter({
            from: 0, to: 1, duration: 2000,
            onUpdate: (t) => {
                const v = t.getValue();
                this.bypassArrow.clear().lineStyle(4, 0xffff00, 1);
                // 10'dan 20'ye kavisli veya düz bir bypass oku
                this.bypassArrow.lineBetween(this.node10.x, this.node10.y + 30,
                    this.node10.x + (this.node20.x - this.node10.x) * v,
                    this.node10.y + 30 + (this.node20.y - this.node10.y - 60) * v);
            }
        });
        await this.wait(2500);

        // ADIM 3: 15'in Bellekten Silinişi
        guide.setText("15 düğümü artık zincirde değil. Bellek temizleyici (GC) onu silecek.");
        this.tweens.add({ targets: [this.node15, this.arrow15to20], alpha: 0, scale: 0.5, duration: 1000 });
        this.cameras.main.flash(600, 255, 255, 0);

        await this.wait(4000);
        this.finishChapter();
    }

    wait(ms) { return new Promise(r => this.time.delayedCall(ms, r)); }
    finishChapter() {
        this.scene.launch('SuccessScene', { nextScene: 'LevelSelect', currentScene: 'LinkedListDeleteANI' });
    }
}