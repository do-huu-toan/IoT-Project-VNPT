require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const isProduction = process.env.NODE_ENV === 'production';
const authMiddleware = require('./middleware/auth.middleware');

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

const device_nsp = io.of('/device')
const web_and_mobile_nsp = io.of('/webapp')

const init = false;

//Database
const db = require('./models/database');
const initDatabase = require('./models/Init');

if (init) {
  db.sync({ force: init }).then(() => {
    initDatabase();
  });
}
else {
  db.sync({ force: false })
}

//app.use(helmet());
app.use(cookieParser());
app.use(express.static('public'));
app.set('views', 'view');
app.set('view engine', 'ejs');

app.use(morgan('combined'));

app.use(express.urlencoded({
  limit: '50mb'
}));

app.use(express.json());

app.use(express.static('public'))

//Route:
const UserRoute = require('./routes/user.route');
const RoleRoute = require('./routes/role.route')
const AuthRoute = require('./routes/auth.route')
const DeviceRoute = require('./routes/device.route');
const Device = require('./models/Device');
const User = require('./models/User');
const CORS = require('./middleware/cors.middleware')

app.use('/auth', AuthRoute);
app.use('/role', RoleRoute);
app.use('/user', authMiddleware.authenicate, UserRoute);
app.use('/device', CORS.api,DeviceRoute)


app.get('/login', authMiddleware.authenicateLogin, (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  res.clearCookie("token");
  return res.redirect('/login');
})


app.get('/manager', authMiddleware.authenicate, async (req, res) => {
  const user = await authMiddleware.getUsernameByToken(req);
  console.log("Username: ", user)
  return res.render('index', {
    username: user
  });
});


//SocketIO:
let device_room = [];


device_nsp.use(async (socket, next) => {
  //Kiểm tra xem có thiết bị chưa
  const deviceId = socket.handshake.query.token;
  const result = await Device.findByPk(deviceId);

  if (result) {
    next();
  }
  else {
    socket.emit("error", "error");
  }
})

device_nsp.on('connection', async (socket) => {
  //Có 1 thiết bị được kết nối vào thì:
  //Tìm owner:
  const deviceId = socket.handshake.query.token;

  const deviceFound = await Device.findByPk(deviceId);
  const UserId = deviceFound.userId;

  const user = await User.findByPk(UserId);
  const username = user.usename;

  if (!device_room[username]) {
    device_room[username] = [];
  }
  const objectDevice = {
    deviceId: deviceId,
    temperature: 0
  };
  device_room[username].push(objectDevice);
  console.log(device_room);
  //emit room owner cho web_app_nsp:

  web_and_mobile_nsp.in(username).emit('device-online', device_room[username])


  socket.on('disconnect', () => {
    console.log(socket.id + " disconnect");
    const index = device_room[username].findIndex(device => {return device.deviceId === deviceId});
    device_room[username].splice(index, 1);
    web_and_mobile_nsp.in(username).emit('device-online', device_room[username])
  })
})


web_and_mobile_nsp.use(async (socket, next) => {
  //Check token, nếu token tồn tại thì next:
  const token = socket.handshake.query.token;
  const userId = await authMiddleware.getIdByTokenString(token);
  const userByToken = await User.findByPk(userId);
  if (userByToken) {
    next();
  }
})

web_and_mobile_nsp.on('connection', async (socket) => {
  //Có 1 Web or App được connection:
  //Tìm usename:
  const token = socket.handshake.query.token;
  const username = await authMiddleware.getUsernameByTokenString(token);
  //Nếu usename.role == 'admin' thì join vào tất cả các room
  socket.join(username);
  socket.emit('server-webapp', username);

  console.log("Co Connect Webapp");

  socket.emit('device-online', device_room[username]);
  //Else Join room username
})

server.listen(port, () => {
  console.log(`Running on port: ${port}...`)
})