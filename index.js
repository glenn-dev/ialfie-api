const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const router = require('./router')
// const seed = require('./db/seed')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

router(app)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
