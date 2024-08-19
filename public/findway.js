class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    addEdge(vertex1, vertex2, weight) {
        this.adjacencyList[vertex1].push({node : vertex2, weight});
        this.adjacencyList[vertex2].push({node : vertex1, weight});
    }

    display() {
        for (let vertex in this.adjacencyList) {
            console.log(vertex, '=>', JSON.stringify(this.adjacencyList[vertex]));
        }
    }

    getNeighbors(vertex) {
        return this.adjacencyList[vertex];
    }

}

let graph = new Graph();

graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("1");
graph.addVertex("2");
graph.addVertex("3");
graph.addVertex("4");
graph.addVertex("5");
graph.addVertex("6");

graph.addEdge("A","1", 100);
graph.addEdge("1","2", 316);;
graph.addEdge("2", "6", 410);
graph.addEdge("6","B", 100);
graph.addEdge("6","5", 207);
graph.addEdge("5","4", 275);
graph.addEdge("4","3", 385);
graph.addEdge("3","C", 100);
graph.addEdge("3","1", 287);

graph.display();


/*

// A*알고리즘을 이용한 최단거리 찾기 (일부)

class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(val, priority) {
        this.values.push({val, priority});
        this.sort();
    }

    dequeue() {
        return this.values.shift();
    }

    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }
}

function aStar(graph, start, goals) {
    const openSet = new PriorityQueue();
    openSet.enqueue(start, 0);
    
    const cameFrom = {};
    const gScore = {};
    const fScore = {};
    
    for (let node in graph) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    }
    
    gScore[start] = 0;
    fScore[start] = heuristic(start, goals);
    
    while (openSet.values.length) {
        const current = openSet.dequeue().val;
        
        if (goals.includes(current)) {
            return reconstructPath(cameFrom, current);
        }
        
        for (let neighbor of graph[current]) {
            const tentativeGScore = gScore[current] + neighbor.weight;
            
            if (tentativeGScore < gScore[neighbor.node]) {
                cameFrom[neighbor.node] = current;
                gScore[neighbor.node] = tentativeGScore;
                fScore[neighbor.node] = gScore[neighbor.node] + heuristic(neighbor.node, goals);
                
                if (!openSet.values.some(el => el.val === neighbor.node)) {
                    openSet.enqueue(neighbor.node, fScore[neighbor.node]);
                }
            }
        }
    }
    
    return "No path found";
}

function heuristic(node, goals) {
    // Heuristic function can be Euclidean distance, Manhattan distance, etc.
    // For this example, we use a simple constant heuristic.
    // If goals is an array, we return the minimum heuristic value to any goal.
    return Math.min(...goals.map(goal => {
        // Insert your heuristic calculation here (like Euclidean distance)
        return 1; // Placeholder, should be the distance from node to goal
    }));
}

function reconstructPath(cameFrom, current) {
    const totalPath = [current];
    while (cameFrom[current]) {
        current = cameFrom[current];
        totalPath.push(current);
    }
    return totalPath.reverse();
}

// Example usage:

const graph = {
    "1": [{node: "A", weight: 100}, {node: "2", weight: 316}, {node: "z", weight: 100}],
    "2": [{node: "1", weight: 316}, {node: "x", weight: 100}, {node: "6", weight: 410}],
    "3": [{node: "4", weight: 385}, {node: "C", weight: 100}, {node: "1", weight: 287}],
    "4": [{node: "5", weight: 275}, {node: "w", weight: 100}, {node: "3", weight: 385}],
    "5": [{node: "6", weight: 207}, {node: "y", weight: 100}, {node: "4", weight: 275}],
    "6": [{node: "2", weight: 410}, {node: "B", weight: 100}, {node: "5", weight: 207}],
    "A": [{node: "1", weight: 100}],
    "B": [{node: "6", weight: 100}],
    "C": [{node: "3", weight: 100}],
    "x": [{node: "2", weight: 100}],
    "y": [{node: "5", weight: 100}],
    "z": [{node: "1", weight: 100}],
    "w": [{node: "4", weight: 100}]
};

const startNode = "1";
const goalNodes = ["A", "B", "C"];

const path = aStar(graph, startNode, goalNodes);

console.log("Path to nearest exit:", path);
*/