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



const socket = io();

function searchStore() {
  const query = document.querySelector("#store-search-input").value;
  const selectedFloor =
    document.querySelector(".floor-item.active").dataset.floor;
  console.log(`query: ${query}, selectedFloor: ${selectedFloor}`);
  fetch(
    `/search-store?query=${encodeURIComponent(
      query
    )}&floor=${encodeURIComponent(selectedFloor)}`
  )
    .then((response) => response.json())
    .then((data) => {
      // 서버에서 받은 데이터를 이용해 마커 생성
      console.log(`data: `, data);
      if (data) {
        const mapImage = document.getElementById("mapImage");
        const marker = document.createElement("div");
        marker.style.position = "absolute";
        //marker.style.left = `${data.x}px`;
        //marker.style.top = `${data.y}px`;
        marker.style.width = "20px";
        marker.style.height = "20px";
        marker.style.backgroundColor = "red";
        marker.style.borderRadius = "50%";
        marker.style.transform = "translate(-50%, -50%)";
        mapImage.parentElement.appendChild(marker); // 이미지의 부모 요소에 마커 추가

        // 반응형 이미지 대응
        const adjustMarkerPosition = () => {
          const scaleX = mapImage.clientWidth / mapImage.naturalWidth;
          const scaleY = mapImage.clientHeight / mapImage.naturalHeight;
          marker.style.left = `${data.x * scaleX}px`;
          marker.style.top = `${data.y * scaleY}px`;
        };
        // 이미지가 로드된 후에 마커 위치 조정
        if (mapImage.complete) {
          adjustMarkerPosition();
        } else {
          mapImage.addEventListener("load", adjustMarkerPosition);
        }
        window.addEventListener("resize", adjustMarkerPosition);
      }
    })
    .catch((error) => {
      console.error("Error fetching store data:", error);
    });
}
