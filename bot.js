const mineflayer = require('mineflayer');
const express = require('express');

// 1. RENDER İÇİN WEB SUNUCUSU
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Bot Aktif!");
});

app.listen(PORT, () => {
    console.log("Web sunucusu baslatildi.");
});

// 2. MINECRAFT BOT AYARLARI
const botAyarlari = {
    host: '163.5.201.2',
    port: 12722,
    username: 'nuekkis_bot'
};

let bot;

function botuBaslat() {
    bot = mineflayer.createBot(botAyarlari);

    bot.on('spawn', () => {
        console.log("Bot sunucuya girdi!");
        
        // Zıplama fonksiyonu
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => {
                    if (bot && bot.entity) bot.setControlState('jump', false);
                }, 500);
            }
        }, 3000);
    });

    // Otomatik Giris ve Kayit
    bot.on('message', (jsonMsg) => {
        const mesaj = jsonMsg.toString();

        // Kayit olma tetiklenirse (Düz yazı olarak iki kere şifre gönderir)
        if (mesaj.includes('/register') || mesaj.includes('kayit ol') || mesaj.includes('/kayit')) {
            setTimeout(() => {
                bot.chat("/register rokibaba rokibaba"); 
                console.log("Kayit olundu.");
            }, 1500);
        }

        // Giris yapma tetiklenirse
        if (mesaj.includes('/login') || mesaj.includes('giris yap')) {
            setTimeout(() => {
                bot.chat("/login rokibaba");
                console.log("Giris yapildi.");
            }, 1500);
        }
    });

    bot.on('error', (err) => {
        console.log("Hata olustu: " + err.message);
    });

    bot.on('end', () => {
        console.log("Bot dustu, 10 saniye sonra tekrar baglaniyor...");
        setTimeout(() => {
            botuBaslat();
        }, 10000);
    });
}

botuBaslat();
