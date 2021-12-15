const { remote } = require('webdriverio')

async function main() {
  const browser = await remote({
    capabilities: {
      browserName: 'chrome',
    },
  })

  await browser.url('https://webdriver.io')

  const apiLink = await browser.$('=API')
  await apiLink.click()

  await browser.deleteSession()
}

main()
