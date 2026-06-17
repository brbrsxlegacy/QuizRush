# QuizRush AI MAX

Kahoot benzeri canlı quiz sistemi.

## Özellikler

- Firebase Realtime Database
- Öğretmen paneli
- Öğrenci oda kodu ile katılım
- Canlı oyun ekranı
- Skor tablosu
- Groq AI ile otomatik soru üretme
- Aydınlık / karanlık mod
- Manuel soru ekleme
- Solo mod
- Mobil uyumlu modern tasarım
- Karakter / kıyafet seçme sistemi
- Efektli podium skor tablosu
- Doğru/yanlış cevap animasyonları

## Kurulum

1. ZIP'i çıkar.
2. Terminali klasörde aç.
3. Paketleri kur:

```bash
npm install
```

4. `.env.example` dosyasını `.env` diye kopyala.
5. Groq key ekle:

```env
GROQ_API_KEY=senin_groq_keyin
PORT=3000
```

6. Başlat:

```bash
npm start
```

7. Tarayıcıdan aç:

```txt
http://localhost:3000
```

## Groq modeli

Bu sürüm `llama-3.3-70b-versatile` kullanır. Quiz üretme için hızlı ve güçlüdür.

## Firebase

Firebase config dosyası `public/firebase.js` içinde hazırdır.
Realtime Database açık olmalı.

Test için geçici database rules:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Gerçek yayında bu kurallar güvenli değildir.


## Mobil sürüm

Mobil arayüz aynı Firebase veritabanını kullanır. Yani webde açılan odaya mobil öğrenci girebilir, mobilde açılan odaya web öğrenci girebilir.

Mobil giriş:

```txt
http://localhost:3000/mobile/index.html
```

Telefonla aynı Wi‑Fi'da test etmek için bilgisayarın yerel IP adresini kullan:

```txt
http://BILGISAYAR_IP:3000/mobile/index.html
```

Örnek:

```txt
http://192.168.1.25:3000/mobile/index.html
```
