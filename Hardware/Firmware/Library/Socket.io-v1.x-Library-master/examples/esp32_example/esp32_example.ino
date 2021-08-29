#include <SocketIOClient.h>


SocketIOClient client;
const char* ssid = "Warning to connect !";          //Tên mạng Wifi mà Socket server của bạn đang kết nối
const char* password = "Hettienroi";  //Pass mạng wifi ahihi, anh em rãnh thì share pass cho mình với.

char hostname[] = "192.168.0.100";
int port = 3000;
String token = "56f1fb45-1080-4e53-90d1-f2fd18d015b2";
char namespace_esp8266[] = "device";   //Thêm Arduino!
extern String RID;
extern String Rname;
extern String Rcontent;

void setup() {

  Serial.begin(115200);

  //Việc đầu tiên cần làm là kết nối vào mạng Wifi
  Serial.print("Ket noi vao mang ");
  Serial.println(ssid);

  //Kết nối vào mạng Wifi
  WiFi.begin(ssid, password);

  //Chờ đến khi đã được kết nối
  while (WiFi.status() != WL_CONNECTED) { //Thoát ra khỏi vòng
    delay(500);
    Serial.print('.');
  }

  Serial.println();
  Serial.println(F("Da ket noi WiFi"));
  Serial.println(F("Di chi IP cua ESP8266 (Socket Client ESP8266): "));
  Serial.println(WiFi.localIP());

  client.setToken(token);
  if (!client.connect(hostname, port, namespace_esp8266)) {
    Serial.println(F("Ket noi den socket server that bai!"));
    return;
  }

  Serial.println("SocketIO Connected");
}

void loop()
{
  client.send("event","msg","hello");
}
