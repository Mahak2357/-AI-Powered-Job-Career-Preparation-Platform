const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required']
    }
    },
    {
    timestamps: true // Automatically add createdAt and updatedAt fields
}
);
const Blacklist = mongoose.model('Blacklist', blacklistSchema);
module.exports = Blacklist;  