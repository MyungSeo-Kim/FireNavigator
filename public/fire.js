const socket = io();
let flag;
let beforefire;

window.onload = function () {
  document.getElementById("dangerPopup").style.display = "flex";
  removeAllFlameIcons(); // 기존의 불꽃 이미지 제거
  removeAllArrowIcons(); // 기존의 화살표 이미지 제거
  flag = true;
};

socket.on('arduinoData', (parsedData) => {
  // console.log(parsedData);
  const fireNodeList = parsedData.filter(node => node.isFire === true);
  let fireNodeNumbers = fireNodeList.map(node => node.node.replace('Node', '')).join(',');

  if (fireNodeNumbers.length === 0) {
    fireNodeNumbers = "N/A";
  }

  // fireNodeNumbers = "2,4";
  // console.log("fireNodeNumbers : ", fireNodeNumbers);
  // console.log("before : ", beforefire);
  if (fireNodeNumbers !== "N/A" && beforefire !== fireNodeNumbers) {
    calculateEscapeRoutes(fireNodeNumbers);
    flag = false;
  }
  else if (fireNodeNumbers === "N/A" && beforefire !== fireNodeNumbers) {
    removeAllFlameIcons(); // 기존의 불꽃 이미지 제거
    removeAllArrowIcons(); // 기존의 화살표 이미지 제거
  }

  beforefire = fireNodeNumbers;

});

function closeDangerPopup() {
  const dangerPopup = document.getElementById("dangerPopup");
  const searchInput = document.querySelector(".search-bar input");
  dangerPopup.style.display = "none";
  searchInput.focus(); // 닫기 버튼 클릭 시 검색창에 포커스
}

//sos 팝업창
function openSOSPopup() {
  document.getElementById("sosPopup").style.display = "flex";
}

function closeSOSPopup() {
  document.getElementById("sosPopup").style.display = "none";
}

function openpositioningPopup() {
  document.getElementById("positioningPopup").style.display = "flex";
}

function closepositioningPopup() {
  document.getElementById("positioningPopup").style.display = "none";
}

// 매장명을 노드 번호로 변환하는 함수
function convertStoreToNode(storeOrNode) {
  const storeToNodeMapping = {
    "루이비통": "x",
    "프라다": "y",
    "샤넬": "y",
    "버버리": "y",
    "발렌시아가": "y",
    "디올": "z",
    "에르메스": "w"
  };

  // storeOrNode가 노드 번호일 경우 그대로 반환
  if (storeToNodeMapping[storeOrNode]) {
    return storeToNodeMapping[storeOrNode];
  }

  return storeOrNode; // 매장명이 아닌 경우(노드 번호인 경우) 그대로 반환
}

function submitSearchButton() {
  let storeOrNode = document.getElementById("NodeSearchInput").value.trim();

  if (storeOrNode) {
    // 매장명을 노드 번호로 변환
    storeOrNode = convertStoreToNode(storeOrNode);

    alert("탈출 경로를 확인하세요!"); // 예시 알림 메시지
    closepositioningPopup(); // 팝업을 닫습니다.

    displayEscapeRouteForCurrentNode(storeOrNode);
  } else {
    alert("모든 필드를 작성해 주세요.");
  }

}

// submitPositioning 함수 수정
function submitPositioning() {
  let storeOrNode = document.getElementById("positioningStoreOrNode").value.trim();

  if (storeOrNode) {
    // 매장명을 노드 번호로 변환
    storeOrNode = convertStoreToNode(storeOrNode);

    alert("탈출 경로를 확인하세요!"); // 예시 알림 메시지
    closepositioningPopup(); // 팝업을 닫습니다.

    displayEscapeRouteForCurrentNode(storeOrNode);
  } else {
    alert("모든 필드를 작성해 주세요.");
  }
}

function submitSOS() {
  const storeOrNode = document.getElementById("storeOrNode").value;
  const currentSituation = document.getElementById("currentSituation").value;

  // const sosData = [storeOrNode, currentSituation];
  const sosData = {
    nodeinfo: storeOrNode,
    message: currentSituation,
    timestamp: new Date().toLocaleString()
  };

  if (storeOrNode && currentSituation) {
    // console.log(sosData);

    socket.emit('sosData', sosData);

    alert("SOS 요청이 성공적으로 전송되었습니다!");
    closeSOSPopup(); // 팝업을 닫습니다.
  } else {
    alert("모든 필드를 작성해 주세요.");
  }
}

document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const userName = document.querySelector('input[name="userName"]').value;

    if (userName === "1234") {
      const adminWindow = window.open("admin2.html", "_blank");
      if (adminWindow) {
        window.close();
      } else {
        alert("팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.");
      }
    } else {
      alert("잘못된 관리자 번호입니다.");
    }
  });
// 로그인창
document.getElementById("info").addEventListener("click", function () {
  document.querySelector(".login-wrapper").classList.toggle("active");
});

// 닫는 x버튼
document.querySelector(".close-btn").addEventListener("click", function () {
  document.querySelector(".login-wrapper").classList.remove("active");
});

function selectFloor(element, mapImage) {
  const floors = document.querySelectorAll(".floor-item");
  floors.forEach((floor) => {
    floor.classList.remove("active");
  });

  element.classList.add("active");

  const mapImageElement = document.getElementById("mapImage");
  mapImageElement.src = mapImage;
}

function checkAdminCode() {
  const adminCode = document.getElementById("adminCode").value;
  fetch("/check-admin-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: adminCode }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        window.location.href = "/admin";
      } else {
        alert("Invalid admin code");
      }
    });
}

function showSection(sectionId) {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");

  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    item.classList.remove("active");
  });
  document
    .querySelector(`.menu-item[onclick="showSection('${sectionId}')"]`)
    .classList.add("active");
}

document.getElementById('toggleFireStatus').addEventListener('click', () => {
  fetch('/toggle-fire-status', {
    method: 'POST'
  })
    .then(response => response.json())
    .then(data => {
      console.log('화재 여부가 변경되었습니다:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});