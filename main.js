const puppeter = require('puppeteer')
const app = require('express')()
const port = 3000
const _ = require('lodash')

app.listen(port, function () {
    console.log(`app listen on port ${port}`)
})


//'56679863000787'
// const chromeOptions = {
//     headless: false,
//     defaultViewport: null
// };

app.get('/', async (req, res) => {
    try {
        var cnpj = req.query.cnpj
        const url = `http://www.portaltransparencia.gov.br/busca/pessoa-juridica/${cnpj}`
        await scrape(url).then((value)=>{
            if (value == undefined) res.status(404).send({Erro: 'CNPJ não encontrado no portal da transparência'})
            res.status(200).send(value)
        })
        
    } catch (error) {
        res.status(404).send({Erro: 'CNPJ não encontrado no portal da transparência'})
    }

})

let scrape = async (url) => {
    try {
        const browser = await puppeter.launch({args: ['--no-sandbox']})
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle2' })


        const result = await page.evaluate(() => {
            let registros = {}

            let cnpj = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(1) > div:nth-child(1) > span").innerText
            registros.cnpj = cnpj.substring(0,18)
            registros.tipo = cnpj.substring(19)
            registros.data_abertura = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(1) > div:nth-child(2) > span").innerText
            registros.email = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(1) > div:nth-child(3) > span").innerText
            registros.telefone = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(1) > div.col-xs-12.col-sm-2 > span").innerText
            registros.razao_social = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(3) > div:nth-child(1) > span").innerText
            registros.nome_fantasia = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(3) > div:nth-child(2) > span").innerText
            registros.natureza_juridica = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(3) > div:nth-child(3) > span:nth-child(2)").innerText
            registros.atividade_principal = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(3) > div:nth-child(4) > span").innerText
           
            registros.endereco = {
                logradouro: document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(5) > div.col-xs-12.col-sm-3 > span").innerText,
                numero: document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(5) > div:nth-child(2) > span").innerText,
                complemento: document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(5) > div:nth-child(3) > span").innerText,
                cep: document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(5) > div:nth-child(4) > span").innerText,
                bairro: document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(5) > div:nth-child(5) > span").innerText,
                municipio: document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(5) > div:nth-child(6) > span").innerText,
                uf: document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(5) > div:nth-child(7) > span").innerText
            }

            // if (await page.$('#btnAbaQuadroSocietario') !== null) {
            //     regis
            // }
            
            return registros
        })

        browser.close()
        return result
    } catch (error) {
        console.log(error)
    }
}

// scrape().then((value) => {
//     console.log(value)
// })