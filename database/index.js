//URL do DB
const DB_URL = 'mongodb://127.0.0.1:27017';

//Aqui se configura os parametros para a conexão com o DB
const DB_SETTINGS = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    user: '',
    pass: '',
    dbName: 'ec021-av2-core'
}

//Exporta a URL e os parametros de configuração para ser utilizado em outro arquivos
module.exports = {
    DB_URL,
    DB_SETTINGS
}