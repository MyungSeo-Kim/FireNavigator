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
  port = new SerialPort({ path: "COM5", baudRate: 9600 });
  // readline parser로 데이터를 줄 단위로 파싱
  parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  parser.on("data", (data) => {// 아두이노 데이터 수신 시
    //console.log('Received data from Arduino:', data);
    const parsedData = parseArduinoData(data);
    if (data.startsWith("Info:")) {
      const parsedData = parseArduinoData(data);
      io.emit("arduinoData", parsedData); // 클라이언트로 데이터 전송
    }  });
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
app.get("/findway", (req, res) => sendHtmlFile(res, "findway_test.html"));


const stores = {
  '1F' : {
    '101': { name: '루이비통', x: 310, y: 1200 },      //여기서 x,y 좌표 안쓰는 느낌 
    '102': { name: '에르메스', x: 200, y: 300 },
    '103': { name: '디올', x: 150, y: 250 },
    '104': { name: '프라다', x: 250, y: 350 },
    '105': { name: '샤넬', x: 300, y: 400 },
    '106': { name: '버버리', x: 350, y: 450 },
    '107': { name: '발렌시아가', x: 400, y: 500 }
  },
  '2F' : {
    '201': { name: '보테가베네타', x: 100, y: 200 },
    '202': { name: '젠틀몬스터', x: 200, y: 300 },
    '203': { name: '구찌', x: 150, y: 250 },
    '204': { name: '발렌티노', x: 250, y: 350 },
    '205': { name: '몽블랑', x: 300, y: 400 },
    '206': { name: '롤렉스', x: 350, y: 450 },
    '207': { name: '톰브라운', x: 400, y: 500 }
  },
  '3F' : {
    '301': { name: '꼼데가르송', x: 100, y: 200 },
    '302': { name: '스톤아일랜드', x: 200, y: 300 },
    '303': { name: '아미', x: 150, y: 250 },
    '304': { name: '띠어리', x: 250, y: 350 },
    '305': { name: 'A.P.C.', x: 300, y: 400 },
    '306': { name: '송지오', x: 350, y: 450 },
    '307': { name: '메종키츠네', x: 400, y: 500 }
  },
  '4F' : {
    '401': { name: '나이키', x: 100, y: 200 },
    '402': { name: '아디다스', x: 200, y: 300 },
    '403': { name: '퓨마', x: 150, y: 250 },
    '404': { name: '뉴발란스', x: 250, y: 350 },
    '405': { name: '리복', x: 300, y: 400 },
    '406': { name: '휠라', x: 350, y: 450 },
    '407': { name: '언더아머', x: 400, y: 500 }
  }
}


app.get('/search-store', (req, res) => {
  const { query } = req.query;
  let storeData = null;

  for (const floor in stores) { // 각 층을 순회
    const floorStores = stores[floor];
    for (const storeKey in floorStores) { // 각 층의 매장 정보 객체를 순회
      if (floorStores[storeKey].name === query) {
        storeData = {
          ...floorStores[storeKey], // 기존의 store 정보 복사
          floor, // 현재 층 정보 추가
          storeKey // 매장 번호 정보 추가
        };
        break;
      }
    }
    if (storeData) break; // 매장을 찾으면 더 이상 순회하지 않음
  }

  res.json(storeData);
});



// // SOS 알림 전송 엔드포인트
// app.post('/send-sos', (req, res) => {
//   const { node } = req.body;
//   io.emit('sos-alert', { node }); // 모든 연결된 클라이언트에 SOS 알림 전송
//   res.json({ success: true });
// });

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

  socket.on("sosData", function(sosdata) {
    // console.log(sosdata);
    io.emit('sosData', sosdata);
  })

});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

function parseArduinoData(data) {
  const nodes = data.replace("Info:", "").split(",").filter((d) => d);
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
  const nodes = [];
  const nodeCount = 6; // 노드 개수 설정

  for (let i = 1; i <= nodeCount; i++) {
    nodes.push({
      node: `Node${i}`,
      gas: Math.random() * 1000,
      flame: Math.random() > 0.5 ? 1 : 0,
      temperature: 20 + Math.random() * 20,
      humidity: 50 + Math.random() * 50,
      isFire: Math.random() > 0.5,
    });
  }

  return nodes;
}
