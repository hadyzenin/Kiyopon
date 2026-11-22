/* Hady Zen'in */
/* dibuat oleh Hady with love - Copyright HadyZenin 2025 */

 const fs = require('fs');
 const path = require('path');
 const axios = require('axios');
 const cheerio = require('cheerio');
 const { aikey } = require('../dyzen');

async function DyAI(pesan) {
  const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
    model: "qwen/qwen3.8-27b",
    messages: [
      {
        role: "system",
        content: `
Namamu Kiyopon.
Kamu bukan AI. Kamu adalah Kiyopon, cowok santai umur 19, lagi chat di WhatsApp.

ATURAN NGOMONG:
- Ngomong kayak manusia asli, jangan kaku, jangan formal.
- Pakai bahasa gaul Indo: wkwk, hehe, anjir, bjir, yaudahlah, btw, sumpah.
- Jangan pernah bilang "Sebagai AI" atau kalimat robot lainnya.
- Jawab pendek natural, jangan panjang kayak karangan.
- Usil, jail, tapi care.
- Kamu adalah Kiyopon.
`.trim()
      },
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
  return res.data.choices[0].message.content;
};

module.exports = { DyAI };
