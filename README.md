# EmailLightBar

THIS PROJECT IS ON HIATUS AT THE MOMENT. 
The code that was originally being used for this I have been improving and using in my cloud controller project and have no immediate intention to work on the email bot at current. at the moment the API that was in this project is not anywhere near as usable as it is currently with the changes made in the new project. I plan to revise this soon and finalize the email bot and eventually factor that into the cloud controller project but also update this as a seperate entity so it can run stand alone. 

currently, due to the nature of being able to dynamically map leds from querries I have been using this to handle lighting in my house with that application and have added in additional routes for different ways to assign and handle color assignment/animations. This project exists so I do not have to actively plug in my ESP to a computer to change animation cycles, a feat you can reach with OTA workflows and ESP Home. This just avoids re programming as its assignment by querry and not by the written code on the ESP itself and has a lot of work till its optimized well enough to warrant attention.

ORIGINAL README BELOW-will update when time presents itself.


![alt text](https://github.com/dylanpoll/EmailLightBar/blob/master/Untitled.png?raw=true)
this currently is being built, the only remaining issue is with the email scanning system. it is over scanning and erasing old results.<br>
I plan to work this from a ESP32 down to a ESP01 in the future.<br>
and listening for windows push notifications and using those as ques for light animations<br>
last future expansion will be to default back to the old LED scheme state after ending that animation, this will be done by recording the state and pushing the animation as a temporary state and setting it back to the original upon completion.<br>
<br> 
to turn off the led strip all you need to do is send it a schema to turn all the lights black, this is how neopixel indicates "off"
<br>
<br>
this is a LED light bar that increments LEDs for designated senders and by designated colors for those senders. I use this for work and school to know when a important email has been sent.they need to be individually addressable.<br>
an example is...<br>
lets say you have a 10 LED strip, you start out with 1 unread designated email and it is red, the first LED on the strip turns on and is red.
you get a second email from a designated sender and its blue, if the first led lit up from the right most side, the red diode would move over one and the blue would be inserted in its place. if it exceeds 10 it will forget the oldest one.<br><br>
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
<br><br>
the current plan for this design is as follows
![alt text](https://github.com/dylanpoll/EmailLightBar/blob/master/lightbar%20displayed%20led%20scheme.png?raw=true)
