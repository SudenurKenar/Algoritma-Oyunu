import Phaser from 'phaser';
import { Theme } from '../../core/theme.js';

export class LinkedListNodeANI extends Phaser.Scene {
    constructor() {
        super('LinkedListNodeANI');
    }

    create() {
        const { width, height } = this.scale;

        // Arka Plan (Siyahsız, derin mor nizam)
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x240046, 0.2, 0x7b2cbf, 0.1);

        // Başlık - En tepede güvenli alanda
        this.add.text(width / 2, height * 0.08, "DÜĞÜM MANTIK ŞEMASI", {
            fontSize: '24px', fontFamily: Theme.fontFamily, color: '#ffffff', fontStyle: 'bold',
            stroke: Theme.accent, strokeThickness: 4
        }).setOrigin(0.5);

        // 1. KOD BLOĞU (Ekranın Soluna Tam Yaslı)
        const codeText = `class Node {\n  constructor(data) {\n    this.data = data;\n    this.next = null;\n  }\n}`;

        // Arka planı ekranın sol %25'ine çekiyoruz
        this.codeBg = this.add.rectangle(width * 0.28, height * 0.45, width * 0.48, 200, 0x000000, 0.4)
            .setStrokeStyle(2, 0x00ffcc).setAlpha(0);

        this.codeDisp = this.add.text(width * 0.05, height * 0.35, codeText, {
            fontSize: width < 450 ? '13px' : '15px', // Dar ekranlarda fontu küçült
            fontFamily: 'monospace',
            color: '#00ffcc',
            lineSpacing: 10
        }).setAlpha(0);

        // 2. GÖRSEL NODE (Ekranın En Sağına Tam Yaslı)
        // Kod bloğuyla çakışmaması için 0.82 noktasına ittik
        this.nodeVisual = this.add.container(width * 0.82, height * 0.45).setAlpha(0);

        const dBox = this.add.rectangle(-30, 0, 60, 75, Theme.surface).setStrokeStyle(3, 0x00ffcc);
        const nBox = this.add.rectangle(30, 0, 60, 75, Theme.surface).setStrokeStyle(3, 0x7b2cbf);

        const dVal = this.add.text(-30, 0, "42", { fontSize: '18px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        const nVal = this.add.text(30, 0, "null", { fontSize: '12px', color: '#7b2cbf', fontStyle: 'bold' }).setOrigin(0.5);

        this.nodeVisual.add([dBox, nBox, dVal, nVal]);

        // 3. VURGU DİKDÖRTGENLERİ (Önceden oluşturup saklıyoruz)
        this.h1 = this.add.rectangle(this.codeBg.x, height * 0.435, this.codeBg.width * 0.95, 22, 0xffff00, 0.2).setAlpha(0);
        this.h2 = this.add.rectangle(this.codeBg.x, height * 0.485, this.codeBg.width * 0.95, 22, 0x7b2cbf, 0.4).setAlpha(0);

        this.startSequence();
    }

    async startSequence() {
        const { width, height } = this.scale;

        // Adım 1: Kod bloğu belirir
        this.tweens.add({ targets: [this.codeBg, this.codeDisp], alpha: 1, duration: 1500 });
        await this.wait(2500);

        // Adım 2: "this.data = data" vurgusu ve Node süzülüşü
        this.tweens.add({ targets: this.h1, alpha: 1, duration: 800 });
        this.tweens.add({ targets: this.nodeVisual, alpha: 1, x: '-=20', duration: 1500 });
        await this.wait(3000);
        this.h1.setAlpha(0);

        // Adım 3: "this.next = null" vurgusu
        this.tweens.add({ targets: this.h2, alpha: 1, duration: 800 });
        this.cameras.main.flash(1000, 123, 44, 191);
        await this.wait(3000);
        this.h2.setAlpha(0);

        // Adım 4: Bilgi Metni (En altta ve genişliği sınırlı)
        const info = this.add.text(width / 2, height * 0.85, "Her Node, bir veri ve bir 'hiçlik' (null) ile doğar.", {
            fontSize: '14px', color: '#e0aaff', backgroundColor: '#00000088', padding: { x: 12, y: 8 },
            align: 'center', wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: info, alpha: 1, duration: 1000 });

        await this.wait(4500);
        this.finishChapter();
    }

    finishChapter() {
        this.scene.launch('SuccessScene', {
            nextScene: 'LinkedListLinkPart',
            currentScene: 'LinkedListNodeANI'
        });
    }

    wait(ms) { return new Promise(resolve => this.time.delayedCall(ms, resolve)); }
}