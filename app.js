import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import { fileURLToPath } from 'url';
import {dirname} from 'path';
import router from './src/route/index.js';
import ngrok from 'ngrok';
import {updateUrl} from './src/controller/prices/prices.js'
//import cors from "cors";
//import { fileURLToPath } from "url";
//import { dirname } from "path";
//import router from "./src/route/index.js";
import { Server as socketIO } from 'socket.io';
import http from "http";
import hbs from 'hbs'; 
 
// import initializeSocket from "../astrolgyserver/src/controller/message/message.js";
import initializeSocket from "./src/controller/message/message.js"
import CustomField from "./src/model/customField/custommFIeld.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();
const url = process.env.DBURL;

mongoose
  .connect(url)
  .then(async () => {
    console.log("db connected");
    // CustomField.create({
    //   fieldBelongs: "User",
    //   fieldName: "fieldName",
    //   fieldType: ["Inputs", "Numbers"],
    //   // fieldType: [{ type: "Inputs" },{ type: "Numbers" }],
    //   fieldValues: ["option1", "option2"],
    //   grid: 6,
    // });
  }) 
  .catch((error) => {
    console.log("not Connected", error);
  });
  app.set('view engine', 'hbs');
  app.set('views', '/views');
app.use(express.static(__dirname + "/src"));
app.use(cors());


const port = process.env.PORT || 5000;
app.listen(port, async() => {
  console.log(`server is running port number ${port}`);
});

app.use(express.json());

app.use("/astrology", router);

const server = http.createServer(app);

initializeSocket(server);


server.listen(3001, () =>{
  console.log('Socket.IO server listening on port 3001');
})
// -- //

 