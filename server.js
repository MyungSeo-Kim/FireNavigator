const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const path = require("path");
const cors = require("cors");
const session = require("express-session");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  "/socket.io",
  express.static(
    path.join(__dirname, "node_modules", "socket.io", "client-dist")
  )
);
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 세션 설정
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // production에서는 secure: true로 설정 필요
  })
);

let port;
let parser;
let useMockData = false;

// 시리얼 포트 연결 시도
try { 
  port = new SerialPort({ path: "COM9", baudRate: 9600 });
  // readline parser로 데이터를 줄 단위로 파싱
  parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  parser.on("data", (data) => {// 아두이노 데이터 수신 시
    //console.log('Received data from Arduino:', data);
    const parsedData = parseArduinoData(data);
    io.emit("arduinoData", parsedData); // 클라이언트로 데이터 전송
  });
  // 시리얼 포트 에러 시 mock 데이터 사용
  port.on("error", (err) => { 
    console.error("Serial port error:", err.message);
    useMockData = true;
  });
} catch (error) {
  console.error("Failed to open serial port:", error.message);
  useMockData = true;
}

// http GET 요청 처리-> HTML 파일 제공 함수
const sendHtmlFile = (res, fileName) => {
  res.sendFile(path.join(__dirname, "public", fileName));
};

// http GET 요청 처리
app.get("/", (req, res) => sendHtmlFile(res, "main.html"));
app.get("/admin2", (req, res) => sendHtmlFile(res, "admin2.html"));
app.get("fire", (req, res) => sendHtmlFile(res, "fire.html"));
app.get("/main", (req, res) => sendHtmlFile(res, "main.html"));
app.get("/page1", (req, res) => sendHtmlFile(res, "page1.html"));
app.get("/page2", (req, res) => sendHtmlFile(res, "page2.html"));
app.get("/page3", (req, res) => sendHtmlFile(res, "page3.html"));
app.get("/test", (req, res) => sendHtmlFile(res, "test.html"));

const stores = {
  '1F' : {
    '1-1': { name: 'ABC Store', x: 100, y: 200 },
    '1-2': { name: 'DEF Store', x: 200, y: 300 },
    '1-3': { name: 'GHI Store', x: 150, y: 250 },
    '1-4': { name: 'JKL Store', x: 250, y: 350 },
    '1-5': { name: 'MNO Store', x: 300, y: 400 },
    '1-6': { name: 'PQR Store', x: 350, y: 450 },
    '1-7': { name: 'STU Store', x: 400, y: 500 }
  },
  '2F' : {
    '2-1': { name: 'VWX Store', x: 100, y: 200 },
    '2-2': { name: 'YZA Store', x: 200, y: 300 },
    '2-3': { name: 'BCD Store', x: 150, y: 250 },
    '2-4': { name: 'EFG Store', x: 250, y: 350 },
    '2-5': { name: 'HIJ Store', x: 300, y: 400 },
    '2-6': { name: 'KLM Store', x: 350, y: 450 },
    '2-7': { name: 'NOP Store', x: 400, y: 500 }
  },
  '3F' : {
    '3-1': { name: 'QRS Store', x: 100, y: 200 },
    '3-2': { name: 'TUV Store', x: 200, y: 300 },
    '3-3': { name: 'WXY Store', x: 150, y: 250 },
    '3-4': { name: 'ZAB Store', x: 250, y: 350 },
    '3-5': { name: 'CDE Store', x: 300, y: 400 },
    '3-6': { name: 'FGH Store', x: 350, y: 450 },
    '3-7': { name: 'IJK Store', x: 400, y: 500 }
  },
  '4F' : {
    '4-1': { name: 'LMN Store', x: 100, y: 200 },
    '4-2': { name: 'OPQ Store', x: 200, y: 300 },
    '4-3': { name: 'RST Store', x: 150, y: 250 },
    '4-4': { name: 'UVW Store', x: 250, y: 350 },
    '4-5': { name: 'XYZ Store', x: 300, y: 400 },
    '4-6': { name: 'ABC Store', x: 350, y: 450 },
    '4-7': { name: 'DEF Store', x: 400, y: 500 }
  }
}

app.get('/search-store', (req, res) => {
  const { query, floor } = req.query;
  const floorStores = stores[floor] || {}; // 해당 층의 매장 정보 없으면 빈 객체 반환
  let storeData = null;

  for (const storeKey in floorStores) { // 매장 정보 객체 순회
    if (floorStores[storeKey].name === query) {
      storeData = floorStores[storeKey];
      break;
    }
  }

  res.json(storeData);
});

// SOS 알림 전송 엔드포인트
app.post('/send-sos', (req, res) => {
  const { node } = req.body;
  io.emit('sos-alert', { node }); // 모든 연결된 클라이언트에 SOS 알림 전송
  res.json({ success: true });
});

// 관리자 번호 확인 엔드포인트
app.post("/check-admin-code", (req, res) => {
  const { code } = req.body;
  const adminCode = "1234"; // 실제 사용 시 더 안전한 방법으로 저장 및 확인

  if (code === adminCode) {
    req.session.isAdmin = true; // 세션에 관리자 인증 정보 저장
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// 관리자 페이지 접근 미들웨어
function adminAuth(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect("/"); // 인증되지 않은 경우 메인 페이지로 리디렉션
  }
}

app.get("/admin", adminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

io.on("connection", (socket) => {
  console.log("A user connected");

  if (useMockData) {
    const interval = setInterval(() => {
      const mockData = generateMockData();
      io.emit("arduinoData", mockData);
    }, 2000);

    socket.on("disconnect", () => {
      console.log("A user disconnected");
      clearInterval(interval);
    });
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

function parseArduinoData(data) {
  const nodes = data.split(",").filter((d) => d);
  return nodes.map((node, index) => {
    const gas = Math.floor(node / 100000) % 1000; // 3자리수
    const flame = Math.floor((node % 100000) / 10000); // 1자리수
    const temperature = Math.floor((node % 10000) / 100); // 2자리수
    const humidity = node % 100; // 2자리수

    const isFire = flame > 0;

    return {
      node: `Node${index + 1}`,
      gas,
      flame,
      temperature,
      humidity,
      isFire,
    };
  });
}

function generateMockData() {
  return [
    {
      node: "Node1",
      gas: Math.random() * 1000,
      flame: Math.random() > 0.5 ? 1 : 0,
      temperature: 20 + Math.random() * 20,
      humidity: 50 + Math.random() * 50,
      isFire: Math.random() > 0.5,
    },
    {
      node: "Node2",
      gas: Math.random() * 1000,
      flame: Math.random() > 0.5 ? 1 : 0,
      temperature: 20 + Math.random() * 20,
      humidity: 50 + Math.random() * 50,
      isFire: Math.random() > 0.5,
    },
    {
      node: "Node3",
      gas: Math.random() * 1000,
      flame: Math.random() > 0.5 ? 1 : 0,
      temperature: 20 + Math.random() * 20,
      humidity: 50 + Math.random() * 50,
      isFire: Math.random() > 0.5,
    },
  ];
}
