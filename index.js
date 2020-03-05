const fs = require('fs');
const crypto = require('crypto');
const request = require('request');

var answer = { //objeto que irá ser escrito no arquivo "answer.json"
    "numero_casas": 11,
    "token": "d5e3b1b0b37c857266cdd76566ee62aecbe62b8f",
    "cifrado": "pgpcj mtr nzxafetyr otdldepc sld nzxp qczx elvtyr ezz xlyj topld lyo afeetyr espx ty zyp awlnp. rzcozy mpww",
    "decifrado": "",
    "resumo_criptografico": ""
}

//le o arquivo answer.json
fs.readFile('./answer.json', 'utf8', (err, json) => {
    if (err) {
        console.log("Erro ao ler arquivo:", err);
        return;
    }
    try { //decifra o texto cifrado e cria o resumo criptografico
        const answerObject = JSON.parse(json);
        let str = answerObject.cifrado.toLowerCase();
        for(let i = 0; i < str.length; i++){
            let code = str.charCodeAt(i);
            if (code >= 108 && code <= 122) { // o código ASCII das letras minúsculas vão de 97 a 122. 97 + 11 = 108.
                answer.decifrado += String.fromCharCode(code - 11);
            } else if(code >= 97 && code <= 107){
                answer.decifrado += String.fromCharCode(code + 15); // 11 + 4 = 15. 4 é o quanto falta para chegar na letra certa
            } else { // mantém os espaços e pontuações
                answer.decifrado += str[i];
            }
        }
        answer.resumo_criptografico = crypto.createHash('sha1').update(answer.decifrado).digest('hex');
        const answerJsonString = JSON.stringify(answer);
        fs.writeFile('./answer.json', answerJsonString, err => { //atualiza o arquivo answer.json
            if (err) {
                console.log('Erro ao escrever no arquivo:', err)
            } else {
                console.log('Arquivo escrito.')
            }
        }) 
    } catch(err) {
        console.log(err);
    }
})

const formData = {
    answer: fs.createReadStream('./answer.json')
};
//faz a requisição na api
request.post({url:'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=d5e3b1b0b37c857266cdd76566ee62aecbe62b8f', formData: formData}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('erro no upload:', err);
  }
  console.log('Upload feito: ', body);
});