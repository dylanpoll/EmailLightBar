/*  Made by Dylan Poll
 *  Linkdin : https://www.linkedin.com/in/dylan-poll-4a324a1a2/
 *  Github : https://github.com/dylanpoll/Arduino
 *  this project is something I made for work, it connects with my rest api and uses urlencoding to map out the LED color scheme.
*/
  #include <WiFi.h>
  #include <FastLED.h>
  FASTLED_USING_NAMESPACE
  #define DATA_PIN    9
  #define LED_TYPE    WS2811                  //type of LED is important. wont work the same if it is using analog.
  #define COLOR_ORDER GRB
  #define NUM_LEDS    30
  CRGB leds[NUM_LEDS];
  #define BRIGHTNESS  10        
  #define FRAMES_PER_SECOND  20

  const char* WIFI_NAME= "";                    //your wifi name and password
  const char* WIFI_PASSWORD = ""; 
  WiFiServer server(80);
  String header;
  String LEDSTATE = "off";                    //this controlls the relay
  const int RelayPin = 22;                    //I am using a relay to turn the panel off and on remotely.

void setup() {
    Serial.begin(115200);                     //this is the native speed for a esp32S
    pinMode(RelayPin, OUTPUT);                //relay is a output pin. 
    digitalWrite(RelayPin, LOW);              //starts with relay off
    
    WiFi.begin(WIFI_NAME, WIFI_PASSWORD);     //connects to wifi
    
    while (WiFi.status() != WL_CONNECTED) {   //while it is not connected
        delay(1000);
        Serial.print("connecting...");
      }
    Serial.println("");
    Serial.println("IP address: ");         
    Serial.println(WiFi.localIP());           //your devices subnet IP, use this to connect to it.... so to make it red it would be ("localIP"?color=r)... just viewing the page should turn it red.
    server.begin();
    
    delay(1000); // 1 second delay for recovery
    FastLED.addLeds<LED_TYPE,DATA_PIN,COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
    FastLED.setBrightness(BRIGHTNESS);
    FastLED.delay(1000/FRAMES_PER_SECOND);
  }//end setup
  
void loop(){
    WiFiClient client = server.available(); 
    if (client) { 
        String current_data_line = ""; 
          while(client.connected()) { 
            if (client.available()) { 
              char new_byte = client.read(); 
              header += new_byte;
                if (new_byte == '\n') { 
                  if (current_data_line.length() == 0) 
                    {
                      client.println("HTTP/1.1 200 OK");
                      client.println("Content-type:text/html");
                      client.println("Connection: close");
                      client.println();

                      //this for loop just makes this setup a little bit easier. cycles through all the url encoded fields.
                      for(int i = 0; i < NUM_LEDS; i++){                          //if you change from num leds, account for 0 and make it <=
                        String encodedField = "l";
                        encodedField += i;
                        encodedField += "=";
                        String diodeColor = "b";                                    //b will stand for black and fastled treats black as off
                        if(i<10){                                                 //if it is less than 10 the total chars used is 3
                          int fieldIndex = header.indexOf(encodedField);
                          diodeColor = header.substring(fieldIndex+1,fieldIndex+1);             //pull the value from the field for that LED
                        }
                        else{                                                       //greater than 10 the total chars used is 4
                          int fieldIndex = header.indexOf(encodedField);
                          diodeColor = header.substring(fieldIndex+1,fieldIndex+1); //this limits the substring value to only the char at the index value.
                        }
                        //colors
                        //CRGB::Green; CRGB::Black; CRGB::Blue; CRGB::White; CRGB::Yellow;
                        //leds[i] = 0xdd8bff; //purple
                        if(diodeColor == "b"){                                    
                              leds[i] = CRGB::Black;                              //sets the color for led at position i
                        }else 
                        if(diodeColor == "b"){
                              leds[i] = CRGB::Red;      
                        }else
                        if(diodeColor == "b"){
                              leds[i] = CRGB::Green;      
                        }else 
                        if(diodeColor == "b"){
                              leds[i] = CRGB::Blue;      
                        }else 
                        if(diodeColor == "b"){
                              leds[i] = 0xdd8bff;         //purple    
                        }                                                       //this will "show" or light the LEDs according to our list above,
                      FastLED.show();                                             //putting this inside the for loop means it will update for each cycle through the loop
                      delay(50);
                      }
                      
                      //for this application a page is not needed, it is only used to grab url encoded querries.. but this much is still needed to accomplish that.
                      client.println("<!DOCTYPE html><html>");
                      client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
                      client.println("<link rel=\"icon\" href=\"data:,\">");
                      client.println("<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}");
                      client.println("</style></head>");
                      client.println("</html>");
                      client.println();
                      break;
                      } 
                  else
                  { 
                    current_data_line = "";
                    }
               }else 
                  if (new_byte != '\r'){ 
                      current_data_line += new_byte; 
                      }
          }
        }
        // Clear the header variable
        header = "";
        // Close the connection
        client.stop();
      }
    }//end loop
