const http = require("http");
console.log("Web serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router");
const router_bssr = require("./router_bssr");
const cors = require("cors");
const cookieParser = require("cookie-parser");

let session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session); //mongoDB storagesini hosil qilishda yordam beradi. uni ichiga express - sessionni beramiz. MongoDb Storage bu class.

const store = new MongoDbStore({
  uri: process.env.MONGO_URL,
  collection: "sessions", //shu nom bilan mongodb collection hosil boladi.
});

// 1: Kirish kodlari.
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //formdan post qilingan narsalarni express qabul qiladi.
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

// 2 Session larga bog'liq bo'lgan codelar yoziladi Requestni ichida sessionlarni hosil qilib beradi.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60, //for 60 minutes
    },
    store: store, //mongodb da yuqoridagi sessions collectionida saqlasin
    resave: true,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.locals.member = req.session.member; //response= locals vari ichidagi member vari ga session memberni yukla. sessionni databasedan izlaydi bolsa memberga yuklab beradi yopishtirib.
  next();
});

// 3 View code
app.set("views", "views");
app.set("view engine", "ejs");

// 4 Routing code
app.use("/resto", router_bssr); //for  BSSR
app.use("/", router); // for restAPI ::: har qanday kelgan requestni router filega yubor;

const server = http.createServer(app); // single thread shu yerda
// SOCKET.IO BACKEND SERVER
const io = require("socket.io")(server, {
  serveClient: false,
  origins: "*:*",
  transport: ["websocket", "xhr-polling"],
});

let online_users = 0;
io.on("connection", function (socket) {
  online_users++;
  console.log("New user, total:", online_users);
  socket.emit("greetMsg", { text: "welcome" });
  io.emit("infoMsg", { total: online_users });
  socket.on("disconnect", function () {
    online_users--;
    socket.broadcast.emit("infoMsg", { total: online_users });
    console.log("client disconnected, total:", online_users);
  });

  socket.on("createMsg", function (data) {
    console.log(data);
    io.emit("newMsg", data);
  });
  // socket.emit() // faqatgina ulangan odamga junatilgan xabar
  // socket.broadcast.emit()// ulangan userdan tashqari qolgan userlarga jo'natiladigan xabar
  // io.emit()//hammage
});
module.exports = server;
