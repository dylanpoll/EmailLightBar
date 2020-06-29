const Run = require('emailConnect.js');         //the "model" for our "Post" object
async function runNodeEmail(){await Run();}
while(true){
setTimeout(runNodeEmail,60000);
}//this just deploys the emailer once every minute.