const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000

app.use(cors({
    origin: 'http://localhost:3000/'
  }));
  
  app.get('/', (req, res) => {
    res.send('CORS solved')
  })

app.post('/upload', (req, res) => {
    console.log(req.body);
    res.send('POST request to the homepage')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})