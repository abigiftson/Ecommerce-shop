require('dotenv').config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

// Import Routes
const ProductRouter = require("./routes/product");
const userRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");
const authRouter = require("./routes/auth");

app.use(cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders:
      "Content-Type, Authorization, Origin, X-Requested-With, Accept",
  })
);

// Use Routes
app.use('/api/products', ProductRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);


app.post('/api/orders', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  // Handle the request...
});
// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(createError(404));
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    
  next();
});

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });



module.exports = app;
