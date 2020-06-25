const express = require('express');             // retrieves the package
const router = express.Router();                //sets up the sub url router
const Scheme = require('../models/LEDscheme.js');         //the "model" for our "Post" object
const fetch = require('node-fetch');
const espLink = process.env.espLINK;
async function ping(URL){
    try{
         await fetch(URL, { method: 'VIEW'});
        }
        catch{
            console.log("LED controll error...");
        }
}
//---------------------------------------
//Post LED color scheme by URL encoding
//---------------------------------------
router.post('/', async (req, res) => {      //this will take a raw JSON body from the NodeMailer bot and turn it into a URL encode
    console.log(req.body);
    const scheme = new Scheme(
        {
            led0: req.body.led0,
            led1: req.body.led1,
            led2: req.body.led2,
            led3: req.body.led3,
            led4: req.body.led4,
            led5: req.body.led5,
            led6: req.body.led6,
            led7: req.body.led7,
            led8: req.body.led8,
            led9: req.body.led9,
            led10: req.body.led10,
            led11: req.body.led11,
            led12: req.body.led12,
            led13: req.body.led13,
            led14: req.body.led14,
            led15: req.body.led15,
            led16: req.body.led16,
            led17: req.body.led17,
            led18: req.body.led18,
            led19: req.body.led19,
            led20: req.body.led20,
            led21: req.body.led21,
            led22: req.body.led22,
            led23: req.body.led23,
            led24: req.body.led24,
            led25: req.body.led25,
            led26: req.body.led26,
            led27: req.body.led27,
            led28: req.body.led28,
            led29: req.body.led29,
        });
        let espcommand;let temp;let URL = new String;
        for(var i = 0;i<=29;i++){                       //change the number 29 to the amount of leds -1 for array slot 0.
            temp = new String("led"+i);
            espcommand= new String("l"+i+"="+req.body.temp);
            URL +=espcommand;
            }
        espcommand = espLink+espcommand;
        ping(URL).then(console.log('scheme is'+(espcommand)));
                    
    console.log('scheme has been sent');
    try {
        const sentScheme = await scheme.save()
        res.json(sentScheme);
    } catch (err) {
        res.json({ message: err });
    }
});
//routesEND-------------
module.exports = router;