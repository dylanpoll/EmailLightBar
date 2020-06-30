# EmailLightBar
this currently is being built, the only remaining issue is with the email scanning system. it is over scanning and erasing old results.<br>
I plan to work this from a ESP32 down to a ESP01 in the future.<br>
and listening for windows push notifications and using those as ques for light animations<br>
last future expansion will be to default back to the old LED scheme state after ending that animation, this will be done by recording the state and pushing the animation as a temporary state and setting it back to the original upon completion.<br>
<br> 
this is a LED light bar that increments LEDs for designated senders and by designated colors for those senders. I use this for work and school to know when a important email has been sent.they need to be individually addressable.
an example is...
lets say you have a 10 LED strip, you start out with 1 unread designated email and it is red, the first LED on the strip turns on and is red.
you get a second email from a designated sender and its blue, if the first led lit up from the right most side, the red diode would move over one and the blue would be inserted in its place. if it exceeds 10 it will forget the oldest one.
if you read a email, it will remove only that one color from its location in the led strip and move the diodes back one if you don't have a million unread, if you do it pushes an olderone back up.
<br>
<br>
This program uses a .env file to store credentials safely to prevent accidental uploads containing important information.<br>
you will need to make a .env filr and use the following in it to make using this easier, otherwise, edit out the code where you see "process.env"
<br>
<br>
<br>
EMAIL_USER=<br>
EMAIL_PASS=<br>
WORK_EMAIL=<br>
SCHOOL_EMAIL=<br>
BILL_EMAIL=<br>
REST_SERVER=<br>
ESP_IP=<br>
DB_CONNECTION=<br>
