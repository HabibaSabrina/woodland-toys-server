const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middlewire
app.use(cors())
app.unsubscribe(express.json())

app.get('/',(req,res)=>{
    res.send("toy server is running")
})

app.listen(port, ()=>{
    console.log(`Running on port ${port}`)
})