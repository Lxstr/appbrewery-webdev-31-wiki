
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
  }))

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true })

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema)

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });


app.route("/articles")
    .get(function(req, res){
        Article.find(function(err, found){
            if (!err){
                res.send(found)}
            else {
                res.send(err)
            }
        })
    })
    .post(function(req, res){
        const newArticle = new Article ({
            title: req.body.title,
            content: req.body.content,
        })
        newArticle.save(function(err){
            if (!err){
                res.send("Successfully added article")
            } else {
                res.send(err)
            }
        })
    })
    .delete(function(req,res){
        Article.deleteMany({}, function(err){
            if (!err){
                res.send("Deleted all articles")
            } else {
                res.send(err)
            }
        })
    })

app.route("/articles/:title")
    .get(function(req,res){
        Article.findOne({title: req.params.title}, function(err, article){
            if (err) {
                res.send(err)
            } else if (article) {
                res.send(article)
            } else {
                res.send("No articles found matching")
            }
        })
    })

    .put(function(req, res){
        Article.updateOne(
          {title: req.params.title},
          {title: req.body.title, content: req.body.content},
          {overwrite: true},
          function(err){
            if(!err){
              res.send("Successfully updated the selected article.");
            }
          }
        );
      })

    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.title },
            { $set: req.body },
          function(err){
            if(!err){
              res.send("Successfully selectively updated the selected article.");
            }
          }
        );
    })
    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.title },
          function(err){
            if(!err){
              res.send("Successfully deleted the selected article.");
            }
          }
        );
    })