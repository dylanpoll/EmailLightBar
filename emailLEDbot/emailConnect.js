//Imap - Email imports
require('dotenv/config');
var Imap = require('imap'),
  inspect = require('util').inspect;
const simpleParser = require('mailparser').simpleParser;
var fs = require('fs');
const fetch = require('node-fetch');
const link = process.env.REST_SERVER;                   //link to rest api pulled from the .env
//const espIP = process.env.ESP_IP;                       //uncomment to use the device IP and send straight to your board 
var imap = new Imap({//Imap login + connection info
  user: process.env.EMAIL_USER,                 //username
  password: process.env.EMAIL_PASS,             //password
  host: 'imap.gmail.com',                       //email provider imap server
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
});
//function to open the Inbox folder of the email account
function openInbox(cb) {
  imap.openBox('INBOX', false, cb);
}
//Connecting to the server
imap.once('ready', function () {
  i = 0;
  openInbox(function (err, box) {
    if (err) throw err;
    console.log(box.messages.total + ' message(s) found!');
    //fetches last 500 messages starting from the first message
    var f = imap.seq.fetch('1:500', {
      bodies: ''
    })
    f.on('message', function (msg, seqno) {
      msg.on('body', function (stream, info) {
        //this parses out the bodies of the 500 fetched emails so we can handle them.
         simpleParser(stream, (err, mail) => {
          let colorSchemeArray = []; let color;
          console.log("entered simple parser");
          if (!(mail.text === undefined)) {                                 //making sure the text isn't undefined
          console.log("mail is not null");
            let i = 0;                                                      //i is set to 0 outside the for loop to retain its value within it.                        
            let totalEmails = 0;                                            //this is to track the total amount of emails scanned.
              do{                                                           
                if (mail.text.includes(process.env.WORK_EMAIL)) {           //the value of WORK_EMAIL is pulled from the .env file 
                  i++                                                       // i will only grow when a email matching a sender is found because i
                  console.log("for loop round " + totalEmails + " . i is at : " + i+ "found alorica");
                  color = new String("\"led" + i+"\"" + " : \"r\"");               //constructs a portion of the JSON object
                  let newlength = colorSchemeArray.push(color);             //adds the color value to a array used to construct a JSON body when a match is found.
                }                                                           // is used to limit the size of the json body to as many LEDs being used.
                else if (mail.text.includes(process.env.SCHOOL_EMAIL)) {
                  i++
                  console.log("for loop round " + totalEmails + " . i is at : " + i+ "found valencia");
                  color = new String("\"led" + i+"\"" + " : \"B\"");
                  let newlength = colorSchemeArray.push(color);
                }
                else if (mail.text.includes(process.env.BILL_EMAIL)) {
                  i++
                  console.log("for loop round " + totalEmails + " . i is at : " + i+ "found colonial pointe");
                  color = new String("\"led" + i+"\"" + " : \"g\"");
                  let newlength = colorSchemeArray.push(color);
                }
                if(i == 30){  //if i == 30 that means the JSON body is full. the reason it is 30 is because it goes i++ so when it hits the proper total of 29 it jumps up again.
                  console.log("going to make JSON body");
                  makeJSON(colorSchemeArray);
                } else
                if(totalEmails == 500){
                  console.log("emails are at 500 scanned, turning -off- remaining LEDs");
                  while(i<30){
                    color = new String("\"led" + i+"\"" + " : \"w\"");   //this assigns the dead space to have the LED turned off
                    let newlength = colorSchemeArray.push(color);
                    i++
                  }
                  console.log("check");
                  makeJSON(colorSchemeArray);
                }
              totalEmails++
              }while(i<30)// end of do while loop.
            }//end of for loop
        })//end of simpleParser 
      })//end of msg.on(body)
      msg.once('end', function () {//done reading emails print
       console.log('Finished');
      })//end of .msg.once(end)
    })//end of f.on(msg)
    f.once('error', function (err) {//fetch error print
      console.log('Fetch error: ' + err);
    })//end of f.once(error)
    f.once('end', function () {           //ends the program and prints results
      console.log('Done fetching all messages!');
     // console.log(numHits + ' emails matching your search criteria')
      imap.end();
      process.exit();//exits program
    })//end of f.once(end)
  })//end of openInbox()
})//end of Imap.once()
//this sends the constructed JSON body to the Rest API
async function pingRest(JSONbody){
  try {
    const response = await fetch(link+"/email", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(JSONbody)
    });
  } catch {
    console.log("error");
  }
}//end of pingDirectly()
async function makeJSON(colorSchemeArray){          //makes the JSON body sent to the IOT device
  try {
    let body = `{ \"numleds\" : 30 ,`;                       
    for (i = 0; i <= 29; i++) {                     //the total amount of LEDs on the strip
      if(i != 29){                                  //if i == 0 it adds a comma before putting the next field
        body += (colorSchemeArray[i]);              //adds the value from the colorscheme array as a part of the string body.
        body += (`,`);                              //the last field in a json body shouldn't have a comma and the first
      }else
      if(i == 29){
        body += (colorSchemeArray[i]);
      }
    }//end of for loop
    body += '}';
    var JSONbody =  JSON.parse(body);                        //fills the json o
    console.log("going to post JSON body...");
    await pingRest(JSONbody);                     //sends the json body to the rest on the IOT device
    console.log("posted to device..");
  } catch {
    console.log("error");
  }
}
imap.connect();
/*
//this sends the constructed JSON body to the IOT device directly
async function pingDirectly(URL, JSONbody) {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(JSONbody)
    });
    return response.json();
  } catch {
    console.log("error");
  }
}//end of pingDirectly()
*/