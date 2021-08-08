const connection = require("../database/connection");

module.exports = {

    //Verifica se os valores estão preenchidos
    isEmpty(value, msg) {
        if (!value) throw msg
        if (typeof value === 'string' && !value.trim()) throw msg
    },

    //Verifica se o email é válido
    validateEmail(value, msg) {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const isCorrect = regex.test(value)
        if (!isCorrect) throw msg
    },

    //Valida a idade a partir da data informada
    validateAge(value, msg) {

        var matches = /(\d{4})[-.\/](\d{2})[-.\/](\d{2})/.exec(value);
        if (matches == null) {
            throw 'A data fornecida é inválida'
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        const myDate = value.split('-');

        const myYear = myDate[0];
        const myMonth = myDate[1];
        const myDay = myDate[2];

        let age = year - myYear;

        if (month < myMonth || month == myMonth && myDay < day) {
            age -= 1
        }

        if (myYear > year) throw 'A data fornecida é inválida';
        if (age < 13) throw 'É necessario ter mais de 14 anos';
    },

    async userExists (id) {
        const user = await connection('user').select('id').where('id', id)

        if(!user.length <= 0) {
            return true
        }else {
            return false
        }
    },

    async postExists (id) {
        const post = await connection('post').select('id').where('id', id)

        if(!post.length <= 0) {
            return true
        }else {
            return false
        }
    }
}