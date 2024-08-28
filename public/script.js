window.onload = function () {
  document.querySelectorAll('.point').forEach(point => {
    point.style.display = 'none';
  });
};

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
  document.querySelectorAll('.point').forEach(point => {
    point.style.display = 'none';
  });
  // 모든 floor-item 클래스 요소에서 이전 선택된 층의 active 상태 제거
  const floors = document.querySelectorAll(".floor-item"); // 모든 층 요소 선택
  floors.forEach((floor) => {
    floor.classList.remove("active");
  });

  element.classList.add("active"); // 선택된 층에 active 상태 추가
  const mapImageElement = document.getElementById("mapImage");
  mapImageElement.src = mapImage; // 선택된 층에 해당하는 이미지로 변경
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

function showPoint(pointId) {
  // 모든 포인트를 숨깁니다.
  document.querySelectorAll('.point').forEach(point => {
    point.style.display = 'none';
  });

  // 특정 ID의 포인트를 찾습니다.
  const pointElement = document.getElementById("point" + pointId);
  console.log(pointElement);
  
  if (pointElement) {
    pointElement.style.display = 'block'; // 해당 포인트를 표시합니다.
  } else {
    console.error(`Point with ID point${pointId} not found.`);
  }
}

function autoSelectFloor(floor) {
  let floorElement;
  let floorImage;

  // 원하는 층에 맞게 요소와 이미지를 설정
  switch(floor) {
      case '1F':
          floorElement = document.querySelector(".floor-item:nth-child(4)");
          floorImage = '1f.png';
          break;
      case '2F':
          floorElement = document.querySelector(".floor-item:nth-child(3)");
          floorImage = '2f.png';
          break;
      case '3F':
          floorElement = document.querySelector(".floor-item:nth-child(2)");
          floorImage = '3f.png';
          break;
      case '4F':
          floorElement = document.querySelector(".floor-item:nth-child(1)");
          floorImage = '4f.png';
          break;
      default:
          floorElement = document.querySelector(".floor-item:nth-child(4)");
          floorImage = '1f.png';
          break;
  }

  // 선택된 층으로 이동
  selectFloor(floorElement, floorImage);
}


function searchStore() {
  const query = document.querySelector("#store-search-input").value;
  const selectedFloor = document.querySelector(".floor-item.active").dataset.floor;


  fetch(`/search-store?query=${encodeURIComponent(query)}`)
    .then((response) => response.json())
    .then((data) => {
      // 서버에서 받은 데이터를 이용해 마커 생성
      console.log(`data: `, data);

      if (data) {
        autoSelectFloor(data.floor);
        showPoint(data.storeKey[2]); // 검색된 포인트를 표시
      }

    })
    .catch((error) => {
      console.error("Error fetching store data:", error);
    });

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