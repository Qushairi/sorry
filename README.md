# 💌 Website Permintaan Maaf Interaktif Untuk Nahdya

Website permohonan maaf romantis, kreatif, dan interaktif yang dirancang khusus untuk meluluhkan hati pacar tercinta (**Nahdya**).

---

## ✨ Fitur-Fitur Spesial

1. **💌 Scene Amplop 3D Realistis**:
   - Dilengkapi segel lilin (*wax seal*) berdenyut detak jantung (*heartbeat*).
   - Efek animasi membuka flap amplop dan surat mengintip keluar.
2. **📜 Surat Permintaan Maaf Tulus**:
   - Efek mesin ketik (*typewriter*) yang mengalir kata demi kata dengan hangat.
   - Tombol "Tampilkan Semua ⚡" jika ingin langsung membaca keseluruhan surat.
3. **🎭 Maskot Imut Reaktif**:
   - Avatar beruang chibi yang sedih dan menangis saat belum dimaafkan.
   - Berubah menjadi gembira dan melompat senang saat tombol "Iya" ditekan!
4. **💖 Kartu Memori Interaktif (Flip Cards)**:
   - 3 kartu cantik yang bisa diketuk/dibalik untuk membaca alasan kenapa dia begitu berarti.
5. **🎮 Game Tombol Keputusan (Viral Runaway Button)**:
   - Tombol **"Iya, Aku Maafin! ❤️"**: Setiap kali pacar mencoba mengklik "Enggak", tombol "Iya" akan otomatis membesar dan semakin menggoda untuk diklik.
   - Tombol **"Enggak Mau! 😤"**: Otomatis kabur / berteleportasi saat didekati mouse (laptop) atau disentuh jari (HP), disertai kalimat-kalimat bujuk rayu lucu yang berganti-ganti.
6. **🎉 Pesta Konfeti & Hadiah Damai**:
   - Ledakan konfeti warna-warni & hati di layar.
   - **Buket Bunga Virtual**: Bisa memetik mawar satu per satu hingga membentuk buket penuh.
   - **4 Kupon Permintaan Maaf (Love Vouchers)**: Kupon traktir makanan sepuasnya, bebas ngambek seharian, pelukan 24 jam, dan jalan-jalan, lengkap dengan animasi stempel `TERKLAIM ✨`.
   - **Tombol WhatsApp Instan**: Satu klik langsung mengarahkan ke chat WhatsApp dengan kalimat manis.
7. **🎵 Musik & Sound Effects**:
   - Menggunakan Web Audio API asli (tanpa risiko gagal load / file hilang). Ada efek lonceng amplop, bunyi tombol kabur, melodi lofi romantis yang menenangkan, dan fanfare perayaan.

---

## 🚀 Cara Membuka & Menjalankan

### Cara 1: Buka Langsung di Laptop / Komputer
1. Buka folder `D:\Nahdya\Sorry` di File Explorer.
2. Klik dua kali file **`index.html`**. File akan langsung terbuka di browser Anda (Google Chrome / Microsoft Edge / Firefox).

### Cara 2: Kirim Link ke Pacar (Online Gratis)
Agar pacar bisa membukanya langsung lewat link di HP (seperti buka link Instagram/TikTok):
1. Buka [Netlify Drop](https://app.netlify.com/drop) atau [Vercel](https://vercel.com).
2. Seret (*drag & drop*) folder `D:\Nahdya\Sorry` ke halaman tersebut.
3. Anda akan langsung mendapatkan link gratis (contoh: `https://untuk-nahdya.netlify.app`) yang bisa dikirimkan lewat chat WhatsApp!

---

## ⚙️ Cara Mengubah Pengaturan (Kustomisasi)

Buka file **`app.js`**, pada baris paling atas terdapat konfigurasi:

```javascript
const CONFIG = {
  recipientName: "Nahdya", // Ganti nama jika ingin panggilan sayang khusus
  senderName: "Aku",
  whatsappNumber: "6281234567890", // Masukkan nomor WhatsApp Anda (awali dengan 62)
  ...
};
```
- Masukkan nomor WhatsApp Anda pada `whatsappNumber` agar ketika dia menekan tombol chat di akhir, pesannya langsung masuk ke nomor Anda.
