// sos 팝업창
function openSOSPopup() {
  document.getElementById("sosPopup").style.display = "flex";
}

function closeSOSPopup() {
  document.getElementById("sosPopup").style.display = "none";
}

function submitSOS() {
  const storeOrNode = document.getElementById("storeOrNode").value;
  const currentSituation = document.getElementById("currentSituation").value;

  if (storeOrNode && currentSituation) {
    alert("SOS 요청이 성공적으로 전송되었습니다!");
    closeSOSPopup(); // 팝업을 닫습니다.
  } else {
    alert("모든 필드를 작성해 주세요.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const userName = document.querySelector('input[name="userName"]').value;

      if (userName === "1234") {
        const adminWindow = window.open("admin.html", "_blank");
        if (adminWindow) {
          window.close();
        } else {
          alert("팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.");
        }
      } else {
        alert("잘못된 관리자 번호입니다.");
      }
    });
  }
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

function showNodeData(nodeId) {
  const data = {
    labels: [],
    datasets: [
      {
        label: "?  ?  ",
        data: [],
        borderColor: "red",
        fill: false,
      },
      {
        label: "CO",
        data: [],
        borderColor: "blue",
        fill: false,
      },
      {
        label: "불꽃",
        data: [],
        borderColor: "yellow",
        fill: false,
      },
    ],
  };

  updateChart(data);
}

let sensorChart;

function updateChart(data) {
  const ctx = document.getElementById("sensorChart")?.getContext("2d");
  if (ctx) {
    if (sensorChart) {
      sensorChart.destroy();
    }
    sensorChart = new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "?   ?",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: " ?",
            },
          },
        },
      },
    });
  }
}

showNodeData("node1");

const socket = io();
socket.on("arduinoData", (data) => {
  const node1Data = data.find((node) => node.node === "Node1");
  if (node1Data) {
    const currentTime = new Date().toLocaleTimeString();
    if (sensorChart.data.labels.length > 10) {
      sensorChart.data.labels.shift();
      sensorChart.data.datasets.forEach((dataset) => dataset.data.shift());
    }
    sensorChart.data.labels.push(currentTime);
    sensorChart.data.datasets[0].data.push(node1Data.temperature);
    sensorChart.data.datasets[1].data.push(node1Data.gas);
    sensorChart.data.datasets[2].data.push(node1Data.flame);
    sensorChart.update();
  }
});
