const express = require("express");
const cors = require("cors")
const mongoose = require('mongoose')

//Importing routes
const animeRouter = require("./Routes/Animes");
const userRouter = require("./Routes/User");
const authRouter = require('./Routes/Auth')

require("dotenv").config({path: '.env'})
// console.log(process.env.PORT);

const PORT = process.env.PORT || 5000;
const app = express();
const URI = process.env.URI;

mongoose.connect(
  URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => console.log("connected to the database")
);


app.use(express.json());
app.use(cors())


//Route Middleware
app.get("/", (req, res) => {
  res.send("Listening");
});

app.use("/anime", animeRouter)

app.use("/user", userRouter)

app.use('/auth',authRouter)

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    });
  });

  
app.listen(PORT, () => 
console.log(`listening on http://localhost:${PORT}`));