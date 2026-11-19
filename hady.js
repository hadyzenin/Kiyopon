const fs = require('fs')
const pino = require('pino')
const chalk = require('chalk')
const readline = require('readline')

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function ask(q) {
    return new Promise(res => rl.question(q, res))
}

async function hady() {
    try {
        console.log(chalk.cyan('\n🚀 Starting WhatsApp Bot...\n'))

        const { version } = await fetchLatestBaileysVersion()
        const { state, saveCreds } = await useMultiFileAuthState('./session')

        const sock = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            auth: state
        })

        sock.ev.on('creds.update', saveCreds)

        if (!sock.authState.creds.registered) {
            let number = await ask(
                chalk.green('Masukkan nomor WhatsApp (tanpa +, tanpa spasi): ')
            )

            number = number.replace(/[^0-9]/g, '')

            console.log(chalk.yellow('\n🔄 Requesting pairing code...\n'))

            let code = await sock.requestPairingCode(number)
            code = code?.match(/.{1,4}/g)?.join('-')

            console.log(chalk.magenta(`\n🔗 Kode Pairing Anda: ${chalk.green(code)}\n`))
            console.log(`👉 Buka WhatsApp → Linked Devices → Pair a Device lalu masukkan kode`)

            rl.close()
        }

        sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
            if (connection === "open") {
                console.log(chalk.green('\n✅ Bot berhasil terhubung ke WhatsApp!\n'))
            }

            if (connection === "close") {
                const reason = lastDisconnect?.error?.output?.statusCode
                if (reason !== DisconnectReason.loggedOut) {
                    console.log(chalk.red("Reconnecting..."))
                    startBot()
                } else {
                    console.log(chalk.red("Session expired. Hapus folder session dan login ulang."))
                }
            }
        })

        sock.ev.on("messages.upsert", async ({ messages }) => {
            const m = messages[0]
            if (!m.message) return

            const sender = m.key.remoteJid
            const text = m.message.conversation || ""

            console.log(`📩 Pesan dari ${sender}: ${text}`)

            if (text.toLowerCase() === "ping") {
                await sock.sendMessage(sender, { text: "pong!" })
            }
        })

    } catch (err) {
        console.log("Error:", err)
        hady()
    }
}

hady()
