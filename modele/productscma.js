const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//creating schema to product DB
const productSchema = new Schema({
    _id:Schema.Types.ObjectId,
    productName:{
        type:String,
        required:true,
        unique:true
    },
    qtyPerUnit:{
        type:Number,
        required:true
    },
    unitPrice:{
        type:Number,
        required:true
    },
    unitInStock:{
        type:Number,
        required:true
    },
    discontinued:{
        type:Boolean,
        required:true
    },
    categoryId:{
        type: Schema.Types.ObjectId, 
        ref: 'Category'
    }
})
//creating schema to category DB
const categorySchema = new Schema({
    _id:Schema.Types.ObjectId,
    categoryName:String
})

const Product = mongoose.model('Product',productSchema)
const Category = mongoose.model('Category',categorySchema)

//exporting modele
module.exports= {Product,Category}

