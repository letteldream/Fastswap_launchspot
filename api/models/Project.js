const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
// let counter = 0;
const schema = new Schema(
    {
        name: {
            type: String,
            require: true,
            maxLength: 50,
        },
        description: {
            type: String,
            require: true,
            maxLength: 50,
        },
        website: {
            type: String,
            require: true,
            maxLength: 50,
        },
        medium: {
            type: String,
            require: true,
            maxLength: 50,
        },
        twitter: {
            type: String,
            require: true,
            maxLength: 50,
        },
        telegramGroup: {
            type: String,
            require: true,
            maxLength: 50,
        },
        open: {
            type: String,
            require: true,
            maxLength: 50,
        },
        close: {
            type: String,
            require: true,
            maxLength: 500,
        },
        symbol: {
            type: String,
            require: true,
            maxLength: 500,
        },
        totalSupply: {
            type: String,
            require: true,
            maxLength: 500,
        },
        tokenAddress: {
            type: String,
            require: true,
            maxLength: 500,
        },
        visibility: {
            type: String,
            require: true,
            maxLength: 500,
            default: () => 'Drafted',
        },
        swapTokens: {
            type: String,
            require: true,
        },
        swapRate: {
            type: String,
            require: true,
            maxLength: 50,
        },
        softcap: {
            type: String,
            require: true,
        },
        hardcap: {
            type: String,
            require: true,
        },
        addressList: {
            type: Array,
            require: true,
        },
        fastAmount: {
            type: Array,
            require: true,
        },
        dukeAmount: {
            type: Array,
            require: true,
        },
        allocation: {
            type: Array,
            require: true,
        },
        contractAddress: {
            type: String,
        }
    },
    { versionKey: false, timestamps: true },
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("projects", schema);