
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const _ = require("lodash");
const mongoose = require("mongoose")

const app = express()
const port = 3000
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static("views"));



mongoose.connect('mongodb+srv://admin-ttran05:nhan0378798302@cluster0.owi72.mongodb.net/todolistDB', {useNewUrlParser: true});


const items_schema = new mongoose.Schema({
  name: String
})

const Item = mongoose.model("Item", items_schema);


////DEFAULT ITEMS////
const item1 = new Item ({
  name: "Todolist!"
});

const item2 = new Item ({
  name: "Click the + button to add the new item"
});

const item3 = new Item ({
  name: "<--Click this to delete an item"
});
const default_items = [item1, item2, item3];

////CUSTOM LIST ITEM SCHEMA////

const List_schema ={
  name: String,
  items: [items_schema]
}

const List = mongoose.model("List", List_schema)

//////HOME ROUTE/////

app.get("/", function(req, res) {

  Item.find({}, function(err , found_items){
    if (found_items.length === 0){
      Item.insertMany(default_items, function(err){
        if (err){
          console.log(err)
        }else{
          console.log("succesfully add items to DB")
        }
      })
      res.redirect("/")
    }else{
      res.render("list", {list_title: "Today", new_list_items: found_items})
    }
  })

});

/////ADD NEW ITEM/////

app.post("/", function(req, res) {
  const item_name = req.body.new_item
  const list_name = req.body.list
  const item = new Item({
    name: item_name
  })

  if (item_name !== ""){
    if (list_name === "Today"){

      item.save()
      res.redirect('/')
    }else{
      List.findOne({name: list_name}, function(err, found_list){
        found_list.items.push(item)
        found_list.save()
        res.redirect("/"+ list_name)
      })
  
    }
  }



})

/////CUSTOM LIST//////
app.get("/:custom_list_name", function(req, res) {

  const custom_list_name = _.capitalize(req.params.custom_list_name);
  // console.log(custom_list_name)
  List.findOne({name: custom_list_name}, function(err, found_list) {
    // console.log(found_list)
    if (!err) {
      if (!found_list) {

       ////create a new list////
        const list = new List ({
            name: custom_list_name,
            items: default_items
          })

          list.save();
          res.redirect("/" + custom_list_name);
      } else {

      /////Show an existing list////       
      res.render("list", {list_title: found_list.name, new_list_items: found_list.items});
      }

    }
  })
});


///Delete Item///
app.post("/delete", function(req,res){
  const check_id = req.body.checkkbox
  const list_name = req.body.list_name
  console.log(check_id)
  if (list_name === "Today"){
    Item.findByIdAndRemove(check_id, function(err){
      if(err){
        console.log(err)
      }else{
        console.log("Successfully deleted item");
        res.redirect("/");
    
      }
    })

  }else{
    List.findOneAndUpdate({name: list_name}, {$pull: {items: {_id: check_id}}}, function(err, found_list) {
      if(!err) {
        res.redirect("/" + list_name);
      }
    }) 
  }
})




app.get("/about", function(req, res){
  res.render("about");
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
