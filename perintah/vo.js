function deteksiFormat(buffer) {
  if (!buffer || buffer.length < 10) return null
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return { ext: "jpg", mime: "image/jpeg" }
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return { ext: "png", mime: "image/png" }
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return { ext: "gif", mime: "image/gif" }
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) return { ext: "webp", mime: "image/webp" }
  return null
}

function jadiBuffer(input) {
  if (!input) return null
  if (Buffer.isBuffer(input)) return input
  if (input.buffer && Buffer.isBuffer(input.buffer)) return input.buffer
  if (input.data && Buffer.isBuffer(input.data)) return input.data
  if (input.data && Array.isArray(input.data.data)) return Buffer.from(input.data.data)
  if (input.data && typeof input.data === "string") return Buffer.from(input.data, "base64")
  if (typeof input === "string" && input.length > 100) {
    try { return Buffer.from(input, "base64") } catch { return null }
  }
  return null
}

async function ambilBufferFoto({ event }) {
  const kandidat = [
    event.repliedMedia,
    event.repliedViewOnce,
    event.viewOnceMedia,
    event.media,
    event.attachments?.[0],
    event.attachment
  ]

  for (const item of kandidat) {
    const buffer = jadiBuffer(item)
    if (buffer && buffer.length > 100 && deteksiFormat(buffer)) return buffer
  }

  return null
}

module.exports = {
  hady: {
    nama: "vo",
    penulis: "Hady Zen",
    kuldown: 20,
    peran: 0,
    tutor: "<reply foto sekali lihat>",
    kategori: "alat"
  },
  Ayanokoji: async function ({ api, event }) {
    try {
      const mentah = await ambilBufferFoto({ event })

      if (!mentah) {
        return api.sendMessage("Reply foto sekali lihat yang mau diambil.", event.threadID, event.messageID)
      }

      try {
        await api.sendMessage({ image: mentah }, event.threadID, event.messageID)
      } catch {
        await api.sendMessage({ attachment: mentah }, event.threadID, event.messageID)
      }
    } catch (err) {
      return api.sendMessage(err.message, event.threadID, event.messageID)
    }
  }
}
