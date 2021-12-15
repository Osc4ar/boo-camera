require('dotenv').config()

const { remote } = require('webdriverio')
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('stop', (ctx) => {
  
})

bot.command('start', async (ctx) => {
  // Using context shortcut
  console.log(ctx)
  ctx.reply(`Hello, I am starting your meeting`)

  const meetingUrl = await createMeeting()
  ctx.reply(`Meeting URL: ${meetingUrl}`)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function createMeeting() {
  const browser = await remote({
    capabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--use-fake-ui-for-media-stream',
          '--use-fake-device-for-media-stream',
        ],
        prefs: {
          // 'profile.default_content_setting_values.media_stream_mic': 1,
          // 'profile.default_content_setting_values.media_stream_camera': 1,
          // 'hardware.audio_capture_enabled': true,
          // 'hardware.video_capture_enabled': true,
          // 'hardware.audio_capture_allowed_urls': ['https://meet.jit.si'],
          // 'hardware.video_capture_allowed_urls': ['https://meet.jit.si'],
        },
      },
    },
  })

  await browser.url('https://meet.jit.si')

  const enterRoom = await browser.$('#enter_room_button')
  await enterRoom.click()

  await sleep(2000)

  const participantName = await browser.$(
    '#videoconference_page > div.premeeting-screen > div:nth-child(1) > div > div > div.prejoin-input-area > input'
  )
  await participantName.setValue('Boo')

  const joinMeeting = await browser.$(
    '#videoconference_page > div.premeeting-screen > div:nth-child(1) > div > div > div.prejoin-input-area > div > div'
  )
  await joinMeeting.click()

  return browser.getUrl()
}

async function main() {
  const meetingUrl = await createMeeting()
}
