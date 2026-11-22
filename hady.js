/* Hady Zen'in - WhatsApp Version */
/* dibuat oleh Hady with love - Copyright HadyZenin 2026 */

const express = require('express');
const app = express();
const { logo, ayanokoji } = require('./hady-zen/log');
const fs = require('fs');
const path = require('path');
const { DyAI } = require('./hady-zen/func');
const { version } = require('./package');
const gradient = require('gradient-string');
const { awalan, nama, admin, warna, maintain, chatdm, imgbbkey, setting, zonawaktu, nomorBot } = require('./dyzen');
const sharp = require('sharp');
const readline = require('readline');
const pino = require('pino');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);
const { kuldown } = require('./hady-zen/kuldown');
const moment = require('moment-timezone');
const now = moment.tz(zonawaktu);
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, downloadContentFromMessage } = require("@whiskeysockets/baileys");

const kiyopon = logo.ayanokoji;
const tanggal = now.format('YYYY-MM-DD');
const waktu = now.format('HH:mm:ss');
global.Ayanokoji = { awalan: awalan, nama: nama, warna: warna, admin: admin, logo: logo, imgbbkey: imgbbkey, maintain: maintain, waktu: waktu, tanggal: tanggal };

//DATA AYANOKOJI
let data = {};
if (fs.existsSync(path.join('hady-zen', 'kiyopon.db'))) {
    data = JSON.parse(fs.readFileSync(path.join('hady-zen', 'kiyopon.db'), 'utf-8'));
}

function addData(id) {
    if (data[id]) {
    } else {
        data[id] = { "nama": "Kiyopon", "yen": 0, "exp": 0, "level": 1, "chat": 0, "pp": "", "bg": "", "title": "Dark Sistem", "flag": "id", "daily": null };
        console.log(ayanokoji('database') + `${id} pengguna baru.`);
    }
    simpan();
};

function setUser(id, item, value) {
  if (!data[id]) return;
  const stringItem = ["nama", "pp", "bg", "title", "flag", "daily"];
  const numberItem = ["yen", "exp", "level", "chat"];
  if (stringItem.includes(item)) {
    data[id][item] = value;
  } else if (numberItem.includes(item)) {
    if (typeof value !== "number") {
      return console.log(ayanokoji("database") + `${item} harus berupa angka.`);
    }
    data[id][item] = value;
  } else {
    return console.log(ayanokoji("database") + `Item "${item}" tidak ditemukan.`);
  }
  simpan();
  console.log(ayanokoji("database") + `${item} berhasil diperbarui.`);
}

function getData(id) {
  return data[id] || data;
};

function simpan() {
    fs.writeFile(path.join('hady-zen', 'kiyopon.db'), JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.log(logo.error + "Terjadi kesalahan pada db: ", err);
        }
    });
};

//LOG AYANOKOJI
console.log(kiyopon);
console.log(logo.info + `Versi ${version}`);
console.log(logo.info + `Awalan ${awalan}`);
console.log(logo.info + `Admin ${admin}`);
fs.readdir('./perintah', (err, files) => {
 const shadow = files.map(file => path.parse(file).name);
 console.log(ayanokoji('perintah') + `${shadow}.`);
});

let isReconnecting = false;
let pairingDone = false;
const silentLogger = { level: 'silent', info:()=>{}, error:()=>{}, warn:()=>{}, debug:()=>{}, trace:()=>{}, fatal:()=>{}, child:()=>silentLogger };

// LOGIN AYANOKOJI 
async function hadyBot() {
    if (isReconnecting) return;
    isReconnecting = true;
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState('./hady-zen/sessi');

    const sock = makeWASocket({
        version,
        printQRInTerminal: false,
        auth: state,
        logger: silentLogger,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        syncFullHistory: false,
        shouldSyncHistoryMessages: false,
        keepAliveIntervalMs: 30000,
        connectTimeoutMs: 60000,
    });
    sock.ev.on('creds.update', saveCreds);
    if (!sock.authState.creds.registered && !pairingDone) {
        pairingDone = true;
        await new Promise(r => setTimeout(r, 2000));
        try {
            let code = await sock.requestPairingCode(nomorBot.replace(/[^0-9]/g, ''));
            code = code?.match(/.{1,4}/g)?.join('-');
            console.log(logo.proses + `Kode Pairing: ${code}`);
            console.log(logo.info + `Host tidak akan mati, santai masukin kodenya...`);
        } catch (e) {
            console.log(logo.error + 'Gagal meminta kode: ', e.message);
            pairingDone = false;
        }
    }

// API AYANOKOJI 
let event_global = null;
const api = {
    sendMessage: async (teks, threadID, messageID) => {
        const quotedMsg = event_global && event_global.messageID === messageID ? event_global : null;
        const options = {};
        if (quotedMsg) options.quoted = { key: quotedMsg.key, message: quotedMsg.message };
        if (typeof teks === 'object') return await sock.sendMessage(threadID, teks, options);
        return await sock.sendMessage(threadID, { text: teks }, options);
    },
    sendImage: async (bufferOrPath, caption, threadID, messageID) => {
    if (typeof caption === 'string' && (caption.endsWith('@s.whatsapp.net') || caption.endsWith('@g.us') || caption.endsWith('@lid'))) {
        messageID = threadID;
        threadID = caption;
        caption = "";
    }
    if (typeof caption !== 'string') {
        caption = "";
    }
    let quoted = undefined;
    if (threadID && !threadID.endsWith('@lid') && event_global && event_global.messageID === messageID) {
        quoted = { key: event_global.key, message: event_global.message };
    }
    let data = bufferOrPath;
    if (typeof bufferOrPath === 'string' && bufferOrPath.startsWith('http')) {
        const res = await fetch(bufferOrPath);
        data = Buffer.from(await res.arrayBuffer());
    }
    const content = { image: data };
    if (caption && caption.trim() !== "") {
        content.caption = caption;
    }
    return await sock.sendMessage(threadID, content, { quoted });
},
sendVideo: async (bufferOrPath, caption, threadID, messageID) => {
    if (typeof caption === 'string' && (caption.endsWith('@s.whatsapp.net') || caption.endsWith('@g.us') || caption.endsWith('@lid'))) {
        messageID = threadID;
        threadID = caption;
        caption = "";
    }
    if (typeof caption !== 'string') caption = "";
    let quoted = undefined;
    if (threadID && !threadID.endsWith('@lid') && event_global && event_global.messageID === messageID) {
        quoted = { key: event_global.key, message: event_global.message };
    }
    let data = bufferOrPath;
    if (typeof bufferOrPath === 'string' && bufferOrPath.startsWith('http')) {
        const res = await fetch(bufferOrPath);
        data = Buffer.from(await res.arrayBuffer());
    }
    const content = { video: data };
    if (caption && caption.trim() !== "") content.caption = caption;
    return await sock.sendMessage(threadID, content, { quoted });
},
    sendAudio: async (bufferOrPath, threadID, messageID, ptt = false) => {
        const quoted = event_global && event_global.messageID === messageID ? { key: event_global.key, message: event_global.message } : undefined;
        let data = bufferOrPath;
        if (typeof bufferOrPath === 'string' && bufferOrPath.startsWith('http')) {
            const res = await fetch(bufferOrPath);
            data = Buffer.from(await res.arrayBuffer());
        }
        return await sock.sendMessage(threadID, { audio: data, mimetype: 'audio/mp4', ptt: ptt }, { quoted });
    },
    sendDocument: async (bufferOrPath, fileName, mimetype, threadID, messageID) => {
        const quoted = event_global && event_global.messageID === messageID ? { key: event_global.key, message: event_global.message } : undefined;
        let data = bufferOrPath;
        if (typeof bufferOrPath === 'string' && bufferOrPath.startsWith('http')) {
            const res = await fetch(bufferOrPath);
            data = Buffer.from(await res.arrayBuffer());
        }
        return await sock.sendMessage(threadID, { document: data, fileName: fileName || "file", mimetype: mimetype || "application/pdf" }, { quoted });
    },
sendSticker: async (bufferOrPath, threadID, messageID, isVideo = false) => {
    const quoted = event_global && event_global.messageID === messageID ? { key: event_global.key, message: event_global.message } : undefined;
    let stickerBuffer = bufferOrPath;
    try {
        if (typeof bufferOrPath === 'string' && bufferOrPath.startsWith('http')) {
            const res = await fetch(bufferOrPath);
            stickerBuffer = Buffer.from(await res.arrayBuffer());
        }
        if (isVideo) {
            const inputPath = `./temp_${Date.now()}.mp4`;
            const outputPath = `./temp_${Date.now()}.webp`;
            fs.writeFileSync(inputPath, stickerBuffer);
            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .outputOptions([
                        '-vcodec', 'libwebp',
                        '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse',
                        '-loop', '0',
                        '-preset', 'default',
                        '-an',
                        '-vsync', '0',
                        '-t', '6'
                    ])
                    .toFormat('webp')
                    .save(outputPath)
                    .on('end', resolve)
                    .on('error', reject);
            });
            stickerBuffer = fs.readFileSync(outputPath);
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        } else {
            stickerBuffer = await sharp(stickerBuffer)
                .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .webp()
                .toBuffer();
        }
    } catch (e) { console.log(logo.error + "Gagal convert stiker: ", e.message); }
    return await sock.sendMessage(threadID, { sticker: stickerBuffer }, { quoted });
},
    getThreadInfo: async (threadID) => {
        try {
            if (threadID.endsWith('@g.us')) {
                const meta = await sock.groupMetadata(threadID);
                return { adminIDs: meta.participants.filter(p => p.admin).map(p => ({ id: p.id })) };
            }
        } catch (e) {}
        return { adminIDs: [] };
    },
    setMessageReaction: async (emoji, messageID) => {
        try { if (event_global) await sock.sendMessage(event_global.threadID, { react: { text: emoji, key: event_global.key } }); } catch (e) {}
    }
};

async function downloadMedia(msg) {
    try {
        const type = Object.keys(msg.message)[0];
        const content = msg.message[type];
        const stream = await downloadContentFromMessage(content, type.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        return { buffer, type, mimetype: content.mimetype };
    } catch (e) { return null; }
} 

 //LOGIN AYANOKOJI 
    sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
        if (connection === "open") {
            console.log(logo.sukses + nama + ' berhasil terhubung!');
            isReconnecting = false;
            pairingDone = false;
        }
        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (!sock.authState.creds.registered) {
                console.log(logo.proses + 'Lagi nunggu pairing, host tetap jalan...');
                isReconnecting = false;
                return;
            }
            if (reason !== DisconnectReason.loggedOut) {
                console.log(logo.info + "Reconnecting dalam 5 detik...");
                isReconnecting = false;
                setTimeout(() => startBot(), 5000);
            } else {
                console.log(logo.error + "Sesi expired, hapus folder sessi dan login ulang.");
                isReconnecting = false;
            }
        }
    });
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message) return;
        const isGroup = m.key.remoteJid.endsWith('@g.us');
        const isFromMe = m.key.fromMe;
        if (isFromMe && !isGroup) return;
        const msgType = Object.keys(m.message)[0];
        const msgContent = m.message[msgType];
        const body = m.message.conversation
            || m.message.extendedTextMessage?.text
            || msgContent?.caption
            || "";
        if (!body) return;
        if (isFromMe && isGroup) {
            if (!body.startsWith(awalan) && body.toLowerCase() !== "prefix" && !body.toLowerCase().startsWith(nama.toLowerCase())) return;
        }
        
 // EVENT AYANOKOJI     
      const event = {
            senderID: isFromMe ? sock.user.id : (m.key.participant || m.key.remoteJid),
            threadID: m.key.remoteJid,
            messageID: m.key.id,
            body: body,
            isGroup: isGroup,
            isFromMe: isFromMe,
            key: m.key,
            message: m.message
        };
        const contextInfo = msgContent?.contextInfo || m.message.extendedTextMessage?.contextInfo;
        const quotedMsg = contextInfo?.quotedMessage;
        const quotedParticipant = contextInfo?.participant;
        event.repliedText = quotedMsg?.conversation
            || quotedMsg?.extendedTextMessage?.text
            || quotedMsg?.imageMessage?.caption
            || quotedMsg?.videoMessage?.caption
            || "";
        event.repliedSender = quotedParticipant || null;
        event.repliedType = quotedMsg ? Object.keys(quotedMsg)[0] : null;
        event.isReply = !!quotedMsg;
        event.repliedMedia = null;
        if (quotedMsg && (event.repliedType.includes('image') || event.repliedType.includes('video') || event.repliedType.includes('sticker') || event.repliedType.includes('audio') || event.repliedType.includes('document'))) {
            const fakeMsg = { message: quotedMsg };
            event.repliedMedia = await downloadMedia(fakeMsg);
        }
        event.media = null;
        event.attachments = [];
        if (msgType.includes('image') || msgType.includes('video') || msgType.includes('sticker') || msgType.includes('audio') || msgType.includes('document')) {
            event.media = await downloadMedia(m);
            if (event.media) event.attachments.push(event.media);
        }
        event_global = event;
        
// YEN AND LV UP
        addData(event.senderID);
        data[event.senderID].chat++;
        if (data[event.senderID].chat % 10 === 0) {
            data[event.senderID].yen += 3;
            data[event.senderID].exp += 10;
            console.log(ayanokoji("yen") + `${data[event.senderID].nama} mendapatkan 3 Yen dan 10 Exp.`);
        }
        if (data[event.senderID].exp >= 100) {
            data[event.senderID].exp -= 100;
            data[event.senderID].level += 1;
            await api.sendMessage(`Selamat ${data[event.senderID].nama}, Kamu telah naik ke level ${data[event.senderID].level}!`, event.threadID);
            console.log(ayanokoji('level') + `${data[event.senderID].nama} naik level.`);
        }
        simpan();

// ONCHAT AYANOKOJI
const senderNum = event.senderID.split('@')[0].split(':')[0];
const senderFull = event.senderID;
const botNum = (sock.user.id || "").split('@')[0].split(':')[0];
const isAdmin = admin.includes(senderNum) 
  || admin.includes(senderFull) 
  || admin.includes(event.senderID.split('@')[0])
  || senderNum === botNum 
  || senderNum === nomorBot.replace(/[^0-9]/g, '');   
        if (global.Ayanokoji.maintain === true && !isAdmin || chatdm === false && event.isGroup == false && !isAdmin) return;
        addData(event.senderID);
        if (body.toLowerCase() == "prefix") return api.sendMessage(`Awalan ${nama} adalah: ${awalan}`, event.threadID, event.messageID);
        if (body.toLowerCase().startsWith(nama.toLowerCase())) {
            const ijo = body.slice(nama.length) || " hai";
            DyAI(ijo).then(jawaban => {
                return api.sendMessage(jawaban, event.threadID, event.messageID);
            }).catch(e => {
                console.log(e);
                return api.sendMessage("Error: " + e, event.threadID, event.messageID);
            });
        };
        if (!body.startsWith(awalan)) return console.log(logo.chat + `${event.senderID}: ${body}`);
        const cmd = body.slice(awalan.length).trim().split(/ +/g).shift().toLowerCase();
        
// CMDS AYANOKOJI
        async function hady_cmd(cmd, api, event) {
            const pipi = body?.replace(`${awalan}${cmd}`, "").trim();
            const args = pipi?.split(" ");
            const { saran } = require('./hady-zen/saran');
            try {
                const skibidi = await api.getThreadInfo(event.threadID);
                const fitri = skibidi.adminIDs.map(v => v.id);
                const fitriNums = fitri.map(id => id.split('@')[0]);
                const files = fs.readdirSync(path.join(__dirname, "perintah"));
                const listCmd = [];
                let ditemukan = false;
                for (const file of files) {
                    if (!file.endsWith(".js")) continue;
                    delete require.cache[require.resolve(path.join(__dirname, "perintah", file))];
                    const { hady, Ayanokoji } = require(path.join(__dirname, "perintah", file));
                    if (hady?.nama) listCmd.push(hady.nama);
                    if (!hady || hady.nama !== cmd || typeof Ayanokoji !== "function") continue;
                    ditemukan = true;
                    console.log(logo.info + `Menjalankan perintah ${hady.nama}.`);
                    if (kuldown(event.senderID, hady.nama, hady.kuldown) !== "hadi") {
                        return api.sendMessage("Sabar dong :v", event.threadID, event.messageID);
                    }
                    if (!hady.peran || hady.peran == 0) {
                        return await Ayanokoji({ api, event, args, setUser, getData });
                    }
                    if (hady.peran == 2 && isAdmin) {
                        return await Ayanokoji({ api, event, args, setUser, getData });
                    }
                    if (hady.peran == 1 && (fitri.includes(event.senderID) || fitriNums.includes(senderNum))) {
                        return await Ayanokoji({ api, event, args, setUser, getData });
                    }
                    return api.setMessageReaction("🚫", event.messageID);
                }
                if (!ditemukan) {
                    const mirip = saran(cmd, listCmd);
                    console.log(logo.info + `Tidak ada perintah ${cmd}.`);
                    return api.sendMessage(mirip ? `Mungkin maksud kamu ${awalan}${mirip}?` : `Perintah '${cmd}' tidak ada, gunakan ${awalan}menu buat lihat daftar perintah.`, event.threadID, event.messageID);
                }
            } catch (error) {
                console.log(logo.error + "Perintah error: " + error.message);
            }
        }
        hady_cmd(cmd, api, event);
    });
    isReconnecting = false;
}
hadyBot();

//WEBVIEW AYANOKOJI 
app.get('/', (req, res) => {
 res.sendFile(path.join(__dirname, 'hady-zen', 'kiyotaka', 'ayanokoji.html'));
});
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'hady-zen', 'kiyotaka', 'kiyotaka.html'));
});
app.listen(3000);

process.on('unhandledRejection', error => console.log(logo.error + error));
process.on('uncaughtException', error => console.log(logo.error + error));
