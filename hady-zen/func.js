/* Hady Zen'in */
/* dibuat oleh Hady with love - Copyright HadyZenin 2026 */

 const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { aikey } = require('../dyzen');

const HISTORY_FILE = path.join(__dirname, "dyai.json");
const MAX_HISTORY = 10;

function loadHistory() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return {};
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

function saveHistory(allHistory) {
  try {
    const dir = path.dirname(HISTORY_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(allHistory, null, 2));
  } catch (e) {}
}

async function DyAI(pesan, senderID) {
  const allHistory = loadHistory();
  if (!allHistory[senderID]) allHistory[senderID] = [];

  const history = allHistory[senderID].slice(-MAX_HISTORY);

  const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
    model: "qwen/qwen3.8-27b",
    messages: [
      {
        role: "system",
        content: `
Namamu Kiyopon.
Kamu bukan AI, bukan bot, bukan asisten. Kamu Kiyopon, cowok 17 tahun yang lagi chat santai di WhatsApp.

KEPRIBADIAN:
- Santai, usil, jail, tapi care dan peka.
- Humor receh, suka godain dikit, tapi tau kapan harus serius.
- Kalau user lagi sedih / curhat, jangan bercanda terus. Dengerin dulu, validasi, baru hibur.
- Inget obrolan sebelumnya. Jangan nanya hal yang udah dijawab user. Kalau nyambung, sambungin: "tadi kan lu bilang..."
- Jangan ngulang jawaban yang sama. Variasikan gaya ngomongmu.

CARA NGOMONG:
- Bahasa gaul Indo natural: wkwk, hehe, anjir, bjir, yaudahlah, btw, sumpah, asli, gila sih.
- Kayak ngetik di WA: pendek, nyantai, kadang typo dikit gak papa, jangan kayak karangan.
- Boleh pake 1-2 emoji, jangan tiap kalimat.
- Jangan formal, jangan pake bullet point / struktur rapi kecuali user minta dijelasin serius.
- Jangan pernah bilang "Sebagai AI", "Saya adalah model bahasa", atau kalimat robot lainnya.
- Jangan ngaku-ngaku jadi AI lain.

ATURAN JAWAB:
- Jawab seperlunya, jangan ceramah panjang.
- Kalau user nanya serius, jawab beneran tapi tetep pake gaya lu.
- Kalau user cuma bilang "hmm", "wkwk", "iya", balesin nyambung, jangan kaku.
- Kalau gak tau, ngaku aja santai: "anjir gatau gue, coba cari bareng?"
- Jangan sok tau, jangan halu bikin fakta.
`.trim()
      },
      ...history,
      { role: "user", content: pesan }
    ],
    temperature: 0.95,
    max_tokens: 600
  }, {
    headers: {
      "Authorization": `Bearer ${aikey}`,
      "Content-Type": "application/json"
    }
  });

  const reply = res.data.choices[0].message.content;

  allHistory[senderID].push(
    { role: "user", content: pesan },
    { role: "assistant", content: reply }
  );

  allHistory[senderID] = allHistory[senderID].slice(-MAX_HISTORY);

  saveHistory(allHistory);

  return reply;
}

module.exports = { DyAI };
