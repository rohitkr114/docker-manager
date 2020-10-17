var express = require('express');
var path = require('path');
var querystring = require('querystring');
var http = require('http');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var port = "5000";
var url1 = "http://192.168.0.132";

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',function(req,res){
	res
        .status(200)
		.sendFile(path.join(__dirname,"main.html"));
});

app.get('/webtty',function(req,res){
  res
        .status(200)
    .sendFile(path.join(__dirname,"terminal.html"));
});

app.get('/index',function(req,res){
    res
        .status(200)
        .sendFile(path.join(__dirname,"index.html"));
})

app.post('/list_running_containers',function(req,res){
    var request = require('request');
    request(url1+":"+port+"/containers/json", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var message = body;
        console.log(message);
      }
      res.json({message: message});
    });
});


app.post('/list_available_images',function(req,res){
    var request = require('request');
    request(url1+":"+port+"/images/json", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var message = body;
      }
      res.json({message: message});
    });
});

app.post('/list_all_containers',function(req,res){
    var request = require('request');
    request(url1+":"+port+"/containers/json?all=1", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var message = body;
      }
      res.json({message: message});
    });
});

app.post('/stop_container',function(req,res){
    var request = require('request');
    request.post(url1+":"+port+"/containers/"+req.body.id+"/stop", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var message = "Done";
      }
      res.json({message: message});
    });
});

app.post('/start_conatiner',function(req,res){
    var request = require('request');
    request.post(url1+":"+port+"/containers/"+req.body.id+"/start", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var message = "Done";
      }
      res.json({message: message});
    });
});

app.post('/restart_container',function(req,res){
    var request = require('request');
    request.post(url1+":"+port+"/containers/"+req.body.id+"/restart", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var message = "Done";
      }
      res.json({message: message});
    });
});

app.post('/get_container_logs',function(req,res){
    var request = require('request');
    request(url1+":"+port+"/containers"+req.body.id+"/logs?stderr=1&stdout=1&timestamps=1", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var message = body;
      }
      var decode = JSON.stringify(message);
      function splitStr(str) { 
        var string = str.split("exit");
        res.json({string: string}); 
      }
      splitStr(message);
    });
});

app.post('/terminal_command',function(req,res){
    var post_data = {
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      Cmd: ["bash","-c",req.body.command]
    };
    
    request({
      url: url1+":"+port+"/containers/"+req.body.container_id+"/exec",
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",  
      },
      body: post_data
    }, function (error, response, body){
      if(!error){
        var post_data_again = {
          Detach: false,
          Tty: false
        };
        request({
	  url: url1+":"+port+"/exec/"+body.Id+"/start",
          method: "POST",
          json: true,
          headers: {
            "content-type": "application/json",
          },
          body: post_data_again
        }, function(error, response, body){
          if(!error){
            console.log(body);
            res.json({message: body});
          }
          else{
            console.log(error);
          }
        })
      }
      else{
        console.log("ERROR");
        console.log(error);
      }
    });

    /*request.post('http://localhost:5000/containers/'+req.body.container_id+'/exec',
      {
        "AttachStdin": "false",
        "AttachStdout": "true",
        "AttachStderr": "true",
        "DetachKeys": "ctrl-p,ctrl-q",
        "Tty": "false",
        "Cmd": [
          "\"" + command[0] + "\""
        ],
        "Env": [
          "FOO=bar",
          "BAZ=quux"
        ]
      },
      function(error,response,body){
        if(!error&&response.statusCode==201){
          var message = body;
          console.log(body);
        }
        else{
          console.log(error);
          console.log("its a error");
          console.log(response.statusCode);
        }
        /*res.json({message: message});
    })*/
})

app.listen(9001);
console.log("started");
