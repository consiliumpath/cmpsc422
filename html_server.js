/*----------------------
	Paul Lee
	CMPSC 421
	Assignment 4
	April 7, 2017
	Description: For this assignment you will use Node.js to write an HTTP server that fetches the POST data 
	sent to it via a form, writes the form data to a text file, and displays the form data in a Web page, 
	appropriately labeled and nicely formatted.
-----------------------*/	

//Need this for MongoDB
var MongoClient = require('mongodb').MongoClient;

//Load the filesystem (fs) module. 
var fs = require("fs");

//We need this to use the HTTP server and client.
var http = require('http');

//This module is used for parsing/formatting URL query strings.
var qs = require('querystring');

//Url/dbase name 
var dBase = 'simpleFormDB_2'; 
var url = 'mongodb://localhost:27017/' + dBase;

//This function handles the request, very similar to the example given in class.
//Using form_processing_server_v1_5.js from Lecture 8, server 2. 
function handle_request(request, response){
	
	//Current date/time
	var d = new Date();
	var date_formatted = d.toLocaleString();	
	
	
    var body = '';
    request.on(
        'readable',
        function () {
            var d = request.read();
            if (d) {
                if (typeof d == 'string') {
                    body += d;
                } else if (typeof d == 'object' && d instanceof Buffer) {
                    body += d.toString('utf8');
                }
            }
        }
    );
    request.on(
        'end',
        function () {		
			
			//Variables I need to output to the page
			var formName = "", name = "", comments = "", email = "",
				howtosite = "", thingsliked = "", rating = "";
				
            if (request.method.toLowerCase() == 'post') {
                var POST_data = qs.parse(body);
				
				//Grabbing the needed ata from POST_data
				formName = POST_data.formName.toString();
				name = POST_data.name.toString();
				comments = POST_data.comments.toString();
				email = POST_data.email.toString();
				//Check whether or not the field is null
				if(POST_data.thingsliked == null){
					thingsliked = "(None)";
				}else{
					thingsliked = POST_data.thingsliked.toString();
				}	
				howtosite = POST_data.howtosite.toString();
				rating = POST_data.rating.toString();
				
				
				//Write the JSON object to a file asynchronously as text.
				fs.appendFile('input.txt', JSON.stringify(POST_data)+"\r\n", function(err){
					if (err) {
						return console.error(err);
					}
					console.log("Succesfully appended.");
				});
            }

            response.writeHead(200, { 'Content-Type': 'text/plain' });
			response.end("Form Recieved:\n\n\t" + date_formatted + "\n\n" 
						+ "Form Completed:\n\n\t" + formName + "\n\n"
						+ "Summary of Responses:\n\n"
						+ "\tName: " + name + "\n"
						+ "\tComments: " + comments + "\n"
						+ "\tE-mail: " + email + "\n"
						+ "\tWhat you liked about the Web page: " + thingsliked + "\n"
						+ "\tHow you found the Web page: " + howtosite + "\n"
						+ "\tHow you rated the Web page: " + rating + "\n\n"
						+ "Thank you for the response!");
        }
    );	
}

var server = http.createServer(handle_request);
server.listen(8080);
