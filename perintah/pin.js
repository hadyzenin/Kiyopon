const sharp = require("sharp")

if (!global.pinSessions) global.pinSessions = new Map()

const CONFIG = {
  jumlahFoto: 12,
  durasiSesi: 60 * 1000,
  canvas: {
    width: 1080,
    height: 1080,
    pad: 12,
    header: 0,
    footer: 0,
    cols: 4,
    rows: 3
  },
  warnaBg: { r: 12, g: 12, b: 18 }
}

function bersihkanQuery(args) {
  return args.join(" ").replace(/^\.?\s*pin\s+/i, "").trim()
}

async function cariPinterest(query) {
  const sourceUrl = `/search/pins/?q=${encodeURIComponent(query)}&rs=typed`
  const data = {
    options: { query, scope: "pins", bookmarks: [""], page_size: 30 },
    context: {}
  }
  const url =
    "https://www.pinterest.com/resource/BaseSearchResource/get/" +
    `?source_url=${encodeURIComponent(sourceUrl)}` +
    `&data=${encodeURIComponent(JSON.stringify(data))}&_=${Date.now()}`

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
      "X-Pinterest-Pws-Handler": "www/index.js",
      "Referer": `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`
    }
  })

  const json = await res.json()
  const results = json?.resource_response?.data?.results || []
  const links = []

  for (const item of results) {
    const img = item?.images?.orig?.url || item?.images?.["736x"]?.url || item?.images?.["564x"]?.url
    if (img && !links.includes(img)) links.push(img)
    if (links.length >= CONFIG.jumlahFoto) break
  }

  return links
}

async function downloadGambar(links) {
  const buffers = []
  for (const link of links) {
    try {
      const res = await fetch(link, {
        headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://www.pinterest.com/" }
      })
      if (!res.ok) continue
      const buffer = Buffer.from(await res.arrayBuffer())
      if (buffer.length < 5000) continue
      buffers.push(buffer)
    } catch {}
    if (buffers.length >= CONFIG.jumlahFoto) break
  }
  return buffers
}

async function buatCanvas(buffers) {
  const { width: W, height: H, pad, header: headerH, footer: footerH, cols, rows } = CONFIG.canvas
  const cellW = Math.floor((W - pad * (cols + 1)) / cols)
  const cellH = Math.floor((H - headerH - footerH - pad * (rows + 1)) / rows)

  const bg = await sharp({
    create: { width: W, height: H, channels: 3, background: CONFIG.warnaBg }
  }).png().toBuffer()

  const composites = []

  for (let i = 0; i < buffers.length; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = pad + col * (cellW + pad)
    const y = headerH + pad + row * (cellH + pad)
    const foto = await sharp(buffers[i]).resize(cellW, cellH, { fit: "cover" }).png().toBuffer()
    composites.push({ input: foto, left: x, top: y })

    const nomor = String(i + 1).padStart(2, "0")
    const badge = Buffer.from(
      `<svg width="62" height="28"><rect width="62" height="28" rx="8" fill="black" fill-opacity="0.85"/><text x="31" y="20" font-family="Arial" font-size="16" font-weight="bold" fill="white" text-anchor="middle">${nomor}</text></svg>`
    )
    composites.push({ input: badge, left: x + 8, top: y + 8 })
  }

  return sharp(bg).composite(composites).jpeg({ quality: 88 }).toBuffer()
}

module.exports = {
  hady: {
    nama: "pin",
    penulis: "Hady Zen",
    kuldown: 5,
    peran: 0,
    tutor: ".pin <cari>",
    kategori: "media",
    harga: 1
  },
  Ayanokoji: async function ({ api, event, args, getData, setUser }) {
    const raw = bersihkanQuery(args)
    const key = `${event.threadID}_${event.senderID}`

    if (/^\d+$/.test(raw)) {
      const sesi = global.pinSessions.get(key)
      if (!sesi) {
        return api.sendMessage("Belum ada sesi, cari dulu .pin kucing, baru .pin 1", event.threadID, event.messageID)
      }
      if (Date.now() - sesi.created > CONFIG.durasiSesi) {
        global.pinSessions.delete(key)
      }
      const index = parseInt(raw) - 1
      if (index < 0 || index >= sesi.buffers.length) {
        return api.sendMessage(`Nomor gak ada. Pilih 1 sampai ${sesi.buffers.length}`, event.threadID, event.messageID)
      }
      return api.sendImage(
        sesi.buffers[index],
        `${sesi.query} (${index + 1}/${sesi.buffers.length})`,
        event.threadID,
        event.messageID
      )
    }

    if (/^\d+\s+\d+/.test(raw)) {
      return api.sendMessage("Cuma boleh pilih 1 foto, contoh: .pin 2", event.threadID, event.messageID)
    }

    const query = raw
    if (!query) {
      return api.sendMessage("Isi yang mau dicari, contoh: .pin kucing", event.threadID, event.messageID)
    }

    const userData = getData(event.senderID);
    if (!userData || (userData.yen || 0) < 1) {
      return api.sendMessage("Yen kamu tidak cukup, butuh 1 yen buat pin.", event.threadID, event.messageID);
    }

    try {
      const links = await cariPinterest(query)
      if (links.length === 0) {
        return api.sendMessage(`Gak ketemu foto buat: ${query}`, event.threadID, event.messageID)
      }

      const buffers = await downloadGambar(links)
      if (buffers.length === 0) {
        return api.sendMessage("Gambarnya ke-block Pinterest, coba lagi 1 menit.", event.threadID, event.messageID)
      }

      const canvas = await buatCanvas(buffers)
      const caption =
        `Pilih gambar, ketik .pin 1 - 12\n` +
        `Berlaku sampai 1 menit.`

      await api.sendImage(canvas, caption, event.threadID, event.messageID)

      setUser(event.senderID, 'yen', (userData.yen || 0) - 1);

      global.pinSessions.set(key, { buffers, query, created: Date.now() })
      setTimeout(() => global.pinSessions.delete(key), CONFIG.durasiSesi)
    } catch (e) {
      return api.sendMessage(`Gak ada gambar itu.`, event.threadID, event.messageID)
    }
  }
}
