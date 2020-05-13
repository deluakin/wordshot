const express = require("express")
const fs = require("fs")

express.json()
const app = express()

const PORT = 3001
app.listen(PORT, () => {
    console.log("Server running...")
})

app.get("/score/get", (req, res) => {
    const data = fs.readFileSync("score.txt");
    let score = data.toString()

    res.json({
        "score": score
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