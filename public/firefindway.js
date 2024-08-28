// 불꽃 이미지의 위치를 저장하는 배열
const flamePositions = [
    { node: "1", x: 985, y: 180 },
    { node: "2", x: 985, y: 300 },
    { node: "3", x: 985, y: 470 },
    { node: "4", x: 750, y: 470 },
    { node: "5", x: 660, y: 345 },
    { node: "6", x: 750, y: 180 },
    { node: "x", x: 800, y: 150 },
    { node: "y", x: 900, y: 350 },
    { node: "z", x: 1000, y: 500 },
    { node: "w", x: 700, y: 450 }
];


// 모든 불꽃 이미지를 제거하는 함수
function removeAllFlameIcons() {
    document.querySelectorAll('.flame').forEach(point => {
        point.style.display = 'none';
    });

}

// 특정 노드의 불꽃 이미지를 표시하는 함수
function showFlameForNode(nodeId) {
    const flameElement = document.getElementById("flame" + nodeId);

    if (flameElement) {
        flameElement.style.display = 'block'; // 해당 포인트를 표시합니다.
    } else {
        console.error(`Flame with ID flame${nodeId} not found.`);
    }
}

// 화살표 정보를 담은 배열
const arrowPositions = [
    { node: "1A", x: 985, y: 140, direction: 270 }, // 1->A
    { node: "A1", x: 985, y: 140, direction: 90 }, // A->1
    { node: "12", x: 985, y: 240, direction: 90 }, // 1->2
    { node: "21", x: 985, y: 240, direction: 270 }, // 2->1
    { node: "23", x: 985, y: 390, direction: 90 }, // 2->3 
    { node: "32", x: 985, y: 390, direction: 270 }, // 3->2 
    { node: "34", x: 885, y: 483, direction: 180 }, // 3->4 
    { node: "43", x: 885, y: 483, direction: 0 }, // 4->3 
    { node: "45", x: 705, y: 400, direction: 240 }, // 4->5 
    { node: "54", x: 705, y: 400, direction: 60 }, // 5->4 
    { node: "56", x: 710, y: 245, direction: 290 }, // 5->6 
    { node: "65", x: 710, y: 245, direction: 110 }, // 6->5 
    { node: "61", x: 855, y: 200, direction: 0 }, // 6->1 
    { node: "16", x: 855, y: 200, direction: 180 }, // 1->6 
    { node: "2y", x: 925, y: 330, direction: 180 }, // 2->y 
    { node: "y2", x: 925, y: 330, direction: 0 }, // y->2 
    { node: "3z", x: 1035, y: 480, direction: 0 }, // 3->z 
    { node: "z3", x: 1035, y: 480, direction: 180 }, // z->3 
    { node: "4B", x: 775, y: 530, direction: 60 }, // 4->B 
    { node: "B4", x: 775, y: 530, direction: 240 }, // B->4 
    { node: "5w", x: 625, y: 395, direction: 90 }, // 5->w 
    { node: "w5", x: 625, y: 395, direction: 270 }, // w->5 
    { node: "5C", x: 625, y: 285, direction: 270 }, // 5->C 
    { node: "C5", x: 625, y: 285, direction: 90 }, // C->5 
    { node: "x6", x: 775, y: 140, direction: 180 }, // x->6 
    { node: "6x", x: 775, y: 140, direction: 0 } // 6->x 
];


// 모든 화살표 이미지를 제거하는 함수
function removeAllArrowIcons() {
    // 모든 포인트를 숨깁니다.
    document.querySelectorAll('.arrow').forEach(point => {
        point.style.display = 'none';
    });

}

function showArrowForNode(nodeId) {
    const arrowElement = document.getElementById("arrow" + nodeId);

    if (arrowElement) {
        arrowElement.style.display = 'block'; // 해당 포인트를 표시합니다.
    } else {
        console.error(`Arrow with ID arrow${nodeId} not found.`);
    }
}

// 최단 경로에 따른 화살표 표시
function showShortestPathArrows(path) {
    for (let i = 0; i < path.length - 1; i++) {
        const fromNode = path[i];
        const toNode = path[i + 1];
        const arrowId = `${fromNode}${toNode}`; // 예: "12"는 노드 1에서 2로 가는 화살표
        showArrowForNode(arrowId);
    }
}

// 노드 정의, 각 노드는 화재 발생 여부(isFire)를 포함
const nodes = {
    "1": { isFire: false },
    "2": { isFire: false },
    "3": { isFire: false },
    "4": { isFire: false },
    "5": { isFire: false },
    "6": { isFire: false },
    "A": { isFire: false },
    "B": { isFire: false },
    "C": { isFire: false },
    "x": { isFire: false },
    "y": { isFire: false },
    "z": { isFire: false },
    "w": { isFire: false }
};

// 그래프 정의, 각 노드는 연결된 노드와 그 간선의 가중치를 가짐
const graph = {
    "A": [{ node: "1", weight: 100 }],
    "B": [{ node: "4", weight: 100 }],
    "C": [{ node: "5", weight: 100 }],
    "x": [{ node: "6", weight: 100 }],
    "y": [{ node: "2", weight: 100 }],
    "z": [{ node: "3", weight: 100 }],
    "w": [{ node: "5", weight: 100 }],

    "1": [
        { node: "A", weight: 100 },
        { node: "6", weight: 410 },
        { node: "2", weight: 207 }
    ],

    "2": [
        { node: "1", weight: 207 },
        { node: "3", weight: 275 },
        { node: "y", weight: 100 }
    ],

    "3": [
        { node: "2", weight: 275 },
        { node: "4", weight: 385 },
        { node: "z", weight: 100 }
    ],

    "4": [
        { node: "3", weight: 385 },
        { node: "5", weight: 287 },
        { node: "B", weight: 100 }
    ],

    "5": [
        { node: "4", weight: 287 },
        { node: "6", weight: 316 },
        { node: "C", weight: 100 },
        { node: "w", weight: 100 }
    ],

    "6": [
        { node: "5", weight: 316 },
        { node: "1", weight: 410 },
        { node: "x", weight: 100 }
    ]
};

// 거리와 다음 노드 행렬을 초기화하는 함수
function initializeDistanceMatrix(nodes, graph) {
    const dist = {}; // 거리 행렬
    const next = {}; // 다음 노드 행렬

    // 모든 노드 쌍 사이의 초기 거리를 설정
    for (let node in nodes) {
        dist[node] = {};
        next[node] = {};
        for (let otherNode in nodes) {
            dist[node][otherNode] = node === otherNode ? 0 : Infinity;
            next[node][otherNode] = null; // 경로 초기화
        }
    }

    // 그래프에서 직접 연결된 노드의 거리 설정
    for (let node in graph) {
        for (let edge of graph[node]) {
            dist[node][edge.node] = edge.weight;
            next[node][edge.node] = edge.node;
        }
    }

    return { dist, next };
}

// 플로이드-워셜 알고리즘으로 모든 노드 쌍 사이의 최단 경로를 찾는 함수
function floydWarshall(dist, next, nodes) {
    const nodeKeys = Object.keys(nodes);

    // 모든 노드 쌍을 비교하여 최단 경로를 갱신
    for (let k of nodeKeys) {
        if (nodes[k].isFire) continue; // 화재가 발생한 노드는 건너뜀
        for (let i of nodeKeys) {
            for (let j of nodeKeys) {
                if (!nodes[i].isFire && !nodes[j].isFire) {
                    if (dist[i][j] > dist[i][k] + dist[k][j]) { // 인접 노드에 대해서만 값이 저장됨
                        dist[i][j] = dist[i][k] + dist[k][j]; // i->j보다 i->k->j 경로가 빠를 때 값 갱신
                        next[i][j] = next[i][k]; // i에서 j로 가기 위해서 k를 거치도록 함
                    }
                }
            }
        }
    }

    return { dist, next };
}

// 주어진 출발지(u)와 도착지(v) 사이의 경로를 구성하는 함수
function constructPath(next, u, v) {
    if (next[u][v] === null) return [];
    const path = [u];
    while (u !== v) { // u->v 될 때까지 (도착할 때까지) 반복
        u = next[u][v]; // u에서의 최단 경로 x로 이동
        path.push(u);
    }
    return path;
}

// 모든 노드에서 출발하여 각 탈출구까지의 경로를 찾는 함수
function findEscapeRoutes(dist, next, nodes, exits) {
    const escapeRoutes = {};

    for (let node in nodes) {
        escapeRoutes[node] = [];

        // 탈출구 노드(A, B, C)까지의 경로를 계산
        for (let exit of exits) {
            if (node === exit) {
                // 출발지가 탈출구와 같다면, 자기 자신으로의 경로를 추가
                escapeRoutes[node].push({
                    exit: exit,
                    path: [node],
                    distance: 0
                });
            } else if (next[node][exit] !== null) {
                const path = constructPath(next, node, exit);

                // 불이 난 노드를 경로에서 피해야 함
                const pathAvoidsFire = !path.some(p => nodes[p].isFire);

                if (pathAvoidsFire || node === exit) {
                    const distance = path.reduce((acc, cur, idx, arr) => {
                        if (idx < arr.length - 1) {
                            return acc + dist[cur][arr[idx + 1]];
                        }
                        return acc;
                    }, 0);
                    escapeRoutes[node].push({
                        exit: exit,
                        path: path,
                        distance: distance
                    });
                }
            }
        }

        // 탈출구로 도달할 수 있는 경로가 없는 경우에만 다른 노드로 이동할 수 있는 경로 추가
        if (escapeRoutes[node].length === 0) {
            const possibleRoutes = graph[node].filter(neighbor => !nodes[neighbor.node].isFire);
            if (possibleRoutes.length > 0) {
                possibleRoutes.forEach(route => {
                    const path = [node, route.node];
                    escapeRoutes[node].push({
                        exit: "N/A", // 탈출구가 아닌 다른 노드로 이동
                        path: path,
                        distance: route.weight
                    });
                });
            } else {
                // 경로가 전혀 없는 경우 SOS로 표시
                escapeRoutes[node].push({
                    exit: "SOS",
                    path: [node],
                    distance: Infinity
                });
            }
        }
    }

    return escapeRoutes;
}

// // 화재 발생 위치를 입력받아 탈출 경로를 계산하는 함수
// document.addEventListener('DOMContentLoaded', function () {
//     calculateEscapeRoutes();
// });

let calculatedEscapeRoutes = {}; // 각 노드별 최단 경로를 저장할 객체

function calculateEscapeRoutes(fireNodesInput) {
    console.log(fireNodesInput);
    const fireNodes = String(fireNodesInput).split(',');

    // 모든 노드의 화재 상태 초기화
    for (let node in nodes) {
        nodes[node].isFire = false;
    }
    removeAllFlameIcons(); // 기존의 불꽃 이미지 제거
    removeAllArrowIcons(); // 기존의 화살표 이미지 제거

    // 화재가 발생한 노드를 설정
    for (let fireNode of fireNodes) {
        if (nodes[fireNode]) {
            nodes[fireNode].isFire = true;
            showFlameForNode(fireNode);  // 노드 ID만 전달
        }
    }

    const exits = ["A", "B", "C"]; // 탈출구 노드

    // 거리 행렬과 다음 노드 행렬 초기화
    let { dist, next } = initializeDistanceMatrix(nodes, graph);
    ({ dist, next } = floydWarshall(dist, next, nodes));

    // 탈출 경로 계산
    const escapeRoutes = findEscapeRoutes(dist, next, nodes, exits);

    // SOS 노드 리스트 초기화
    let sosNodes = [];

    // 최단 경로만 표시하도록 수정
    for (let node in escapeRoutes) {
        const routes = escapeRoutes[node];
        if (routes.length > 0) {
            // 최단 거리 경로를 선택
            let shortestRoute = routes.reduce((minRoute, currentRoute) => {
                return currentRoute.distance < minRoute.distance ? currentRoute : minRoute;
            });

            // 최단 경로가 있고, 출발지와 도착지가 같지 않다면 화살표를 표시
            if (shortestRoute.exit !== "N/A" && node !== shortestRoute.exit) {
                showShortestPathArrows(shortestRoute.path);
            }

            // 경로가 SOS로 표시된 노드 추가
            if (shortestRoute.exit === "SOS") {
                sosNodes.push(node);
            }
        } else {
            // 탈출구로 향하는 길이 존재하지 않으면 sosNodes에 추가
            sosNodes.push(node);
        }
    }

    // 화재가 발생한 노드에서 불이 나지 않은 쪽으로 이동하도록 화살표를 표시
    fireNodes.forEach(fireNode => {
        const possibleRoutes = graph[fireNode].filter(neighbor => !nodes[neighbor.node].isFire);
        if (possibleRoutes.length > 0) {
            possibleRoutes.forEach(route => {
                const arrowId = `${fireNode}${route.node}`; // 예: "12"는 노드 1에서 2로 가는 화살표
                showArrowForNode(arrowId); // 불이 나지 않은 쪽으로 이동하도록 화살표 표시
            });
        } else {
            // 불이 나지 않은 방향이 없으면 SOS 노드로 추가
            sosNodes.push(fireNode);
        }
    });

    // SOS 노드 표시
    if (sosNodes.length > 0) {
        console.log("SOS 노드:", sosNodes.join(", "));
    }
}


// 특정 노드에 대한 경로만 표시하는 함수
function displayEscapeRouteForCurrentNode(currentNode) { // currentNode: 사용자 입력 위치 (예: "1")
    // 모든 화살표와 불꽃을 제거하고 선택된 경로만 표시
    // removeAllFlameIcons();
    removeAllArrowIcons();

    if (calculatedEscapeRoutes[currentNode]) {
        const shortestRoute = calculatedEscapeRoutes[currentNode];

        // 최단 경로가 있고, 출발지와 도착지가 같지 않다면 화살표를 표시
        if (shortestRoute.exit !== "N/A" && currentNode !== shortestRoute.exit) {
            showShortestPathArrows(shortestRoute.path);
        }
    } else {
        console.log(`No escape route found for node ${currentNode}`);
        alert("SOS 도움 요청 신호를 보내세요!!"); // 예시 알림 메시지
        openSOSPopup();
    }
}
