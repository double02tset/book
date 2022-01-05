const express = require('express')
const Router = express.Router();
const multer = require('multer')
const path = require('path')
const mysqlConnection = require("../connection")

let book_image;

//defining distination and file to store image
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'images')
    },
    filename: (req,file,cb)=>{
        book_image = Date.now()+path.extname(file.originalname)
        cb(null,book_image)
    }
})

const upload = multer({storage: storage})

//get request to fetch all books
Router.get("/",(req,res)=>{
    mysqlConnection.query("SELECT book_title FROM books",(err,result)=>{
        if(!err){
            res.send(result)
        }
    })
})

//get request to fetch specific book by providing id
Router.get("/:id",(req,res)=>{
    mysqlConnection.query("SELECT book_title FROM books WHERE book_id =?",[req.params.id],(err,result)=>{
        if(!err){
            res.send(result)
        }
    })
})

//post request to store book in DB
Router.post("/",upload.single('image'),(req,res)=>{
    if(req.body.book_id && req.body.book_title && book_image){
        let sqlq ="INSERT INTO books (book_id, book_title, book_image) VALUES ?";
        let values =[[req.body.book_id,req.body.book_title,book_image]];
        mysqlConnection.query(sqlq,[values],(err,result)=>{
            if(err){
                return res.send(err.sqlMessage)
            }else{res.send("done")}
        })
    }else(res.send("please provid necessary information"))
})

//put request to update book title by taking book id //not good method to update image
Router.put("/",(req,res)=>{
    if(req.body.book_id && req.body.book_title){
        let new_book_title = req.body.book_title;
        let sqlq = "UPDATE books SET book_title=? WHERE book_id =?";
        mysqlConnection.query(sqlq,[new_book_title,req.body.book_id],(err,result)=>{
            if(!err){
                res.send("updated")
            }
        })
    }else(res.send('provid id and title'))
    
})

//delete request to delete book by taking id
Router.delete("/:id",(req,res)=>{
    mysqlConnection.query("DELETE FROM books WHERE book_id =?",[req.params.id],(err,result)=>{
        if(!err){
            res.send("deleted success")
        }
    })
})
//exporting route
module.exports = Router;
