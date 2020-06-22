import fs from 'fs';
import express from 'express';
const app = express();
const port = 6500;

app.get('/',(req,res)=>{
    res.send('<h1>Welcome to api For Fs</h1>')
});

app.get('/movies',(req,res) => {
    fs.readFile('db.json',(err,result) => {
        if(err) throw err;
        res.send(JSON.parse(result));   
    })
})

app.get('/mytext',(req,res) => {
    fs.readFile('myText.txt','utf-8',(err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

app.get('/bothops',(req,res) => {
    fs.appendFile('./mytext2.txt','My text read file\n',(err) => {
        if(err) throw err;
        else{
            fs.readFile('./mytext2.txt','utf-8',(err,data) => {
                if(err) throw err;
                res.send(data)
            })
        }
    })

})

app.listen(port,(err)=>{
    console.log(`Server is running on port ${port}`)
})