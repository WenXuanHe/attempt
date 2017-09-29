/**
 * 图和图算法
 * @param {[type]} v [description]
 */
var Graph = function (v) {

    this.vertices = v;
    this.edges = 0;
    this.adj = [];
    this.list = [];
    this.current = null;
    for (var i = 0; i < this.vertices; i++) {
        this.adj[i] = [];
    }

    // 循环则不再遍历
    this.marked = [];
    for (var i = 0; i < this.vertices; ++i) {
        this.marked[i] = false;
    }
}
Graph.prototype = {
    addEdge: function (v, w) {
        this.adj[v].push(w);
        this.adj[w].push(v);
        this.edges++;
    },
    showGraph: function () {
        for (var i = 0; i < this.vertices; ++i) {
            console.log(i + " -> ");
            for (var j = 0; j < this.vertices; ++j) {
                if (this.adj[i][j] != undefined) {
                    console.log(this.adj[i][j] + ' ');
                }
            }
        }
    },

    // 深度优先遍历
    dfs: function (v) {
        this.marked[v] = true;
        if (this.adj[v] != undefined) {
            console.log("Visited vertex: " + v);
        }
        for (var w = 0; w < this.adj[v].length; w++) {
            var item = this.adj[v][w];
            if (!this.marked[item]) {
                this.dfs(item);
            }
        }
    },
    // 广度优先遍历
    bfs: function(v){
        this.marked[v] = true;
        if (this.adj[v] != undefined) {
            console.log("Visited bfs: " + v);
        }

        [].push.apply(this.list, this.adj[v]);
        this.current = this.list.shift();
        while(this.marked[this.current] && typeof this.current !== 'undefined'){
            this.current = this.list.shift();
        }
        if(!this.marked[this.current] && typeof this.current !== 'undefined'){
            this.bfs(this.current);
        }
    }
};

var g = new Graph(10);
g.addEdge(0, 1);
g.addEdge(0, 2);
g.addEdge(1, 3);
g.addEdge(4, 3);
g.addEdge(2, 4);
g.addEdge(8, 9);
g.addEdge(4, 5);
g.addEdge(5, 7);
g.addEdge(7, 9);
g.showGraph();
// g.dfs(0);
g.list = [];
g.bfs(0);
