//Imap - Email imports
require('dotenv/config');
var Imap = require('imap'),
inspect = require('util').inspect;
const simpleParser = require('mailparser').simpleParser;
var fs = require('fs');

//Imap login + connection info
var imap = new Imap({
    user: process.env.EMAIL_USER, //username
    password: process.env.EMAIL_PASS,            //password
    host: 'imap.gmail.com',                  //email provider imap server
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
});
var i;
    var arrayTerms = fs.readFileSync('searchTerms.env').toString().split("\n");
    for(i in arrayTerms) {
        console.log(arrayTerms[i]);
        }

var searchTerms = [0] 
    for(i = 0;i<= arrayTerms.length;i++){
        searchTerms.push(arrayTerms[i]);
    }
var numHits = 0; //number of hits for target phrase in email

//function to open the Inbox folder of the email account
function openInbox(cb) {
    imap.openBox('INBOX', false, cb);
}

//Connecting to the server
imap.once('ready', function() {

    

    openInbox(function(err, box) {
      if (err) throw err;
      console.log(box.messages.total + ' message(s) found!');
      // 1:* - Retrieve all messages
      // 3:5 - Retrieve messages #3,4,5
      var f = imap.seq.fetch('1:500', { //searches last 500 messages
        bodies: ''
      });
      f.on('message', function(msg, seqno) {
        
            //var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
              // using simpleParser       
              simpleParser(stream, (err, mail) => {
                //Doing something when email text contains certain phrase
                if (!(mail.text === undefined)){ //making sure the text isn't undefined
                    for (term in searchTerms){ //looping through array of search terms
                        if(mail.text.includes(term)){
                            numHits += 1; //doing something when you get a hit
                        };
                    };
                };
              });
            });
     
        msg.once('end', function() {
            //console.log(prefix + 'Finished');
        });

      });
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
        console.log('Done fetching all messages!');
        console.log(numHits + ' emails matching your search criteria')//printing number of hits 
        imap.end();
        process.exit();//exits program
      });

    });
  });


imap.connect();