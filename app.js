const puppeteer = require('puppeteer')
const Event = require('events')
const { authenticator } = require('otplib')


const wcw = {}

wcw.create = async (email, password, secrect) => {
    const ins = new Event()

    let retry = 0
    let error = null

    while (retry++ < 3) {
        try {
            ins.browser = await puppeteer.launch({
                headless: false,
                args: [
                    '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
                    '--no-sandbox',
                ],
            })
        
            const pages = await ins.browser.pages()
            const page = pages[0]
        
            await page.goto('https://wallet.wax.io')
            await page.waitForNetworkIdle()
            await page.waitForTimeout(200)
            await page.waitForSelector('input[name="userName"]')
            await page.type('input[name="userName"]', email)
            await page.type('input[name="password"]', password)
            await page.click('.button-primary')

            throw 'xxxxxxxxxx'
        
            await page.waitForNetworkIdle()
            await page.waitForSelector('.button.primary')
            const otp = authenticator.generate(secrect.replaceAll(' ', ''))
            await page.type('input', otp)
            await page.click('.button.primary')
            await page.waitForNetworkIdle()
            await page.waitForFunction('window.wax?.api')
        
            ins.wallet = await page.evaluate(() => wax.userAccount)
        
            page.on('popup', async (popup) => {
                await popup.waitForNetworkIdle()
                await popup.waitForSelector('.button-secondary')
                popup.click('.button-secondary')
            })
        
            ins.transact = async (...args) => {
                const result = await page.evaluate(async (...args) => {
                    return wax.api.transact(...args)
                }, ...args)
            }
            
            return ins

        } catch (e) {
            error = e
            ins.browser?.close()
        }
    }

    throw error
}


module.exports = wcw