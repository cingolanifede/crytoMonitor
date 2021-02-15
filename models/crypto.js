const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const CryptoSchema = new Schema({
    symbol: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    crypto: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

CryptoSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Crypto', CryptoSchema);