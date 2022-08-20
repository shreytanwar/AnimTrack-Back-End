const router = require('express').Router()
const axios = require("axios")

const verify = require('./VerifyToken')

let Anime = require('../Models/Anime.model')
let User = require('../Models/User.model')
let List = require('../Models/List.model')


//creates new list
router.post('/createList', verify, async(req, res, next) =>{
    try{
        const list_name = req.body.list_name
        const _id = req.user._id
        
        const check_response = await User.findOne({_id: _id, 'anime_list.list_name' :list_name})
        if(check_response != null) {
            console.log("User and List already exists")
            next()
            return res
        }
        
        const list_object = new List.ListModel({
            list_name: list_name,
            list:[]
        })
        
        const response = await User.findOneAndUpdate(
            { _id: _id },
            { $push: { anime_list : list_object}}
            )
            
        return res.send(response)
    }
    catch(e){
        next(e)
    }
})

//deleteList
router.post('/deleteList', verify, async(req, res, next) =>{
    try{
        
        const list_name = req.body.list_name
        const _id = req.user._id
        console.log("list to delete: ",list_name)
        if(list_name == 'Watch Later'){
            console.log("Can't remove Watch Later")
            next()
            return res
        }

        const response = await User.findOneAndUpdate(
            { _id: _id,'anime_list.list_name': list_name },
            { $pull: { 'anime_list': { list_name: list_name} }}
            )
        console.log(response)
        return res.send(`deleted ${list_name} for ${_id}`)
    }
    catch(e){
        next(e)
    }
})

//add anime to a list
router.post('/add', verify, async(req, res, next) => {
    try{
        console.log("in add")
        const _id = req.user._id
        const list_name = req.body.list_name.replace("%20"," ")
        const mal_id = req.body.mal_id
        
        const check_response = await User.findOne({_id: _id, 'anime_list.list_name' :list_name})
        if(check_response == null ){
            console.log("User/List Not Found")
            next()
            return res.send("User/List Not Found")
        }

        const listToAdd = checkList(check_response.anime_list, list_name)
        if(listToAdd == null){
            console.log("List Not Found")
            next()
            return res
        }
        
        const animeToAdd = checkAnime(listToAdd.list, mal_id)
        if(animeToAdd != null){
            return res.send("Anime already in list")
        }

        const response = await User.findOneAndUpdate(
            { _id: _id, 'anime_list.list_name': list_name },
            { $push: {'anime_list.$.list' : { 'mal_id' : mal_id } } }
            )
        // console.log(response.anime_list.list)
        return res.send(`added ${mal_id} in ${list_name}`)
    }
    catch(e){
        next(e)
        
        console.log("in catch error")
        return res.send("in catch error")
    }
})

//delete anime from list
router.post('/delete', verify, async(req, res, next) => {
    try{
        const _id = req.user._id

        const list_name = req.body.list_name  
        const mal_id = req.body.mal_id

        const response = await User.findOneAndUpdate(
            { _id: _id, 'anime_list.list_name': list_name, 'anime_list.list.mal_id': mal_id },
            { $pull: {'anime_list.$.list': {mal_id: mal_id } } }
            )
        console.log("while deleting found: ",response)
        return res.send(`deleted ${mal_id} from ${list_name}`)
    }
    catch(e){
        next(e)
    }
})

//get all list names 
router.get('/getAllLists', verify, async (req, res, next) =>{
    try{
        const _id = req.user._id
        console.log('id: ',_id)
        const response = await User.findOne({_id: _id}).select('anime_list.list_name')
        if(response==null){
            return res.send("User/List Not Found")
        }
        
        console.log(response)
        return res.json(response)
    }
    catch(e){
        next(e)
    }
})

//get animes of one list
router.get('/getList/:list_name', verify, async (req, res, next) =>{
    try{
        const _id = req.user._id

        const list_name = req.params.list_name.replace("%20"," ")
        console.log('list: ',list_name)
        const response = await User.findOne({_id: _id, 'anime_list.list_name' :list_name})
        if(response==null) {
            return res.send("User/List Not Found");
        }
        const anime_list = checkList(response.anime_list, list_name)
        if(anime_list == null){
            next()
            return res.send(("List Not Found"))
        }
        else{
            console.log(anime_list)
        }

        const list= []

        for(var i=0;  i<anime_list.list.length; i++){
            mal_id = anime_list.list[i].mal_id
            const anime = await Anime.findOne({mal_id: mal_id})
            list.push(anime)
        }
        return res.json(list)
        
    }catch(e){
        next(e)
    }
})

//add anime to a list
router.post('/presentInList', verify, async(req, res, next) => {
    try{
        const _id = req.user._id
        const list_name = req.body.list_name.replace("%20"," ")
        const mal_id = req.body.mal_id
        console.log("List is: ",list_name)
        const check_response = await User.findOne({_id: _id, 'anime_list.list_name' :list_name})
        console.log("List is not: ",check_response)
        if(check_response == null ){
            console.log("User/List Not Found")
            return res.json({ present: false })
            next()
        }

        console.log("FOUND THE ANIME IN LIST")
        const listToAdd = checkList(check_response.anime_list, list_name)
        if(listToAdd == null){
            console.log("List Not Found")
            return res.json({ present: false })
            next()
        }
        
        console.log("FOUND THE ANIME IN LIST")
        const animeToAdd = checkAnime(listToAdd.list, mal_id)
        console.log(listToAdd.list," &&& ",mal_id)
        if(animeToAdd == null){
            console.log("FOUND THE ANIME IN LIST::::",animeToAdd)
            return res.json({ present: false })
        }
        console.log("FOUND THE ANIME IN LIST")
        return res.json({ present: true })
        // // console.log(response.anime_list.list)
        // return res.send(`added ${mal_id} in ${list_name}`)
    }
    catch(e){
        next(e)
        console.log("in catch error")
        return res.send("in catch error")
    }
})

//check if list present
function checkList(anime_list, list_name){
    console.log(anime_list)
    
    for(var i=0; i<anime_list.length; i++){
        if(anime_list[i].list_name == list_name){
            return anime_list[i]
        }
    }
    return null;
}

//check if anime present in list
function checkAnime(list, mal_id){
    for(var i=0; i<list.length; i++){
        if(list[i].mal_id == mal_id){
            return list[i]
        }
    }
    return null;
}
module.exports = router;