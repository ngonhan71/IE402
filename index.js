const express = require("express")
const cors = require('cors')
const app = express()
require('dotenv').config()

const whitelist = ['http://localhost:3000']
const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }
app.use(cors(corsOptions))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

const authRouter = require('./routes/auth.router')
const symbolRouter = require('./routes/symbol.router')
const provinceRouter = require('./routes/province.router')
const pointRouter = require('./routes/point.router')
const locationRouter = require('./routes/location.router')

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/symbol", symbolRouter)
app.use("/api/v1/province", provinceRouter)
app.use("/api/v1/point", pointRouter)
app.use("/api/v1/location", locationRouter)

const PORT = 5000

app.listen(PORT, () => {
    console.log("Server OK - > 5000")
})

