import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class LinkedListNodeANI extends Phaser.Scene {
    constructor() {
        super('LinkedListNodeANI');
    }

    create() {
        const { width, height } = this.scale;

        // Arka Plan
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1);

        // Başlık
        this.add.text(width / 2, height * 0.06, "DÜĞÜM (NODE) ANATOMİSİ", {
            fontSize: '22px', fontFamily: Theme.fontFamily, color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        // 1. KOD PANELİ (Sol Taraf - Güvenli Alan)
        const codeLines = [
            "class Node {",
            "  constructor(data) {",
            "    this.data = data;",
            "    this.next = null;",
            "  }",
            "}"
        ];

        this.codeBg = this.add.rectangle(width * 0.25, height * 0.45, width * 0.45, 200, 0x000000, 0.5)
            .setStrokeStyle(2, 0x00ffcc).setAlpha(0);

        this.codeDisp = this.add.text(width * 0.05, height * 0.35, codeLines.join("\n"), {
            fontSize: width < 450 ? '12px' : '14px',
            fontFamily: 'monospace',
            color: '#00ffcc',
            lineSpacing: 12
        }).setAlpha(0);

        // 2. GÖRSEL DÜĞÜM (Sağ Taraf - İyice Sağa İtildi)
        this.nodeVisual = this.add.container(width * 0.85, height * 0.45).setAlpha(0);
        const dBox = this.add.rectangle(-25, 0, 50, 65, Theme.surface).setStrokeStyle(3, 0x00ffcc);
        const nBox = this.add.rectangle(25, 0, 50, 65, Theme.surface).setStrokeStyle(3, 0x7b2cbf);
        const dVal = this.add.text(-25, 0, "42", { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
        const nVal = this.add.text(25, 0, "null", { fontSize: '11px', color: '#7b2cbf' }).setOrigin(0.5);
        this.nodeVisual.add([dBox, nBox, dVal, nVal]);

        // REHBER ANLATICI (Alt Kısım)
        this.guide = this.add.text(width / 2, height * 0.85, "", {
            fontSize: '14px', color: '#ffff00', backgroundColor: '#000000aa', padding: 10, align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5).setAlpha(0);

        this.startSequence();
    }

    async startSequence() {
        const { width, height } = this.scale;
        const lineH = 26; // Satır yüksekliği
        const startY = this.codeDisp.y + 64; // "this.data" satırının hizası

        // Adım 1: Giriş
        this.tweens.add({ targets: [this.codeBg, this.codeDisp], alpha: 1, duration: 1000 });
        await this.wait(1500);

        // Adım 2: Veri Kısmı (this.data)
        this.guide.setText("ADIM 1: 'data' değişkeni düğümün içindeki asıl veriyi tutar.").setAlpha(1);
        const h1 = this.add.rectangle(this.codeBg.x, startY, this.codeBg.width * 0.9, 24, 0xffff00, 0.2);
        this.tweens.add({ targets: this.nodeVisual, alpha: 1, duration: 800 });
        await this.wait(3000);
        h1.destroy();

        // Adım 3: Bağlantı Kısmı (this.next)
        this.guide.setText("ADIM 2: 'next' ise bir sonraki düğümün adresini tutar.\nYeni düğümler 'null' (hiçlik) ile başlar.");
        const h2 = this.add.rectangle(this.codeBg.x, startY + lineH, this.codeBg.width * 0.9, 24, 0x7b2cbf, 0.4);
        this.cameras.main.flash(600, 123, 44, 191);
        await this.wait(4000);

        this.finishChapter();
    }

    wait(ms) { return new Promise(r => this.time.delayedCall(ms, r)); }

    finishChapter() {
        this.scene.launch('SuccessScene', {
            nextScene: 'LinkedListLinkPart',
            currentScene: 'LinkedListNodeANI'
        });
    }
}