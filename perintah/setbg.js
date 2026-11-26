const axios = require("axios")
const FormData = require("form-data")

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
    event.media,
    event.attachments?.[0],
    event.attachment
  ]

  for (const item of kandidat) {
    const buffer = jadiBuffer(item)
    if (buffer && buffer.length > 100 && deteksiFormat(buffer)) return buffer
    if (item?.url) {
      const res = await axios.get(item.url, { responseType: "arraybuffer" })
      const buffer2 = Buffer.from(res.data)
      if (deteksiFormat(buffer2)) return buffer2
    }
  }

  return null
}

module.exports = {
  hady: {
    nama: "setbg",
    penulis: "Hady Zen",
    kuldown: 10,
    peran: 0,
    tutor: ".setbg <reply gambar>",
    kategori: "alat",
    harga: 2
  },

  Ayanokoji: async function ({ api, event, getData, setUser }) {
    const { yen } = getData(event.senderID);

    if (yen < 2) {
      return api.sendMessage(
        "Minimal memiliki 2¥ untuk mengganti background.",
        event.threadID,
        event.messageID
      );
    }

    try {
      const mentah = await ambilBufferFoto({ event });

      if (!mentah) {
        return api.sendMessage(
          "Reply sebuah gambar untuk dijadikan background.",
          event.threadID,
          event.messageID
        );
      }

      const format = deteksiFormat(mentah) || { ext: "jpg", mime: "image/jpeg" };
      const form = new FormData();
      form.append("image", mentah, {
        filename: `background.${format.ext}`,
        contentType: format.mime
      });

      const { data: upload } = await axios.post(
        "https://api.imgbb.com/1/upload",
        form,
        {
          params: {
            key: global.Ayanokoji.imgbbkey
          },
          headers: form.getHeaders()
        }
      );

      setUser(event.senderID, "bg", upload.data.url);
      setUser(event.senderID, "yen", yen - 2);

      return api.sendMessage(
        "Berhasil mengganti background.",
        event.threadID,
        event.messageID
      );

    } catch (err) {
      return api.sendMessage(
        'Gagal mengganti background.',
        event.threadID,
        event.messageID
      );
    }
  }
};
