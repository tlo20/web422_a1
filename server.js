/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: TSZ KIT LO Student ID: 160067211 Date: 2023/01/06_
*  Cyclic Link: _______________________________________________________________
*
********************************************************************************/ 


const express = require("express")
let app = express()
const HTTP_PORT = process.env.PORT || 8080
const cors = require("cors")
require('dotenv').config()

//Import custom db module
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();


//Middleware
app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send( {message: "API Listening"})
})

app.post("/api/movies",(req,res)=>{
    db.addNewMovie(req.body).then(
    result=>{
        res.send(result)
    },err=>{
        res.send(err)
    })
})

app.get("/api/movies",(req,res)=>{
    console.log(req.query)
    db.getAllMovies(
        req.query.page,
        req.query.perPage,
        req.query.title)
        .then(result=>{
        res.send(result)
    },err=>{
        res.send(err)
    })
})

app.get("/api/movies/:id",(req,res)=>{
    db.getMovieById(req.params.id)
        .then(result=>{
        res.send(result)
    },err=>{
        res.send(err)
    })
})

app.put("/api/movies/:id",(req,res)=>{
    db.updateMovieById(req.body,req.params.id)
        .then(result=>{
        res.send(result)
    },err=>{
        res.send(err)
    })
})

app.delete("/api/movies/:id",(req,res)=>{
    db.deleteMovieById(req.params.id)
        .then(result=>{
        res.send(result)
    },err=>{
        res.send(err)
    })
})

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});
