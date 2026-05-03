// src/data/levels.js
export const Levels = [
    {
        id: 1,
        title: "Dizilere Giriş",
        description: "Diziler verileri liste halinde tutar. Diziyi kapatmayı unutmuşuz!",
        code: "let sayilar = [10, 20, 30", // Eksik olan parça: "]"
        missing: "]",
        options: [")", "]", "}", ">"], // Çeldiriciler
        visualTarget: "array_visual" // Bölüm bitince açılacak olan simülasyonun ID'si
    },
    {
        id: 2,
        title: "Stack (Yığın) Mantığı",
        description: "Stack'e veri eklemek için hangi fonksiyonu kullanırız?",
        code: "yigin.______(yeniVeri);",
        missing: "push",
        options: ["add", "push", "insert", "append"],
        visualTarget: "stack_visual"
    }
];