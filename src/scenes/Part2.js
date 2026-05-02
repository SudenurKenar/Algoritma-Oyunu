// Visual.js içinde basit bir mantık
visualizeBubbleSort(array); {
    array.forEach((val, i) => {
        // Her veri elemanı için bir mor çubuk çiz
        let bar = this.add.rectangle(100 + (i * 30), 400, 20, val * 10, 0x9b59b6);
        bar.setOrigin(0, 1); // Çubukların aşağıdan yukarı uzanması için
    });
}