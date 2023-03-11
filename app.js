const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose')
const _ = require('lodash')
mongoose.connect('mongodb://127.0.0.1:27017/toDo')
let toDo = []
let toDoWork = []

let days = ['Sunday','Monday','Tuesday','Wenesday','Thursday','Friday','Saturday']
let months = ['January','Feburary','March','April','May','June','July','August','September','October','November','December']
const today = new Date();
const currentDay = days[today.getDay()]+", "+months[today.getMonth()]+" "+today.getDate();
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static('public'))

const itemSchema = new mongoose.Schema({
    task:String
})

const listSchema = new mongoose.Schema({
    name:String,
    items:[itemSchema]
})

const Item = new mongoose.model('Item',itemSchema);
const List = new mongoose.model('List',listSchema);
const t1 = new Item({
    task:"Welcome to ToDoList"
})
const t2 = new Item({
    task:"<---Hit this to delete"
})
const t3 = new Item({
    task:"click + to add "
})
const defaultCollection = [t1,t2,t3]


app.get('/',(req,res) => {

    Item.find({}).then((task) =>{
        if(task.length===0){
            Item.insertMany(defaultCollection).then(()=>{
                ////console.log()("data inserted")
            })
        }
        res.render('list',{ 
            kindOfDay:currentDay,
            newListItems:task,
            today:true
        })
    })
   
})

app.post('/',(req,res)=>{
    if(req.body.newItem.length != 0){
        const newItem = req.body.newItem
        const listName = req.body.newNodebtn
        const tUser = new Item({
            task:newItem
        })

        if(listName === 'today'){
            tUser.save()
            res.redirect('/')
        }
        else{
            ////console.log('Saving in main' + listName)
            ////console.log('Saving in main' + currentDay)

            auth(listName) 
            async function auth(listName) {
            
                try{
                    const fList = await List.findOne({name:listName}).exec();
                        ////console.log(fList)
                        fList.items.push(tUser)
                        fList.save()
                        res.redirect('/'+listName)
                        // if Found   
                    }
                    catch(e){
                       
                        ////console.log(e)
                    }       
              }
        }
    }
   
    
})
function deleteElement(id){

}
app.post('/delete',(req,res) =>{
    const lName = req.body.ListName
    //console.log(lName)
    if(lName=='today'){
        setTimeout(()=>{
            Item.findByIdAndRemove(req.body.checkbox).then(() => {
                res.redirect('/')
        })
        },500)
    }
    else{
        auth(lName) 
        async function auth(listName) {
        
            try{
                const fList = await List.findOneAndUpdate({name:listName},{$pull:{items:{_id:req.body.checkbox}}}).exec();
                    ////console.log(fList+" removed")

                    res.redirect('/'+listName)
                    // if Found   
                }
                catch(e){
                   
                    //console.log(e)
                }       

    }
}

})

app.get('/:listName',(req,res) => {
    const listName = _.capitalize(req.params.listName)
    auth(listName) 
    async function auth(listName) {
        try{
            const fList = await List.findOne({name:listName}).exec();
            if(!fList){
                ////console.log("not Found")
                const list = new List({
                    name:listName,
                    items:defaultCollection
                })
                list.save();
                res.redirect('/'+listName)
            }
            else{
                ////console.log(fList)
                res.render('list',{
                    kindOfDay:listName,
                    newListItems:fList.items,
                    today:false
                })
                // if Found
            }
            }
            catch(e){
               
                ////console.log(e)
            }       
      }
       
   
})

app.listen(5100,() =>{
    ////console.log("Server Started...");
   
})