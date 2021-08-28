#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <EEPROM.h>
#include <String.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <SocketIOClient.h>

#define DHTPIN 4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);
AsyncWebServer server(80);
SocketIOClient client;

int denbao = 13, trangthai = 12, coi = 14, button = 15;
int n, dem = 0, macdinh = 1;
float h, t;
String humi, temp;

int measurePin = 11;
int ledPower = 10;

int resetWiFi = 20;

unsigned long waitTime = 5000;
boolean lastButtonStatus = 0; //Lưu trạng thái của phim reset
boolean buttonLongPress = 0; // lưu sự kiện của phím reset
unsigned long lastChangedTime;

unsigned int samplingTime = 280;
unsigned int deltaTime = 40;
unsigned int sleepTime = 9680;

unsigned long lastTime;

float voMeasured = 0;
float calcVoltage = 0;
float dustDensity = 0;

byte degree[8] = {
  0B01110,
  0B01010,
  0B01110,
  0B00000,
  0B00000,
  0B00000,
  0B00000,
  0B00000
};

String str;
bool connectwifi = false;
int SoLuongWifi;

char hostname[] = "dht.ddns.net"; //Fix cứng
int port = 3000; //Fix cứng
char namespace_esp8266[] = "device";   //Thêm Arduino!
extern String RID;
extern String Rname;
extern String Rcontent;
unsigned long lasTime;

//khai báo biến wifi station mode
String Nssid;
String Npass ;
String Ntoken;
String TOKEN = "";
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
      width: 1000px;
      height: 400px;
      border-radius: 15px;
      border: 1px solid grey;
      background-color: skyblue;    
      text-align: center;
    }
    h2{
      color: #868787;
      font-size: 50px;
      font-family: sans-serif;
    }
    input{
      width: 700px;
      height: 40px;
      border-radius: 4px;
      margin-bottom: 15px;
      border-radius: 5px;
      border: 1px solid grey;
    }
    button{
      width: 400px;
      height: 35px;
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
          <input type="text" name="nameWifi" placeholder="Tên wifi">
          <br>
          <input type="password" name="passWifi" placeholder="Mật khẩu">
          <br>
      <input type="token" name="Token" placeholder="Token">
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
void XoaEEPROM_WIFI() {
  Serial.println("Xoa wifi trong EEPROM");
  for (int i = 0;i < 96; i++)
  {
    EEPROM.write(i,0);
    delay(10);
  }
  Serial.println("Xoa thanh cong");
}

//Xóa dữ liệu token EEPROM
void XoaEEPROM_TOKEN() {
  Serial.println("Xoa token trong EEPROM");
  for (int i = 96;i < 396; i++)
  {
    EEPROM.write(i,0);
    delay(10);
  }
  Serial.println("Xoa token thanh cong");
}

//Lưu data EEPROM
void GhiEEPROM_WIFI(String ssid, String pass) {
  XoaEEPROM_WIFI();
  Serial.println("Bat dau ghi");
  //Lưu dữ liệu ssid
  for (int i = 0; i < ssid.length(); i++) {
    EEPROM.write(i, ssid[i]);
  }
  Serial.println("Bat dau ghi 2");
  //Lưu dữ liệu password
  for (int i = 0; i < pass.length(); i++) {
    EEPROM.write(32+i, pass[i]);
  }
  //lưu lại các thay đổi trong EEPROM
  EEPROM.commit();
  Serial.println("Da luu wifi");
  delay(500);
}

void GhiEEPROM_TOKEN(String token) {
  XoaEEPROM_TOKEN();
  Serial.println("Token length: " + token.length());
  for (int i = 0;i < token.length(); i++) {
    EEPROM.write(96+i,token[i]);
  }  
  Serial.println("Da luu TOKEN");
  EEPROM.commit();
  delay(500);
}

//Đọc giữ liệu wifi từ EEPROM
void DocEEPROM_WIFI() {
  for (int i = 0; i < 32; i++)
  {
    SSID += char(EEPROM.read(i));
  }
  for (int i = 32; i < 96; i++)
  {
    PASSWORD += char(EEPROM.read(i));
  }
}
void DocEEPROM_TOKEN() {
  Serial.println("Bat dau doc");
  for (int i = 96; i < 396; i++) {
    TOKEN +=char(EEPROM.read(i));
  }
  Serial.println("Doc xong");
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
  DocEEPROM_WIFI();
  int dem =0;
  WiFi.mode(WIFI_STA);
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
    Serial.println("Connected");
  } else {
    connectwifi = false;
  }
}

// doc du lieu cam bien bui
void read_GP2Y1014AU(){
  digitalWrite(ledPower,LOW);
  delayMicroseconds(samplingTime);

  voMeasured = analogRead(measurePin);

  delayMicroseconds(deltaTime);
  digitalWrite(ledPower,HIGH);
  delayMicroseconds(sleepTime);

  calcVoltage = voMeasured*(5.0/1024);
  dustDensity = 0.17*calcVoltage-0.1;

  if ( dustDensity < 0)
  {
    dustDensity = 0.00;
  }
  lcd.setCursor(0,1);
   lcd.print("Density:"); 
   lcd.print(dustDensity);
}
//doc du lieu tu dht
void read_DHT(){
  h = dht.readHumidity(); 
  t = dht.readTemperature();
  lcd.setCursor(0,0);
  lcd.print("H:");
  lcd.setCursor(2,0);
  lcd.print(h);
  lcd.setCursor(8,0);
  lcd.write(1);
  lcd.print("C:");
  lcd.setCursor(11,0);
  lcd.print(t);
  delay(2000);
}

void check() {
   if(h>80 || t>60 || dustDensity > 80) {
    digitalWrite(denbao,HIGH);
    digitalWrite(coi,HIGH);
   } else {
    digitalWrite(denbao,LOW); 
    digitalWrite(coi,LOW);
   }
}

// tat bat canh bao
void ON_OFF() {
  int Pause = digitalRead(button);
  if(Pause != macdinh) {
    delay(5);
    if(n == 0) {
      dem +=1;
    }
  }
  if( (dem%2) == 1 )
   {
    digitalWrite(trangthai,LOW);
    digitalWrite(denbao,LOW); 
    digitalWrite(coi,LOW);
   }
 else
   {
    digitalWrite(trangthai,HIGH);
    check();
   }
}
// Hàm reset wifi
void ResetWiFi() {
  boolean rs = digitalRead(resetWiFi);
  if(rs != lastButtonStatus) {
    lastButtonStatus = rs;
    lastButtonStatus = millis();
  }
  if(millis() - lastButtonStatus > waitTime) {
    buttonLongPress = rs;
    lastChangedTime = millis();
  }
  if(buttonLongPress == true) {
    GhiEEPROM_WIFI("","");
    GhiEEPROM_TOKEN("");
  }
}

void setup() {
  Serial.begin(9600);
  EEPROM.begin(512);
  lcd.init();
  dht.begin();
  lcd.backlight();
  lcd.createChar(1, degree);
  lcd.clear();

  pinMode(denbao,OUTPUT);
  pinMode(trangthai,OUTPUT);
  pinMode(coi,OUTPUT);
  pinMode(resetWiFi,OUTPUT);
  pinMode(button,INPUT_PULLUP);
  digitalWrite(trangthai,HIGH);

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
      if (request->hasParam("Token")) {
        Ntoken = request->getParam("Token")->value();
      }
      Serial.println(Nssid +"\n" + Npass + '\n' + Ntoken);
      
      GhiEEPROM_WIFI(Nssid,Npass);
      GhiEEPROM_TOKEN(Ntoken);
      DocEEPROM_WIFI();
      DocEEPROM_TOKEN();
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
  else {
    DocEEPROM_TOKEN();
    Serial.println(TOKEN);
    client.setToken(TOKEN.c_str());
    if (!client.connect(hostname, port, namespace_esp8266)) {
      Serial.println(F("Ket noi den socket server that bai!"));
      return;
    }
  }
  check();
  server.begin();
}

void loop() {
  read_DHT();
  humi = String(h);
  temp = String(t);
  //read_GP2Y1014AU();
  ON_OFF(); // tắt bật cảnh báo
 // ResetWiFi(); //reset wifi
  String result = "{\"temp\":\"" + temp + "\",\"humi\":\"" + humi + "\"}";
  Serial.println(result);
  client.send("event", result);
}
