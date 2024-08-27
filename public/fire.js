window.onload = function () {
  document.getElementById("dangerPopup").style.display = "flex";
};

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


function submitSOS() {
  const storeOrNode = document.getElementById("storeOrNode").value;
  const currentSituation = document.getElementById("currentSituation").value;

  const sosData = [storeOrNode, currentSituation];

  if (storeOrNode && currentSituation) {
    // console.log(sosData);

    socket.emit('sosData', sosData);

    alert("SOS 요청이 성공적으로 전송되었습니다!");
    closeSOSPopup(); // 팝업을 닫습니다.
  } else {
    alert("모든 필드를 작성해 주세요.");
  }
}



// function submitSOS() {
//   const storeOrNode = document.getElementById("storeOrNode").value;
//   const currentSituation = document.getElementById("currentSituation").value;

//   if (storeOrNode && currentSituation) {
//     // 서버로 요청 전송
//     fetch("/submit-sos", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         storeOrNode: storeOrNode,
//         currentSituation: currentSituation,
//         timestamp: new Date().toISOString(), // 요청 시간 기록
//       }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           alert("SOS 요청이 성공적으로 전송되었습니다!");
//           closeSOSPopup(); // 팝업을 닫습니다.
//         } else {
//           alert("SOS 요청 전송에 실패했습니다.");
//         }
//       })
//       .catch((error) => console.error("Error:", error));
//   } else {
//     alert("모든 필드를 작성해 주세요.");
//   }
// }

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

