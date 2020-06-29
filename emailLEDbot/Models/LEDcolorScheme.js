const mongoose = require('mongoose');
//schema it is 0-29 so 30 total LED's
//this is left in incase someone wants to post the LED scheme to a DB
const UsersSchema = mongoose.Schema({
    led0: {
        type: String,
        required: true
    },
    led1: {
        type: String,
        required: true
    },
    led2: {
        type: String,
        required: true
    },
    led3: {
        type: String,
        required: true
    },
    led4: {
        type: String,
        required: true
    },
    led5: {
        type: String,
        required: true
    },
    led6: {
        type: String,
        required: true
    },
    led7: {
        type: String,
        required: true
    },
    led8: {
        type: String,
        required: true
    },
    led9: {
        type: String,
        required: true
    },
    led10: {
        type: String,
        required: true
    },
    led11: {
        type: String,
        required: true
    },
    led12: {
        type: String,
        required: true
    },
    led13: {
        type: String,
        required: true
    },
    led14: {
        type: String,
        required: true
    },
    led15: {
        type: String,
        required: true
    },
    led16: {
        type: String,
        required: true
    },
    led17: {
        type: String,
        required: true
    },
    led18: {
        type: String,
        required: true
    },
    led19: {
        type: String,
        required: true
    },
    led20: {
        type: String,
        required: true
    },
    led21: {
        type: String,
        required: true
    },
    led22: {
        type: String,
        required: true
    },
    led23: {
        type: String,
        required: true
    },
    led24: {
        type: String,
        required: true
    },
    led25: {
        type: String,
        required: true
    },
    led26: {
        type: String,
        required: true
    },
    led27: {
        type: String,
        required: true
    },
    led28: {
        type: String,
        required: true
    },
    led29: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Users', UsersSchema);
