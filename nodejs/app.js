'use strict';
// const loadash = require('loadash')
const uuidv4 = require('uuid/v4')
const express = require('express')
const app = express()
app.use(express.json())
const port = 3000

var users=[]
var tokens=[]
var articles=[]

class ErrorException extends Error {
    constructor(...args) {
        super(...args);
        this.message=args[0];
        this.code = args[1];
    }
}



function checkResponse(body,res){
    if(!body || Object.keys(body).length===0) {
        throw new ErrorException("Your request is in wrong struct",400);
    }
    let isUser=users.map((user)=>{
        if(user.user_id===body.user_id || user.login===body.login){
           return true
        }
    });
    if( isUser.includes(true)) {
        throw new ErrorException("", 201)
    }else{
        res.status(200).send("success");
    }

}

function authenticate(body,res){
    if(!body || Object.keys(body).length===0) {
        throw new ErrorException("Your request is in wrong struct",400);
    }
    var token=""
    let isUser=users.map((user)=>{
        if(user.login===body.login) {
            if (user.login === body.login && user.password === body.password) {
                token=uuidv4()
                tokens.push({user_id:user.user_id, token : token})
            }
            return true
        }
    });
   if( isUser.includes(true) && !token) {
        throw new ErrorException("wrong password", 400);
    }else if( !token){
        throw new ErrorException("no user in data", 400);
    }else{
       res.status(200).json({token:token})
   }
}

function logout(req,res){
       if (req.get("Authorization") !==token) {
           throw new ErrorException("invalid token",401)}
       else{res.status(200).json("successfully logged out")}
}

function getAuthID(token){
    var userID=0
    var isToken=tokens.map((t)=>{
            if (t.token === token) {
                userID= t.user_id
            return true
            }
    })
    if(!isToken.includes(true)){
        throw new ErrorException("user not found",401)
    }else{
        return userID
    }
}

function mapArticle(a) {
   var art= articles.map((article)=>{
      return   article.article_id===a
    })
   return art.includes(true)===true
}

function postArticle(req,res) {
    let body = req.body
    let user_id = getAuthID(req.get('authentication-header'))
    if (!body || Object.keys(body).length === 0) {
        throw new ErrorException("Your request is in wrong struct", 400);
    } else if (mapArticle(body.article_id)) {
        throw new ErrorException("", 201);
    } else {
        articles.push({
            user_id: user_id,
            article_id: body.article_id,
            title: body.title,
            content: body.content,
            visibility: body.visibility
        })
     res.status(200).json("created successfully")
    }
}

app.post('/api/user',(req,res)=>{
    try {
        checkResponse(req.body,res)
        users.push({
            user_id: req.body.user_id,
            login:req.body.login,
            password:req.body.password
        })
    }catch (e) {
        res.status(e.code).json(e.message);
    }
});

app.post('/api/authenticate',(req,res,next)=> {

    try{
        authenticate(req.body,res,req)
    }catch (e) {
        res.status(e.code).json(e.message);
    }
})

app.post('/api/logout',(req,res)=> {
    try {
        logout(req,res)
    }catch (e) {
    res.status(e.code).json(e.message)
    }
})

app.post('/api/articles',(req,res)=>{
    try {
        postArticle(req,res)
    }catch (e) {
        res.status(e.code).json(e.message)
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

