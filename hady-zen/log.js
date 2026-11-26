/* Hady Zen'in */
/* dibuat oleh Hady with love - Copyright HadyZenin 2026 */

const font = {
  bold: `\x1b[1m`,
  italic: `\x1b[3m`
};
const warna = {
  reset: `\x1b[0m`, 
  hitam: `\x1b[38;5;240m`,
  merah: `\x1b[31m`,
  hijau: `\x1b[32m`,
  kuning: `\x1b[33m`,
  biru: `\x1b[34m`,
  magenta: `\x1b[35m`,
  cyan: `\x1b[36m`,
  putih: `\x1b[37m`
};
const logo = {
  error: `${warna.hitam}DYZEN${warna.reset} ${warna.merah}${font.bold}[ERROR] ${warna.reset}`, 
  sukses: `${warna.hitam}DYZEN${warna.reset} ${warna.hijau}${font.bold}[SUKSES] ${warna.reset}`,
  proses: `${warna.hitam}DYZEN${warna.reset} ${warna.biru}${font.bold}[PROSES] ${warna.reset}`,
  chat: `${warna.hitam}DYZEN${warna.reset} ${warna.magenta}${font.bold}[CHAT] ${warna.reset}`,
  info: `${warna.hitam}DYZEN${warna.reset} ${warna.cyan}${font.bold}[INFO] ${warna.reset}`, 
  ayanokoji: `${warna.merah}▄▀█ █▄█ ▄▀█ █▄ █ █▀█ █▄▀ █▀█  █ █\n█▀█  █  █▀█ █ ▀█ █▄█ █ █ █▄█ ▄█ █`
};
function ayanokoji(nama) {
  return `${warna.hitam}DYZEN${warna.reset} ${warna.biru}${font.bold}[${nama.toUpperCase()}] ${warna.reset}`;
};

module.exports = { warna, font, logo, ayanokoji };
