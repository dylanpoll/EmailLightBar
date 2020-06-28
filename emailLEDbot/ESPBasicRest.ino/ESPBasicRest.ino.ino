#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include "AsyncJson.h"
#include "ArduinoJson.h"
#include <Adafruit_NeoPixel.h>
#define PIN        18 // On Trinket or Gemma, suggest changing this to 1
#define NUMPIXELS 140 // Popular NeoPixel ring size
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

AsyncWebServer server(80);    //server port

const char *ssid = "NHK at 2.4";
const char *password = "AnimeIsGay69!";

void notFound(AsyncWebServerRequest *request)
{
  request->send(404, "application/json", "{\"message\":\"Not found\"}");
}
void setup()
{
  pixels.begin(); // INITIALIZE NeoPixel strip object (REQUIRED)   
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.waitForConnectResult() != WL_CONNECTED)
  {
    Serial.printf("WiFi Failed!\n");
  }
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  
  //the next part is the recieving post route used to take in JSON requests
  //the POST route at current just echo's the content sent to it as is.
  AsyncCallbackJsonWebHandler *handler = new AsyncCallbackJsonWebHandler("/post",//change this to your preffered route name
                                                                          [](AsyncWebServerRequest *request, JsonVariant &json) {
    DynamicJsonDocument data(1500);
    if (json.is<JsonArray>())
    {
      data = json.as<JsonArray>();
    }
    else if (json.is<JsonObject>())
    {
      data = json.as<JsonObject>();
    }
    String response;
    String respond;
    serializeJson(data, response);  //pulling fields from a JSON object using this example would be done like ~Serial.println(data["sensor"].as<char*>());~
    request->send(200, "application/json", response);
    pixels.clear();
     int numleds = (data["numleds"].as<int>());     //this makes scaling the amount easier as the data is a part of the JSON body.
    for(int i = 0; i < numleds; i++){                          //if you change from num leds, account for 0 and make it <=
                        String fieldName = "led";
                        fieldName += i;                       //this adds the number for the schemaplacement
                        String diodeColor = "b";                                    //b will stand for black and fastled treats black as off
                        diodeColor = (data[fieldName].as<char*>());
                        //colors
                        if(diodeColor == "b"){                                    
                             pixels.setPixelColor(i, pixels.Color(0, 0, 0));                             //sets the color for led at position i
                        }else 
                        if(diodeColor == "r"){
                              pixels.setPixelColor(i, pixels.Color(20, 0, 0));     //Red;      
                        }else
                        if(diodeColor == "g"){
                              pixels.setPixelColor(i, pixels.Color(i, 0, 0, 20));   // Green;      
                        }else 
                        if(diodeColor == "B"){
                              pixels.setPixelColor(i, pixels.Color(i, 0, 20, 0));//Blue;      
                        }else 
                        if(diodeColor == "p"){
                              pixels.setPixelColor(i, pixels.Color(i, 20, 0, 20));         //purple    
                        }                                                       //this will "show" or light the LEDs according to our list above,
                                                                   //putting this inside the for loop means it will update for each cycle through the loop
                      delay(50);
                      }
                      pixels.show();
  });
 server.addHandler(handler);
  
    server.onNotFound(notFound);  //user attempted a null route

    
  server.begin();
}
void loop()
{
/*  
 *   
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {             //this is creating the route used for GET requests sent to the ESP32
    request->send(200, "application/json", "{\"message\":\"Welcome\"}");
  });

  
  server.on("/get-message", HTTP_GET, [](AsyncWebServerRequest *request) {      //the actual route middlewares of the GET
    StaticJsonDocument<100> data;
    if (request->hasParam("message"))
    {
      data["message"] = request->getParam("message")->value();
    }
    else
    {
      data["message"] = "No message parameter";
    }
    String response;
    serializeJson(data, response);
    request->send(200, "application/json", response);
  });
  //JSON body to be sent
           { 
            "numleds" : 30,
            "led0": "B",
            "led1": "B",
            "led2": "B",
            "led3": "B",
            "led4": "B",
            "led5": "B",
            "led6": "r",
            "led7": "r",
            "led8": "r",
            "led9": "r",
            "led10": "r",
            "led11": "r",
            "led12": "r",
            "led13": "r",
            "led14": "r",
            "led15": "g",
            "led16": "p",
            "led17": "p",
            "led18": "p",
            "led19": "p",
            "led20": "r",
            "led21": "r",
            "led22": "b",
            "led23": "r",
            "led24": "r",
            "led25": "g",
            "led26": "r",
            "led27": "r",
            "led28": "r",
            "led29": "r",
            "led30": "r",
            "led31": "B",
            "led32": "B",
            "led33": "B",
            "led34": "B",
            "led35": "B",
            "led36": "r",
            "led37": "r",
            "led38": "r",
            "led39": "r",
            "led40": "B",
            "led41": "B",
            "led42": "B",
            "led43": "B",
            "led44": "B",
            "led45": "B",
            "led46": "r",
            "led47": "r",
            "led48": "r",
            "led49": "r",
            "led50": "B",
            "led51": "B",
            "led52": "B",
            "led53": "B",
            "led54": "B",
            "led55": "B",
            "led56": "r",
            "led57": "r",
            "led58": "r",
            "led59": "r",
            "led60": "r"
        }
 */
}
