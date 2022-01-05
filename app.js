const express = require("express")
const bodyParser = require("body-parser")
const mysqlConnection = require('./connection')
const app = express()
const bookdir = require('./routes/book')

//creating view engine using ejs
app.set("view engine","ejs")

//takes data as json
app.use(bodyParser.json());

//linking route
app.use("/book", bookdir)

//get request to render ejs file
app.get('/',(req,res)=>{
    res.render("index")
})

//openign connection
app.listen(process.env.port || 3000,()=>{
    console.log("listening on 3000")
})
