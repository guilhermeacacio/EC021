//Conexão com o DB
const Meme = require('./database/models/Meme');

//Função para inserir um meme no DB
async function inserir(meme) {

    let result = await Meme.create(meme);
    return result;
}

//Função para atualizar um meme no DB
async function atualizar(id, meme) {

    let result = await Meme.findByIdAndUpdate(id, meme);
    if (result != null) //Caso a variavel result não seja null, representa que a edição foi feita
        return result;
    else //caso contrario retorna vazio, pois não foi encontrado o meme para realizar a edição
        return {};
}

//Função para buscar um meme
async function buscar(query) {
    let memes = [];
    let id = query.id;

    if(id) //Faz a busca por ID
        memes = await Meme.findById(id);
    else //Caso não seja passado o ID como parametro, lista todos os memes
        memes = await Meme.find();
    
    return memes;
}

//Função para excluir um meme
async function excluir(id) {
    let memeExcluido = await Meme.findByIdAndDelete(id);
    return memeExcluido;
}

//Exporta as funções do arquivo dao.js para ser utilizado por outros arquivos, no caso o index.js
module.exports = {
    inserir, 
    atualizar,
    buscar,
    excluir
}