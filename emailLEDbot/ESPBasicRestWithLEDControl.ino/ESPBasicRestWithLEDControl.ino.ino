#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>            // https://github.com/me-no-dev/ESPAsyncWebServer         
#include "AsyncJson.h"
#include "ArduinoJson.h"                  // https://arduinojson.org
AsyncWebServer server(80);                // server port
const char *ssid = "";          // put your wifi name here
const char *password = "";   // put your wifi password here

#include <NeoPixelBus.h>                  // https://github.com/Makuna/NeoPixelBus
const uint16_t PixelCount = 140;          // this example assumes 4 pixels, making it smaller will cause a failure
const uint8_t PixelPin = 18;              // make sure to set this to the correct pin, ignored for Esp8266
#define colorSaturation 100                // this is treated as a brightness in my case...

NeoPixelBus<NeoGrbFeature, Neo800KbpsMethod> strip(PixelCount, PixelPin);
RgbColor red(colorSaturation, 0, 0);
RgbColor green(0, colorSaturation, 0);
RgbColor blue(0, 0, colorSaturation);
RgbColor purple(60, 0, 85);
RgbColor white(colorSaturation);
RgbColor black(0);
HslColor hslRed(red);
HslColor hslGreen(green);
HslColor hslBlue(blue);
HslColor hslWhite(white);
HslColor hslBlack(black);

void badGateWay(AsyncWebServerRequest *request) {
  request->send(404, "application/json", "{\"404\":\"bad gateway\"}");
}

void setup() {   
  Serial.begin(115200);   //for the esp32
  
  strip.Begin();          //preps the LED strip
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.waitForConnectResult() != WL_CONNECTED)
  {
    Serial.printf("WiFi Failed!\n");    //if this prints you have entered bad credentials above or have a whitelist on your network.
  }
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());     //this prints the devices sub IP address.
  
  // the next part is the recieving post route used to take in JSON requests
  // the POST route at current just echo's the content sent to it as is.
  // the endpoint will be http://***.***.*.**/postLEDSchema just replace the astrisks with your devices sub IP address.
  AsyncCallbackJsonWebHandler *postLEDSchema = new AsyncCallbackJsonWebHandler("/postLEDSchema",     //change this to your preffered route name
                                                                          [](AsyncWebServerRequest *request, JsonVariant &json) {
    DynamicJsonDocument data(1500);                 //I used a DynamicJsonDocument because it can change size, but it is slower so consider static if you need speed.
    if (json.is<JsonArray>())
    {
      data = json.as<JsonArray>();
    }
    else if (json.is<JsonObject>())
    {
      data = json.as<JsonObject>();
    }
    String testEcho;
    serializeJson(data, testEcho);                                                  //pulling fields from a JSON object using this example would be done like ~Serial.println(data["sensor"].as<char*>());~
    //request->send(200, "application/json", "{\"Attempt\":\"Successful\"}"           //informs user of success
    request->send(200, "application/json", testEcho);                               //this just echo's back the sent body, I used this to verify that the body was recieved correctly.
    int numleds = (data["numleds"].as<int>());                                      //this makes scaling the amount easier as the data is a part of the JSON body.
    for(int i = 0; i < numleds; i++){                                               //if you change from num leds, account for 0 and make it <=
                        String fieldName = "led";
                        fieldName += i;                                             //this adds the number for the schemaplacement
                        String diodeColor = "b";                                    //b will stand for black and fastled treats black as off
                        diodeColor = (data[fieldName].as<char*>());
                        //colors
                        if(diodeColor == "r"){
                              strip.SetPixelColor(i, red);     
                        }else
                        if(diodeColor == "g"){
                              strip.SetPixelColor(i, green);   
                        }else 
                        if(diodeColor == "B"){
                              strip.SetPixelColor(i, blue);      
                        }else                    
                        if(diodeColor == "p"){
                               strip.SetPixelColor(i, purple);
                        }else
                        if(diodeColor == "w"){
                               strip.SetPixelColor(i, white);          
                        }else 
                        if(diodeColor == "b"){                                    
                             strip.SetPixelColor(i, black);                             //sets the color for led at position i        
                        }                                                               //this will "show" or light the LEDs according to our list above,
                      strip.Show();                                                     //putting this inside the for loop means it will update for each cycle through the loop
                      delay(50);
                      }
                     
  });
  server.addHandler(postLEDSchema);   //adds the "handler" or "route" to the server
  server.onNotFound(badGateWay);      //user attempted a null route
  server.begin();                     //this needs to be put at the end of all routing
}
void loop() {
}
