<h1 align=center>BruteJS</h1>

<h3 align=center>Brute force generico</h3>

BruteJS é um script de brute force bem generico que automatiza o navegador/browser chromium para funcionar em diversos sites como se fosse uma pessoa de verdade tentando fazer login


## Instalação:
### 💻 Derivados do Debian:

```
git clone https://github.com/CarlosAllberto/BruteJS
cd BruteJS
apt install node npm -y
npm install
node index.js
```

Em uma linha:

```
git clone https://github.com/CarlosAllberto/BruteJS && cd BruteJS && apt install node npm -y && npm install && node index.js
```

## Run:

```
usage: index.js [-h] [-s SITE] [-e EMAIL] [-p PASSWORD]

parameters example

optional arguments:
  -h, --help            show this help message and exit
  -s SITE, --site SITE  facebook, instagram, google
  -e EMAIL, --email EMAIL
                        email or id
  -p PASSWORD, --password PASSWORD
                        password file with wordlist.txt
```

## License

[![License: MIT](https://img.shields.io/github/license/gcla/termshark.svg?color=yellow)](LICENSE)
