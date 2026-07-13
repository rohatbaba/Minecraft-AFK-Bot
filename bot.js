const mineflayer = require('mineflayer');
const express = require('express');

// 1. RENDER İÇİN WEB SUNUCUSU (UptimeRobot ile botun uyumasını engeller)
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("made by rokibaba - Bot 7/24 Aktif!");
});

app.listen(PORT, () => {
    console.log(`Web sunucusu ${PORT} portunda çalışıyor.`);
});

// 2. MINECRAFT BOT AYARLARI
const botAyarlari = {
    host: '163.5.201.2',
    port: 12722,
    username: 'nuekkis_bot' // Botun oyundan atılmaması için sabit adı
};

const botSifresi = "rokibaba"; // Şifren

let bot;

function botuBaslat() {
    bot = mineflayer.createBot(botAyarlari);

    // Bot sunucuya ilk adımı attığında
    bot.on('spawn', () => {
        console.log("made by rokibaba - Bot başarıyla giriş yaptı!");
        
        // Zıplama döngüsü (Her 3 saniyede bir zıplar)
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => {
                    if (bot && bot.entity) bot.setControlState('jump', false);
                }, 500);
            }
        }, 3000);
    });

    // Otomatik Giriş ve Kayıt Sistemi
    bot.on('message', (jsonMsg) => {
        const mesaj = jsonMsg.toString();

        // Eğer sunucu kayıt olmanı istiyorsa (İki şifreli sistem için düzeltildi)
        if (mesaj.includes('/register') || mesaj.includes('kayıt ol') || mesaj.includes('/kayit')) {
            setTimeout(() => {
                // Şifreyi iki defa gönderir ve tırnak hatası içermez:
                bot.chat(`/register ${botSifresi} ${botSifresi}`); 
                console.log("Otomatik çift şifreli kayıt işlemi yapıldı!");
            }, 1500);
        }

        // Eğer sunucu giriş yapmanı istiyorsa
        if (mesaj.includes('/login') || mesaj.includes('giriş yap')) {
            setTimeout(() => {
                bot.chat(`/login ${botSifresi}`);
                console.log("Otomatik giriş işlemi yapıldı!");
            }, 1500);
        }
    });

    // Hata oluşursa botun tamamen çökmesini engelle
    bot.on('error', (err) => {
        console.log(`Bot hatası: ${err.message}`);
    });

    // Bot sunucudan düşerse 10 saniye sonra otomatik geri bağlanır
    bot.on('end', () => {
        console.log("Bot sunucudan düştü, 10 saniye sonra tekrar bağlanıyor...");
        setTimeout(() => {
            botuBaslat();
        }, 10000);
    });
}

// Botu ilk kez çalıştır
botuBaslat();
