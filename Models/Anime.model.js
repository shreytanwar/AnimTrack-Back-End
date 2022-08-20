const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const animeSchema = new Schema({
    mal_id:{
        type: Number,
        required: true,
        unique: true
    },
    image_url:{
        type: String
    },
    trailer_url:{
        type: String
    },
    title:{
        type: String
    },
    title_japanese:{
        type: String
    },
    episodes:{
        type: Number
    },
    status:{
        type: String
    },
    rating:{
        type: String
    },
    score:{
        type: Number
    },
    rank:{
        type: Number
    },
    popularity:{
        type: Number
    },
    synopsis:{
        type: String
    },
    related:{
        Adaptation: [
            {
                mal_id: {
                    type: Number    
                },
                type: {
                    type: String
                },
                name: {
                    type: String
                },
                url: {
                    type: String
                }
            }
        ],
        'Side story': [
            {
                mal_id: {
                    type: Number
                },
                type: {
                    type: String
                },
                name: {
                    type: String
                },
                url: {
                    type: String
                }
            }
        ],
        Summary: [
            {
                mal_id: {
                    type: Number
                },
                type: {
                    type: String
                },
                name: {
                    type: String
                },
                url: {
                    type: String
                }
            }
        ]
    },
    genres:[
        {
            mal_id: {
                type: Number
            },
            type: {
                type: String
            },
            name: {
                type: String
            },
            url: {
                type: String
            }
        }
    ]
});

const Anime = mongoose.model("Anime", animeSchema)

module.exports = Anime
