let express = require("express");
let mongoose = require("mongoose");
let axios = require("axios");
let cheerio = require("cheerio");
let handlebars = require("express-handlebars");

let db = require("./models");

let PORT = 3000;

let app = express();

app.use(express.urlencoded({ extended: true });
app.use(express.json());
app.use(express.statis("public"));

mongoose.connect("MONGODB PATH HERE", { useNewUrl: true });

app.get("/scrape", function(req, res) {
    axios.get("http://www.bbc.com/news").then(function(response) {
        let $ = cheerio.load(response.data);
        $("article h2").each(function(i, element) {
            