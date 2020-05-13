const express = require("express")
const fs = require("fs")
const words = require('word-list-json');

express.json()
const app = express()

const PORT = process.env.PORT || 80
app.listen(PORT, () => {
    console.log("Server running...")
})

app.get("/get", (req, res) => {
    let w = words.filter((word) => word.length === 15)
    const random = Math.floor(Math.random() * w.length - 1)
    const data = fs.readFileSync("score.txt");
    let score = data.toString()

    res.json({
        "score": score,
        "word": w[random]
    })
})

app.get("/score/set", (req, res) => {
    let point = req.query.point
    if(point !== undefined && !isNaN(point) && point > 0){
        fs.writeFileSync("score.txt", point);
        res.status(200).send("ok")
        return;
    }
    res.status(400)
})