// @ts-nocheck
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { title } = require("process");


const app = express();
const PORT = process.env.PORT || 3000;


//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));


// Connexion MongoDB Atlas
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("MongoDB Atlas connectéé")).catch(err=>console.log("Erreur MongoDB:", err));

// Schémas
const itemSchema = new mongoose.Schema({
    titre: {type: String, required: true},
    description: {type: String},
    image: {type: String},
    lien: {type: String},
    fichier: {type: String},
    type: {
        type: String,
        enum: ["cv", "graphisme", "web"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const messageSchema = new mongoose.Schema({
    name: String,
    nom: String,
    email: String,
    message: String,
    content: String,
    sujet: String,
    subject: String,
    lu: {type: Boolean, default: false},
    repondu: {type: Boolean, default: false},
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Item = mongoose.model("Item", itemSchema);
const Message = mongoose.model("Message", messageSchema);

// Routes Items
app.get("/api/items", async (req, res)=>{
    const items = await Item.find().sort({createdAt: -1});
    res.json(items);
});

app.post("/api/items", async (req, res)=>{
    const newItem = new Item(req.body);
    await newItem.save();
    res.json({success: true, item: newItem});
});

app.delete("/api/items/:id", async (req, res)=>{
    await Item.findByldAndDelete(req.params.id);
    res.json({success: true});
});

// Routes messages
app.get("/api/messages", async (req, res)=>{
    const messages = await Message.find().sort({createdAt: -1});
    res.json(messages);
});

app.post("/api/messages", async (req, res)=>{
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.json({success: true});
});

app.delete("/api/messages/:id", async (req, res)=>{
    await Message.findByldAndDelete(req.params.id);
    res.json({success: true});
});

// Route de connexion Admin
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  console.log("Tentative de login avec:", password);

  // Mets ici ton mot de passe admin. Tu peux le changer
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "davidmotdepasse";

  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: "Connecté" });
  } else {
    return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
  }
});

app.listen(PORT, () => {
  console.log("Serveur lancé sur https://backend-david-1.onrender.com");
});

