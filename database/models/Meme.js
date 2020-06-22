//Biblioteca do Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Cria-se um schema para ser utilizado como base para as alterações no db
const Meme = new Schema(
    {
        titulo: {
            type: String,
            default: null
        },
        descricao: {
            type: String,
            default: null
        },
        ano: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

//exporta o schema para ser utilizado em outros arquivos
module.exports = mongoose.model('memes', Meme);

