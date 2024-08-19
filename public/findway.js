const nodes = {
    "1": { isFire: true },
    "2": { isFire: true },
    "3": { isFire: true },
    "4": { isFire: true },
    "5": { isFire: true },
    "6": { isFire: true },
    "A": { isFire: true },
    "B": { isFire: true },
    "C": { isFire: true },
    "x": { isFire: true },
    "y": { isFire: true },
    "z": { isFire: true }
};

const graph = {
    "A": [{node: "5", weight: 100}],
    "B": [{node: "1", weight: 100}],
    "C": [{node: "4", weight: 100}],
    "x": [{node: "6", weight: 100}],
    "y": [{node: "2", weight: 100}],
    "z": [{node: "3", weight: 100}],
    "w": [{node: "5", weight: 100}],
    
    "1": [
        {node: "A", weight: 100},
        {node: "6", weight: 410},
        {node: "2", weight: 207}
    ],

    "2": [
        {node: "1", weight: 207},
        {node: "3", weight: 275},
        {node: "y", weight: 100}
    ],

    "3": [
        {node: "2", weight: 275},
        {node: "4", weight: 385},
        {node: "z", weight: 100}
    ],

    "4": [
        {node: "3", weight: 385},
        {node: "5", weight: 287},
        {node: "B", weight: 100}
    ],

    "5": [
        {node: "4", weight: 287},
        {node: "6", weight: 316},
        {node: "C", weight: 100},
        {node: "w", weight: 100}
    ],

    "6": [
        {node: "5", weight: 316},
        {node: "1", weight: 410},
        {node: "x", weight: 100}
    ]

}


