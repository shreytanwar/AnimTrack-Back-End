const router = require('express').Router()

const bcrypt = require('bcryptjs')
const {registerValidation, loginValidation} = require('./../Validation/Validation')
const jwt = require('jsonwebtoken')

const User = require('./../Models/User.model')
let List = require('../Models/List.model')


router.post('/register', async (req, res, next) =>{
    //validating before object createion
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //Checking if user is in database
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(404).send('Email already exists')

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create list object 
    const list_object = new List.ListModel({
        list_name: 'Watch Later',
        list:[]
    })

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        //remove uid
        user_id: req.body.uid,
        anime_list : [list_object]
    })
    console.log('created user')
    try{console.log('not saved user')
        const savedUser =  await user.save();
        console.log('saved user')
        return res.send({user: savedUser._id, name: savedUser.name})
    }
    catch(e){
        next(e)
    }
})

//Login
router.post('/login', async (req, res, next) => {
    //validating before object createion
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    //Checking if user is in database
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(404).send('Email or password is wrong1')
    console.log('user in')
    //Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(404).send('Email or password is wrong2')

    //Create and asign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)

    //setting auth-token as header
    res.set('auth-token', token)
    res.set('Access-Control-Expose-Headers',  'auth-token')

    return res.send(token)
})

module.exports = router
