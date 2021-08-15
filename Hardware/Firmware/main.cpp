#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <EEPROM.h>
#include <SPIFFS.h>
#include<string.h>

AsyncWebServer server(80);

String str;
bool connectwifi = false;
int SoLuongWifi;
//khai báo biến wifi station mode
String Nssid;
String Npass ;
String SSID = "";
String PASSWORD = "";

//Khai báo biến wifi accesspoint mode
const char* soft_ssid = "ESP32-AccessPoint";
const char* soft_password = "0123456789";

const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>VNPT-IOT</title>
	<style >
		.login{
			width: 40vw;
			height: 19vw;
			border-radius: 10px;
			border: 1px solid grey;
			background-color: skyblue;		
			text-align: center;
		}
		h2{
			color: #868787;
			font-size: 2.5vw;
			font-family: sans-serif;
		}
		input{
			width: 35vw;
			height: 2vw;
			border-radius: 4px;
			margin-bottom: 15px;
			border-radius: 5px;
			border: 1px solid grey;
		}
		button{
			width: 20vw;
			height: 2vw;
			margin-bottom: 10px;
			border-radius: 5px;
			background-color: white;
			color: black;
		}
	</style>
</head>
<body>
		<center>
			<div class="login">
				<h2>Thiết lập kết nối WiFi</h2>
        <form action ='/get'>
			  	<input type="text" name="nameWifi" placeholder="Tên wifi" id="ssid">
		  		<br>
		  		<input type="password" name="passWifi" placeholder="Mật khẩu" id="password">
			  	<br>
				<button type= 'submit' >Connect</button>
        <form/>
			</div>
			<br><br><br>
			<p>WiFi gần đây</p>
      <p id="wifi">%WIFI%</p>
		</center>
</body>

</html>
)rawliteral";

String processor(const String& var) {
  if(var == "WIFI") {
    str = "";
   SoLuongWifi = WiFi.scanNetworks();
    delay(2000);
    for(int i =0;i < SoLuongWifi;i++) {
      Serial.println(WiFi.SSID(i));
      str += WiFi.SSID(i);
      str += "<br>";
    }
    return String(str);
  }
  return String();
}

//Xóa dữ liệu EEPROM
void XoaEEPROM() {
  Serial.println("Xoa EEPROM");
  for (int i = 0;i < 96; i++)
  {
    EEPROM.write(i,0);
    delay(10);
  }
}

//Lưu vào EEPROM
void GhiEEPROM(String ssid, String pass) {
  XoaEEPROM();
  //Lưu dữ liệu ssid
  for (int i = 0; i < ssid.length(); i++) {
    EEPROM.write(i, ssid[i]);
  }
  //Lưu dữ liệu password
  for (int i = 0; i < pass.length(); i++) {
    EEPROM.write(32+i, pass[i]);
  }
  //lưu lại các thay đổi trong EEPROM
  EEPROM.commit();
  Serial.println("đã lưu");
  delay(500);
}

//Đọc giữ liệu từ EEPROM
void DocEEPROM() {
  for (int i = 0; i < 32; i++)
  {
    SSID += char(EEPROM.read(i));
  }
  for (int i = 32; i < 96; i++)
  {
    PASSWORD += char(EEPROM.read(i));
  }
}

// AccessPoint Mode
void AccessPoint() {
  WiFi.mode(WIFI_AP);
  WiFi.softAP(soft_ssid,soft_password);
  Serial.print("IP AccessPoint:");
  Serial.println(WiFi.softAPIP());
}
// Connect Wifi
void ConnectWifi() {
  DocEEPROM();
  int dem =0;
  WiFi.mode(WIFI_AP_STA);
  WiFi.disconnect();
  WiFi.begin(SSID.c_str(),PASSWORD.c_str()); 
  while (WiFi.status()!= WL_CONNECTED){
    delay(500);
    Serial.print(".");
    dem++;
    if(dem>=10) {
      connectwifi = false;
      Serial.println("Cannot connected");
      dem = 0;
      break;
    }
  }
  if(WiFi.status() == WL_CONNECTED){
    connectwifi = true;
    Serial.println("Connected!!");
  } else {
    connectwifi = false;
  }
}

void setup() {
  Serial.begin(115200);
  EEPROM.begin(512);
  ConnectWifi();
  if(!connectwifi) {
    WiFi.mode(WIFI_MODE_APSTA);
    AccessPoint();
    server.on("/",HTTP_GET,[](AsyncWebServerRequest*request){
      request->send_P(200,"text/html",index_html,processor);
    });
    server.on("/get", HTTP_GET, [] (AsyncWebServerRequest *request) {
      // GET input1 value on <ESP_IP>/get?input1=<inputMessage>
      if (request->hasParam("nameWifi")) {
        Nssid = request->getParam("nameWifi")->value();
      }
      if (request->hasParam("passWifi")) {
        Npass = request->getParam("passWifi")->value();
      }
      Serial.println(Nssid +"\n" + Npass);
      GhiEEPROM(Nssid,Npass);
      DocEEPROM();
      WiFi.begin(Nssid.c_str(),Npass.c_str());
      delay(3000);
      if(WiFi.status() == WL_CONNECTED){
        Serial.print("IP NetWork:");
        Serial.println(WiFi.localIP());
        Serial.println(SSID + "\n" + PASSWORD);
        request->send(200, "text/html", "Wifi:" + Nssid +"<br> Pass: " + Npass  +"<br>Connected" + 
                            "<br><a href=\"/\">Return to Home Page</a>");
      } else {
        request->send(200, "text/html", "Wifi:" + Nssid +"<br> Pass: " + Npass  +"<br>Failed to connected" + 
                          "<br><a href=\"/\">Return to Home Page</a>");
      }
    });
  }
  server.begin();
}

void loop() {
}