console.log("Web serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router");
// MongoDB chaqirish
const db = require("./server").db();
const mongodb = require("mongodb");

// 1: Kirish kodlari.
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 2 Session larga bog'liq bo'lgan codelar yoziladi

// 3 View code
app.set("views", "views");
app.set("view engine", "ejs");

// 4 Routing code
app.use("/", router);

module.exports = app;
