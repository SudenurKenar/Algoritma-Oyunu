import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class LinkedListLinkANI extends Phaser.Scene {
    constructor() {
        super('LinkedListLinkANI');
    }

    create() {
        const { width, height } = this.scale;

        // Arka Plan
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1);

        // 1. KOD PANELİ (Sol Taraf)
        const panelWidth = width * 0.45;
        this.codeBg = this.add.rectangle(width * 0.25, height * 0.45, panelWidth, 240, 0x000000, 0.8)
            .setStrokeStyle(2, 0x00ffcc).setAlpha(0);

        // Satır satır diziyoruz ki koordinatları tam bilelim
        this.codeLines = [
            "const n1 = new Node(10);",
            "const n2 = new Node(20);",
            "",
            "n1.next = n2;"
        ];

        // Yazıyı render et
        this.codeDisp = this.add.text(width * 0.05, height * 0.35, this.codeLines.join("\n"), {
            fontSize: width < 450 ? '12px' : '15px',
            fontFamily: 'monospace',
            color: '#00ffcc',
            lineSpacing: 18 // Satır aralığını genişlettik ki vurgular rahat sığsın
        }).setAlpha(0);

        // 2. GÖRSEL DÜĞÜMLER (Sağ Taraf)
        this.node1 = this.createNodeVisual(width * 0.82, height * 0.32, "10");
        this.node2 = this.createNodeVisual(width * 0.82, height * 0.62, "20");
        this.node1.setAlpha(0);
        this.node2.setAlpha(0);

        this.arrowGraphics = this.add.graphics();
        this.startSequence();
    }

    createNodeVisual(x, y, data) {
        const container = this.add.container(x, y);
        const dBox = this.add.rectangle(-25, 0, 50, 65, Theme.surface).setStrokeStyle(2, 0x00ffcc);
        const nBox = this.add.rectangle(25, 0, 50, 65, Theme.surface).setStrokeStyle(2, 0x7b2cbf);
        const dVal = this.add.text(-25, 0, data, { fontSize: '16px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        const nVal = this.add.text(25, 0, "null", { fontSize: '12px', color: '#7b2cbf' }).setOrigin(0.5);
        container.add([dBox, nBox, dVal, nVal]);
        container.nVal = nVal;
        return container;
    }

    async startSequence() {
        const { width, height } = this.scale;
        const startY = this.codeDisp.y + 10; // İlk satırın tahmini başlangıcı
        const stepY = 32; // Her satırın aşağı kayma miktarı (lineSpacing + fontSize)

        this.tweens.add({ targets: [this.codeBg, this.codeDisp], alpha: 1, duration: 800 });
        await this.wait(1000);

        // Rehber Metni
        const guide = this.add.text(width / 2, height * 0.88, "", {
            fontSize: '14px', color: '#ffff00', backgroundColor: '#000000cc', padding: 8, align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5).setAlpha(0);

        // --- ADIM 1: n1 Oluşturma ---
        guide.setText("n1 düğümü belleğe yerleştiriliyor...").setAlpha(1);
        const h1 = this.add.rectangle(this.codeBg.x, startY, this.codeBg.width * 0.95, 28, 0xffff00, 0.2);
        this.tweens.add({ targets: this.node1, alpha: 1, duration: 800 });
        await this.wait(2500);
        h1.destroy();

        // --- ADIM 2: n2 Oluşturma ---
        guide.setText("n2 düğümü belleğe yerleştiriliyor...");
        // startY + stepY diyerek tam 2. satıra iniyoruz
        const h2 = this.add.rectangle(this.codeBg.x, startY + stepY, this.codeBg.width * 0.95, 28, 0xffff00, 0.2);
        this.tweens.add({ targets: this.node2, alpha: 1, duration: 800 });
        await this.wait(2500);
        h2.destroy();

        // --- ADIM 3: BAĞLANTI (KRİTİK AN) ---
        guide.setText("Büyü gerçekleşiyor: n1'in kancası n2'ye bağlanıyor!");
        // startY + (stepY * 3) diyerek 4. satıra (bağlantı satırı) iniyoruz
        const h3 = this.add.rectangle(this.codeBg.x, startY + (stepY * 3), this.codeBg.width * 0.95, 28, 0x00ffcc, 0.4);

        this.tweens.add({
            targets: this.node1.nVal, alpha: 0, duration: 400, onComplete: () => {
                this.node1.nVal.setText("ADDR").setColor("#00ffcc").setAlpha(1);
            }
        });

        this.tweens.addCounter({
            from: 0, to: 1, duration: 2500,
            onUpdate: (t) => {
                const v = t.getValue();
                this.arrowGraphics.clear();
                this.arrowGraphics.lineStyle(4, 0x00ffcc, 1);
                this.arrowGraphics.lineBetween(this.node1.x + 25, this.node1.y,
                    this.node1.x + 25 + (this.node2.x - this.node1.x - 25) * v,
                    this.node1.y + (this.node2.y - this.node1.y - 35) * v
                );
            }
        });

        await this.wait(4000);
        this.finishChapter();
    }

    wait(ms) { return new Promise(r => this.time.delayedCall(ms, r)); }
    finishChapter() {
        this.scene.launch('SuccessScene', { nextScene: 'LinkedListInsertPart', currentScene: 'LinkedListLinkANI' });
    }
}