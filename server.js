const express = require('express')//import API functionality
const app = express()
const mongoose = require('mongoose')//import DATABASE functionlity
const {Product, Category} = require('./modele/productscma')//import DATABASE schema

//connecting DB by giving DB url
mongoose.connect('mongodb://localhost/store',{useNewUrlParser: true})
const db = mongoose.connection

//handling DB connection error
db.on('error',(err)=>{
    console.log(err)
})

//take json data
app.use(express.json())

//post method to create product and category
app.post('/create',async (req,res)=>{
    try{
        if(req.body.select=="product"){
            const product = new Product({
                _id: new mongoose.Types.ObjectId(),
                productName:req.body.productName,
                qtyPerUnit:req.body.qtyPerUnit,
                unitPrice:req.body.unitPrice,
                unitInStock:req.body.unitInStock,
                discontinued:req.body.discontinued,
                categoryId:req.body.categoryId
            })
            const newproduct = await product.save()
            res.status(200).send(`new product created by id ${newproduct._id}`)
        
        }else if(req.body.select=="category"){
            const category = new Category({
                _id:new mongoose.Types.ObjectId(),
                categoryName:req.body.categoryName
            })
            const newcategory = await category.save()
            res.status(200).send(`new category is created by id: ${newcategory._id}`)
        }else{throw new Error("select product of category")}
    }catch(err){
        res.status(500).json({message: err.message})
    }
})
//get request to read specific product by taking product _id as params
app.get('/read/:pid', (req,res)=>{
    Product.findOne({"_id":req.params.pid}).populate('categoryId').exec((err,result)=>{
        res.json(result)
    })
})
//get request to read all products
app.get('/readall',(req,res)=>{
    Product.find().populate('categoryId').exec((err,result)=>{
        res.json(result)
    })
})
//update product information by taking product _id as params
app.put('/update/:pid',findproduct,async(req,res)=>{
    if(req.body.productName!=null){
        res.foundproduct.productName=req.body.productName
    }
    if(req.body.qtyPerUnit!=null){
        res.foundproduct.qtyPerUnit=req.body.qtyPerUnit
    }
    if(req.body.unitPrice!=null){
        res.foundproduct.unitPrice=req.body.unitPrice
    }
    if(req.body.unitInStock!=null){
        res.foundproduct.unitInStock=req.body.unitInStock
    }
    if(req.body.discontinued!=null){
        res.foundproduct.discontinued=req.body.discontinued
    }
    try{
        const updatedproduct = await res.foundproduct.save()
        res.json({updatedproduct})
    }catch(err){
        res.status(400).json({message:err.message})
    }
})
//delete request to delete product by taking product _id as params
app.delete('/delete/:pid',findproduct,async(req,res)=>{
    try{
        await res.foundproduct.remove()
        res.json({message:"product deleted"})
    }catch(err){
        res.json({message:err.message})
    }
})
//creating middleware to find product by _id
async function findproduct(req,res,next){
    let foundproduct
    try{
        foundproduct=await Product.findOne({"_id":req.params.pid})
        if (foundproduct == null){
            return res.status(404).json("cannot find product")
        }
    }catch(err){
        return res.status(500).json(err.message)
    }
    res.foundproduct = foundproduct
    next()
}
//start listining after DB is connected
db.once('open', ()=>{
    app.listen('3001',()=>{
        console.log('server started')
    })
})