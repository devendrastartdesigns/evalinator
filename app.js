// 1. Include Packages
const express = require('express'); 
const path = require('path');
const cookieParser = require("cookie-parser");
const logger = require('morgan');
const cors = require('cors');


// 2. Include Configuration
require("dotenv").config();

//3. Include routers 
const apiRouter = require("./routers/api");
const apiResponse = require("./helpers/apiResponse");





var app = new express();  
var port = 3010; 
const PORT = process.env.PORT || 5000; 


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//To allow cross-origin requests
app.use(cors());

//To allow cross-origin requests app.use(cors()); //Route Prefixes

app.use("/api/", apiRouter);


app.use(express.static(path.join(__dirname, "client", "build")));


app.get('/', (req, res) => {
  res.send('<h2>This is from index.js file</h2>');
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// throw 404 if URL not found
app.all("*", function(req, res) {
  return apiResponse.notFoundResponse(res, "Page not found");
});


app.use((err, req, res) => {
  if(err.name == "UnauthorizedError"){
    return apiResponse.unauthorizedResponse(res, err.message);
  }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});