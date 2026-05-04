import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class LinkedListInsertANI extends Phaser.Scene {
    constructor() {
        super('LinkedListInsertANI');
    }

    create() {
        const { width, height } = this.scale;

        // Arka Plan
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1);

        this.add.text(width / 2, height * 0.05, "ARAYA EKLEME: BELLEK ADIMLARI", {
            fontSize: '18px', fontFamily: Theme.fontFamily, color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        // 1. KOD BLOĞU (Sol Üst - Genişlik Sınırlandırıldı)
        const codeText = [
            "// Yeni düğümü oluştur",
            "const n15 = new Node(15);",
            "",
            "// 1. İleriye bağla",
            "n15.next = n10.next;",
            "",
            "// 2. n10'u n15'e bağla",
            "n10.next = n15;"
        ];

        // Panel ve Yazı (Yazı Boyutu Küçültüldü)
        this.codeBg = this.add.rectangle(width * 0.25, height * 0.42, width * 0.45, 260, 0x000000, 0.6)
            .setStrokeStyle(2, 0x00ffcc).setAlpha(0);

        this.codeDisp = this.add.text(width * 0.05, height * 0.25, codeText.join("\n"), {
            fontSize: width < 450 ? '11px' : '13px',
            fontFamily: 'monospace',
            color: '#00ffcc',
            lineSpacing: 12,
            wordWrap: { width: width * 0.4 }
        }).setAlpha(0);

        // 2. GÖRSEL DÜĞÜMLER (En Sağa Sabitlendi)
        this.node10 = this.createNodeVisual(width * 0.8, height * 0.22, "10", "ADDR20");
        this.node20 = this.createNodeVisual(width * 0.8, height * 0.62, "20", "null");
        this.node15 = this.createNodeVisual(width * 0.8, height * 0.42, "15", "null");
        this.node15.setAlpha(0);

        this.arrow10to20 = this.add.graphics();
        this.arrow15to20 = this.add.graphics().setAlpha(0);
        this.arrow10to15 = this.add.graphics().setAlpha(0);

        this.drawStaticArrow(this.arrow10to20, this.node10, this.node20);
        this.startInsertSequence();
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

    async startInsertSequence() {
        const { width, height } = this.scale;
        const lineH = 26; // Yazı ve LineSpacing toplamı
        const startY = this.codeDisp.y + 38; // 2. satır (n15 oluşumu)

        this.tweens.add({ targets: [this.codeBg, this.codeDisp], alpha: 1, duration: 800 });
        await this.wait(1500);

        const guide = this.add.text(width / 2, height * 0.88, "", {
            fontSize: '14px', color: '#ffff00', backgroundColor: '#000000cc', padding: 8, align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5).setAlpha(0);

        // ADIM 1: n15 Oluşur
        guide.setText("Yeni düğüm (15) bellekte oluşturuldu.").setAlpha(1);
        const h1 = this.add.rectangle(this.codeBg.x, startY, this.codeBg.width * 0.9, 24, 0xffff00, 0.2);
        this.tweens.add({ targets: this.node15, alpha: 1, duration: 1000 });
        await this.wait(2500);
        h1.destroy();

        // ADIM 2: n15.next = n10.next
        guide.setText("Yeni düğüm, 20'nin adresini alarak zinciri korur.");
        const h2 = this.add.rectangle(this.codeBg.x, startY + (lineH * 3), this.codeBg.width * 0.9, 24, 0xffff00, 0.2);
        this.node15.nVal.setText("ADDR20").setColor("#00ffcc");
        this.arrow15to20.setAlpha(1);
        this.drawStaticArrow(this.arrow15to20, this.node15, this.node20);
        await this.wait(3000);
        h2.destroy();

        // ADIM 3: n10.next = n15
        guide.setText("Son adım: 10 artık 15'i işaret ediyor. Zincir tamam!");
        const h3 = this.add.rectangle(this.codeBg.x, startY + (lineH * 6), this.codeBg.width * 0.9, 24, 0x00ffcc, 0.4);

        this.tweens.add({ targets: this.arrow10to20, alpha: 0, duration: 500 });
        this.node10.nVal.setText("ADDR15").setColor("#00ffcc");
        this.arrow10to15.setAlpha(1);
        this.drawStaticArrow(this.arrow10to15, this.node10, this.node15);
        this.cameras.main.flash(800, 0, 255, 204);

        await this.wait(4000);
        this.finishChapter();
    }

    wait(ms) { return new Promise(r => this.time.delayedCall(ms, r)); }
    finishChapter() {
        this.scene.launch('SuccessScene', { nextScene: 'LevelSelect', currentScene: 'LinkedListInsertANI' });
    }
}