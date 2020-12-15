const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({   
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;