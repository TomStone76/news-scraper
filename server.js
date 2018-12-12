let express = require("express");
let mongoose = require("mongoose");
let axios = require("axios");
let cheerio = require("cheerio");
let handlebars = require("express-handlebars");

let db = require("./models");

let PORT = 3000;

let app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost:27017/scraper", {
    useNewUrl: true
});

var articles = [];

app.get("/scrape", function (req, res) {

    let queryURL = "https://content.guardianapis.com/search?api-key=1b6b0b3e-aff4-49b8-8b06-0ab3892d3e4d ";

    axios.get(queryURL).then(function (response) { //find news api key
        console.log(response);
        let $ = cheerio.load(response);

        $("article h2").each(function (i, element) {
            let result = {};
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");ç

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

        res.send("Scrape Complete");
    });
});

//app.get("/")

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.render("index", dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({
            _id: req.params.id
        })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err)
        });
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

//pull defs out
//define another app.get route for root