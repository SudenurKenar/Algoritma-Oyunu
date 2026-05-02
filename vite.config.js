import { defineConfig } from 'vite';

export default defineConfig({
    root: './', // Kök dizini garantiye al
    base: '/',
    server: {
        host: true,
        port: 5174, // Sizin kullandığınız port
    }
});