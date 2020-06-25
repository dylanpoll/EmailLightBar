//Imap - Email imports
require('dotenv/config');
var Imap = require('imap'),
inspect = require('util').inspect;
const simpleParser = require('mailparser').simpleParser;
var fs = require('fs');
const fetch = require('node-fetch');
const link = process.env.REST_SERVER;//link to rest api

async function ping(JSONbody){
  const rawResponse = await fetch(link+'/emaillight/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({JSONbody})
  });
  const content = await rawResponse.json();
  console.log(content);
}
//Imap login + connection info
var imap = new Imap({
    user: process.env.EMAIL_USER, //username
    password: process.env.EMAIL_PASS,            //password
    host: 'imap.gmail.com',                  //email provider imap server
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
});
//function to open the Inbox folder of the email account
function openInbox(cb) {
    imap.openBox('INBOX', false, cb);
}
//Connecting to the server
imap.once('ready', function() {
  var colorSchemeArray = []; var i; var color;
  i = 0;
    openInbox(function(err, box) {
      if (err) throw err;
      console.log(box.messages.total + ' message(s) found!');
      var f = imap.seq.fetch('1:500', {               //searches last 500 messages starting from the first message
        bodies: ''
      })
      f.on('message', function(msg, seqno) {
            msg.on('body', function(stream, info) {      
              simpleParser(stream, (err, mail) => { 
                if (!(mail.text === undefined)){    //making sure the text isn't undefined
                  for(let totalEmails = 0; totalEmails<=500;totalEmails++){
                    if(i<= 29){                    //total amount of LED's
                          if(mail.text.includes(process.env.WORK_EMAIL)){
                            color = new String("led"+i+" : \"r\"");
                            color.push(colorSchemeArray[i]); //doing something when you get a hit
                            i++
                          }
                          else if(mail.text.includes(process.env.SCHOOL_EMAIL)){
                            color = new String("led"+i+" : \"B\"");
                            color.push(colorSchemeArray[i]);
                            i++
                          }
                          else if(mail.text.includes(process.env.BILL_EMAIL)){
                            color = new String("led"+i+" : \"g\"");
                            color.push(colorSchemeArray[i]); 
                            i++
                          }
                      }
                    }
                    let JSONbody = new String;
                    for(i = 0; i<=29;i++){
                      if(i != 0 && i != 29){
                        JSONbody += String(",");
                      }else{
                      JSONbody += String(colorSchemeArray[i]);
                      }
                  }
                      ping(JSONbody);//sends the json body to the rest
                  }
              })
            })
             msg.once('end', function() {
            //console.log(prefix + 'Finished');
        })
      })
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      })
      f.once('end', function() {
        console.log('Done fetching all messages!');
        console.log(numHits + ' emails matching your search criteria')//printing number of hits 
        imap.end();
        process.exit();//exits program
      })
    })
  })
imap.connect();