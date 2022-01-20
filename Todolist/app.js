const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const date = require(__dirname+ "/date.js")


const app = express()
const port = 3000
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static("views"));




let items=["Buy Food", "Cook Food", "Eat Food"]
let works=[]
app.get('/', (req, res) => {
  let today = date.getDate()

  res.render("list", {list_title: today, new_list_items: items})
})


app.post("/", function(req, res) {
  console.log(req.body)
  let item = req.body.new_item
  if (req.body.button === "Work"){
    works.push(item)
    res.redirect("/work")
  }else{
    items.push(item)
    res.redirect("/")
  }
})



app.get("/work", function(req, res) {
  res.render("list", {list_title: "Work List", new_list_items: works})
  
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })