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
                    if (dist[i][j] > dist[i][k] + dist[k][j]) { //인접 노드에 대해서만 값이 저장됨
                        dist[i][j] = dist[i][k] + dist[k][j]; //i->j보다 i->k->j 경로가 빠를때 값 갱신
                        next[i][j] = next[i][k]; //i에서 j로 가기 위해서 k를 거치도록 함
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
    while (u !== v) { //u->v 될때까지 (도착할떄까지) 반복
        u = next[u][v]; //u에서의 최단 경로 x로 이동
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
                } else if (nodes[node].isFire) {
                    // 노드에서 불이 난 경우, 가능한 탈출 경로를 찾음
                    const possibleRoutes = graph[node].filter(neighbor => !nodes[neighbor.node].isFire);

                    // 인접 노드 중 불이 난 노드가 2개 이상일 경우, 무조건 불이 나지 않은 노드로 이동
                    const fireNeighborsCount = graph[node].filter(neighbor => nodes[neighbor.node].isFire).length;

                    if (fireNeighborsCount >= 2) {
                        possibleRoutes.forEach(route => {
                            const path = [node, route.node];
                            escapeRoutes[node].push({
                                exit: exit,
                                path: path,
                                distance: route.weight
                            });
                        });
                    }
                }
            }
        }

        // 탈출구로 도달할 수 있는 경로가 없는 경우에만 다른 노드로 이동할 수 있는 경로 추가
        if (escapeRoutes[node].length === 0) {
            const possibleRoutes = graph[node].filter(neighbor => !nodes[neighbor.node].isFire);
            possibleRoutes.forEach(route => {
                const path = [node, route.node];
                escapeRoutes[node].push({
                    exit: "N/A", // 탈출구가 아닌 다른 노드로 이동
                    path: path,
                    distance: route.weight
                });
            });
        }
    }

    return escapeRoutes;
}

// 화재 발생 위치를 입력받아 탈출 경로를 계산하는 함수
function calculateEscapeRoutes() {
    const fireNodesInput = document.getElementById("fireNodesInput").value;
    const fireNodes = fireNodesInput.split(',').map(node => node.trim());

    // 모든 노드의 화재 상태 초기화
    for (let node in nodes) {
        nodes[node].isFire = false;
    }

    // 화재가 발생한 노드를 설정
    for (let fireNode of fireNodes) {
        if (nodes[fireNode]) {
            nodes[fireNode].isFire = true;
        }
    }

    const exits = ["A", "B", "C"]; // 탈출구 노드

    // 거리 행렬과 다음 노드 행렬 초기화
    let { dist, next } = initializeDistanceMatrix(nodes, graph);
    ({ dist, next } = floydWarshall(dist, next, nodes));

    // 탈출 경로 계산
    const escapeRoutes = findEscapeRoutes(dist, next, nodes, exits);

    // 결과를 HTML에 표시
    const resultElement = document.getElementById("result");
    const sosResultElement = document.getElementById("sosResult");
    resultElement.textContent = "All escape routes:\n";
    sosResultElement.textContent = "SOS routes:\n";

    // 각 노드의 탈출 경로를 출력
    for (let node in escapeRoutes) {
        const routes = escapeRoutes[node];
        const hasExitRoute = routes.some(route => route.exit !== "N/A");
        
        routes.forEach(route => {
            const isShortest = route.distance === Math.min(...routes.map(r => r.distance));
            const routeInfo = `Node ${node} -> ${route.exit === "N/A" ? "Next Node" : `Exit ${route.exit}`}: Path: ${route.path.join(' -> ')} ${isShortest && route.exit !== "N/A" ? '[Shortest]' : ''}\n`;
            resultElement.textContent += routeInfo;

            if (!hasExitRoute && route.exit === "N/A") {
                sosResultElement.textContent += routeInfo;
            }
        });
    }
}


