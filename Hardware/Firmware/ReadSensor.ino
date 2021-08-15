#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);
int denbao = 13,trangthai = 12, coi = 11, button = 15;
int n,dem = 0, macdinh = 1;
float h,t;
int measurePin = 9;
int ledPower = 10;

unsigned int samplingTime = 280;
unsigned int deltaTime = 40;
unsigned int sleepTime = 9680;

float voMeasured = 0;
float calcVoltage = 0;
float dustDensity = 0;

//tạo kí tự độ
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
void setup() {
  Serial.begin(9600);
  lcd.begin();
  dht.begin();
  lcd.backlight();
  lcd.createChar(1, degree);
  lcd.clear();
  pinMode(denbao,OUTPUT);
  pinMode(trangthai,OUTPUT);
  pinMode(coi,OUTPUT);
  pinMode(ledPower,HIGH);
  pinMode(button,INPUT_PULLUP);
  digitalWrite(trangthai,HIGH);
  check();
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
void check() {
   if(h>80 || t>60 || dustDensity > 10) {
    digitalWrite(denbao,HIGH);
    digitalWrite(coi,HIGH);
   } else {
    digitalWrite(denbao,LOW); 
    digitalWrite(coi,LOW);
   }
}
void loop() {
 read_DHT();
 read_GP2Y1014AU();
 ON_OFF();
 delay(1000);
}
