const restify = require("restify"); //declaração da biblioteca restify para comunicação com o postman
const server = restify.createServer(); //criação do servidor para comunicação com o postman
const mongoose = require("mongoose"); //declaração da biblioteca mongoose para manipulação do banco de dados
const axios = require("axios").default; //declaração da biblioteca axios para comunicação entre a API e o AuthServer

//Declarando o uso dos plugins do restify query e body
server.use(restify.plugins.queryParser()); 
server.use(restify.plugins.bodyParser());

const database = require("./database") //referenciando o arquivo com as configurações do banco de dados
const dao = require("./dao"); //referenciando o arquivo dao
const MEME = '/meme'; //rota


//função de para exibir os logs
function logRequest(req, res, next) {
    let msg = `[${req.getRoute().method}] ${req.href()}`;

    if(req.body) {
        msg += ` => ${JSON.stringify(req.body)}`;
    }

    console.log(msg);
    next();
}

//Criando uma axiosInstance para comunicar com o AuthServer
const axiosInstance = axios.create(
    {
        baseURL: `https://ec021-av2-auth.herokuapp.com/` //URL base da rota do AuthServer
    }
);

//Função para autentiar o token
function autenticar(req, res, next) {
    let auth = 'auth/validateToken'; //auth + baseURL = https://ec021-av2-auth.herokuapp.com/auth/login
    let token = req.headers.token; //variavel token recebe o header da requisição

    if(token) { //se o token existir
        axiosInstance.post(auth, {},{ //Verifica se o Token está certo
            headers: {
                token: token
            }
        })
        .then((response) => { //Se o token estiver certo continua rodando o código
            next();
        })
        .catch((err) =>{ //caso esteja errado retorna erro
            res.json(err.response.status)
        });
    } else { //se o token não existir retorna erro
        res.json(403);
    }
}

//login do usuario
server.post('/auth/login', logRequest, (req, res) => {
    let URL = 'auth/login'; //baseURL + URL = https://ec021-av2-auth.herokuapp.com/auth/login
    let body = req.body; //variavel body recebe o body da requisição

    axiosInstance.post(URL, body, {}) //verifica se o usuário e senha está correto
    .then((response) => { //caso esteja certo retorna o status e os dados que contém o token
        res.json(response.status, response.data);
    })
    .catch((err) => { //caso esteja errado retorna um erro com o dados
        res.json(err.response.data);
    });
});

//Criar um meme
server.post(`${MEME}`, logRequest, autenticar, async (req,res) => {
    let meme = {    
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        ano: req.body.ano,
    };
    
    let memeCriado = await dao.inserir(meme);
    res.json(201, memeCriado);
});

//Atualizar um meme
server.patch(`${MEME}:id`, logRequest, async (req,res) => {
    let meme = 
        {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            ano: req.body.ano,
        };

    let memeAtualizado = await dao.atualizar(req.params.id, meme);
    res.json(200, memeAtualizado);
});

//Procurar um meme
server.get(`${MEME}/:id`, logRequest, autenticar, async (req,res) => {

    let memes = await dao.buscar(req.query);
    res.json(200, memes);
});

//Deletar um meme
server.del(`${MEME}:id`, logRequest, autenticar, async (req,res) =>
{
    let memeExcluido = await dao.excluir(req.params.id);
    res.json(204);
});

//Função para verificar se o servidor está rodando e ligar a conecxão entre a  aplicação e o db
server.listen(3000, () => {
    console.log(`O servidor está rodando`);

    mongoose.connect(database.DB_URL,database.DB_SETTINGS, (err) => {
        if(!err) {
            //conectou com o db
            console.log(`Aplicação conectada ao MongoDB: ${database.DB_SETTINGS.dbName}`);
        } else {
            //não conectou com o db
            console.log(`Erro ao conectar ao MongoDB: ${database.DB_URL}`);
        }
    })
});