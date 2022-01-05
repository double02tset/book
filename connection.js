const mysql = require('mysql')

//database credentials //change according to needs
var mysqlConnection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database:"test",
    multipleStatements:true
})

//connecting to DB and checking for err
mysqlConnection.connect((err)=>{
    if(!err){
        console.log('connected')
    }else{
        console.log('failed')
    }
})
//exporting DB
module.exports = mysqlConnection;
