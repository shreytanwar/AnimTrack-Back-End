const router = require('express').Router()
const axios = require("axios")

let Anime = require('./../Models/Anime.model')

router.get('/present', async (req, res, next) => {
    try{
        // const mal_id = req.body.str
        const mal_id = req.query.id
        console.log("trying")
        const response = await Anime.findOne({ mal_id: mal_id })
        console.log("response",response)
        res.send(response)
    }
    catch(e){
        next(e)
    }
})


router.post('/add', async (req, res, next) => {
    try{
        const response = await axios.get(`https://api.jikan.moe/v3/anime/${req.query.id}`)

        const mal_id = response.data.mal_id
        const image_url = response.data.image_url
        const trailer_url = response.data.trailer_url
        const title = response.data.title
        const title_japanese = response.data.title_japanese
        const episodes = response.data.episodes
        const status = response.data.status
        const rating = response.data.rating
        const score = response.data.score
        const rank = response.data.rank
        const popularity = response.data.popularity
        const synopsis = response.data.synopsis
        const related = response.data.related
        const genres = response.data.genres

        const newAnime = new Anime({
            mal_id,
            image_url,
            trailer_url,
            title,
            title_japanese,
            episodes,
            status,
            rating,
            score,
            rank,
            popularity,
            synopsis,
            related,
            genres
        })
        
        const finalResponse = await newAnime.save()
        return res.send(finalResponse)
        }

        catch(e){
            next(e)
        }
})

//update to show searched term in url
router.get("/search/", async (req, res, next) => {
    console.log(req.query.str);

    const fetch = async() => {
        
        console.log(`https://api.jikan.moe/v3/search/anime?q=${req.query.str}`)
        try{
        const response = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${req.query.str}`)
        var results = response.data.results
        // console.log(results)
        return res.json(results)
        }
        catch(e){
            console.log(e)
        }
    }

    await fetch()
})

//top anime rn
router.get("/topAnime/:pageNo", async (req, res, next) => {
    console.log("TOP ANIME");

    const fetch = async() => {
        const pageNo = req.params.pageNo
        try{
        const response = await axios.get(`https://api.jikan.moe/v3/top/anime/${pageNo}`)
        var results = response.data.top
        // console.log(results)
        return res.json(results)
        }
        catch(e){
            console.log(e)
        }
    }

    await fetch()
})

//top airing anime rn
router.get("/topAiringAnime/:pageNo", async (req, res, next) => {
    console.log("TOP ANIME");

    const fetch = async() => {
        const pageNo = req.params.pageNo
        try{
        const response = await axios.get(`https://api.jikan.moe/v3/top/anime/${pageNo}/airing`)
        var results = response.data.top
        // console.log(results)
        return res.json(results)
        }
        catch(e){
            console.log(e)
        }
    }

    await fetch()
})
module.exports = router;