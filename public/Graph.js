class Graph {
    constructor (nvertices) {
        this.nvertices = nvertices;
        this.adjList = new Map();
    }

    addVertex (v) {
        this.adjList.set(v, []);
    }

    addEdge (u, v) {
        this.adjList.get(u).push(v);
        this.adjList.get(v).push(u);
    }
}
