const express = require('express')
const bodyParser = require('body-parser')
const app = express();
let toDo = []
let toDoWork = []
let days = ['Sunday','Monday','Tuesday','Wenesday','Thursday','Friday','Saturday']
let months = ['January','Feburary','March','April','May','June','July','August','September','October','November','December']

app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static('public'))

app.get('/',(req,res) => {
    var today = new Date();
    console.log()
    var currentDay = days[today.getDay()]+", "+months[today.getMonth()]+" "+today.getDate();
    res.render('list',{
        kindOfDay:currentDay,
        newListItems:toDo
    })
})
app.get('/work',(req,res) => {
    res.render('list',{
        kindOfDay:'WORK',
        newListItems:toDoWork
    })
})
app.post('/',(req,res)=>{
    if(req.body.newItem.length != 0){
        console.log(req.body.newItem.value );
        if(req.body.newNodebtn === "WORK"){
            toDoWork.push(req.body.newItem);
            res.redirect('/work')
        }
        else{
            toDo.push(req.body.newItem);
            res.redirect('/')
        }
    }
   
    
})


app.listen(5100,() =>{
    console.log("Server Started...");
})