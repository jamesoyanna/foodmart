const express = require("express");
const cors = require("cors");
//const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require('helmet')

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.disable('x-powred-by')
app.use(express.static(path.join(__dirname, "../admin/public")));
app.use(helmet());

app.use(mongoSanitize());
app.use(compression());
app.use(cookieParser());
app.use(cors({origin: true, credentials: true}));

app.use(express.json({limit: "1gb", parameterLimit: 50000 }));
app.use(express.urlencoded({limit:"1gb", extended: true, parameterLimit: 50000}))

// Db connection

app.get('/', (req, res) => {
    res.send("market backend")
})

app.listen(port, () => {
    console.log("Server is listening on port " + port)
})