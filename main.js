const puppeter = require('puppeteer')
const app = require('express')()
const port = 3000
const url = 'http://www.portaltransparencia.gov.br/pessoa-juridica/busca/lista'
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
        await scrape(cnpj).then((value)=>{
            if (value == undefined) res.status(404).send({Erro: 'CNPJ não encontrado'})
            res.status(200).send(value)
        })
        
    } catch (error) {
        res.status(404).send({Erro: 'CNPJ não encontrado no portal da transparência'})
    }

})

let scrape = async (cnpj) => {
    try {
        const browser = await puppeter.launch({args: ['--no-sandbox']})
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle2' })

        await page.type('#termo', cnpj)

        await page.click('#btnBuscar')


        await page.waitFor(2000)
        await page.evaluate((browser) => {
            if (document.getElementById('countResultados').textContent == "0") {
                console.log('Deu erro')
            } else {
                document.querySelector("#resultados > li > h3 > a").click()
            }
        })


        await page.waitFor(2000)
        const result = await page.evaluate(() => {
            let registros = {}

            registros.cnpj = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(1) > div:nth-child(1) > span").textContent
            registros.data_abertura = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(1) > div:nth-child(2) > span").textContent
            registros.email = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(1) > div:nth-child(3) > span").textContent
            registros.telefone = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(1) > div.col-xs-12.col-sm-2 > span").textContent
            registros.razao_social = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(3) > div:nth-child(1) > span").textContent
            registros.nome_fantasia = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(3) > div:nth-child(2) > span").textContent
            registros.natureza_juridica = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(3) > div:nth-child(3) > span:nth-child(2)").textContent
            registros.atividade_principal = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(3) > div:nth-child(4) > span").textContent
            registros.logradouro = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(3) > div:nth-child(4) > span").textContent
            registros.numero = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(5) > div:nth-child(2) > span").textContent
            registros.complemento = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(5) > div:nth-child(3) > span").textContent
            registros.cep = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(5) > div:nth-child(4) > span").textContent
            registros.bairro = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(5) > div:nth-child(5) > span").textContent
            registros.municipio = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(5) > div:nth-child(6) > span").textContent
            registros.uf = document.querySelector("body > main > div:nth-child(3) > section.dados-tabelados > div:nth-child(5) > div:nth-child(7) > span").textContent

            return registros
        })

        browser.close()
        return result
    } catch (error) {
        console.log(error)
    }
}

