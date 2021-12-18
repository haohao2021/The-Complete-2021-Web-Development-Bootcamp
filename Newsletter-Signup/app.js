//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  
  const jsonData = JSON.stringify(data);
  
  const url = "https://us5.api.mailchimp.com/3.0/lists/c95776cd7d";
  
  const options = {
    method: "POST",
    auth: "haohao:683b033bfb6af5a3eb65401e9771de54-us5"
  };
  
  const request = https.request(url, options, function(response){
    
    if (response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    } else {
      res.sendFile(__dirname+"/failure.html");
    }
    
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  });
  
  request.write(jsonData);
  request.end();
  
  console.log(firstName, lastName, email);
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 4000, function(){
  console.log("Server is running on port 4000.");
});


//api key
//683b033bfb6af5a3eb65401e9771de54-us5

//id 
//c95776cd7d