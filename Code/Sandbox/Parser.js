var exports = module.exports
var requireFromUrl = require('require-from-url/sync');
var fs = require('fs');
var dagre = require("dagre");
var dagreD3 = require("dagre-d3");
// var graphlib = requireFromUrl("https://dagrejs.github.io/project/graphlib-dot/v0.6.3/graphlib-dot.js")
// var d3v4 = requireFromUrl("https://d3js.org/d3.v4.js")

// var exports = module.exports{}
var links = fs.readFileSync("../../../Code/log.txt", 'utf8').split('\n')
var logs = [];
var clients = {};
// console.log(clients)
for(let i = 0; i < links.length; i++){
  let str = links[i];
  let spaces = str.split(' ');
  console.log(links[i])
  console.log(spaces)
  let obj = {date : spaces[0], time : spaces[1], ip : spaces[2], method : spaces[3], location: spaces[4], status : spaces[5]}
  logs[i] = obj;
  // console.log(links[i])
   console.log(logs[i])
}

//Bug: the logs may contain some undefined entries. Fixed the bug with undefined it was due to an empty line.

//Client segmentation
for(let i = 0; i < logs.length; i++){
  var ip = logs[i].ip;
  if(clients[ip] === undefined) {
    clients[ip] = [];
  }
  clients[ip].push(logs[i]);
}
// console.log(clients)
//sort by date/time
// var compare = function(a,b) {
//   if(a > b) return 1
//   else if (a === b) return 0
//   else return -1
// }
// for(var ip in clients){
//   if(ip !== undefined){
//     for(let i = 0; i < clients[ip].length; i++){
//       console.log(clients[ip][i])
//       let build1 = clients[ip][i].date.split('/')
//       let build2 = clients[ip][i].time.split(':')
//       let date = new Date();
//       date.setDate(build1[0])
//       date.setMonth(build1[1])
//       date.setFullYear(build1[2])
//       date.setHours(build2[0])
//       date.setMinutes(build2[1])
//       date.setSeconds(build2[2])
//       clients[ip][i].datetime = date;
//       //delete clients["154.103.165.66"][i].time;
//       // console.log(clients["154.103.165.66"][i].date);
//     }
//   }
// }
// for(var ip in clients){
//   // console.log(ip)
//   clients[ip].sort((a,b) => compare(a.datetime,b.datetime));
// }

// console.log(clients)

var filepath = "data.js"
var content = "var clients = " + JSON.stringify(clients);
fs.writeFile(filepath, content, (err) => {
    if (err) throw err;

    console.log("The file was succesfully saved!");
});


// var g = new dagreD3.graphlib.Graph()
// .setGraph({})
// .setDefaultEdgeLabel(function() { return {}; });
//
// for(let i = 0; i < clients["154.103.165.66"].length; i++){
//   g.setNode(i, {label: clients["154.103.165.66"][i].method, class: "type-" + clients["154.103.165.66"][i].method})
// }
// g.nodes().forEach(function(v) {
//   var node = g.node(v);
//   // Round the corners of the nodes
//   node.rx = node.ry = 5;
// });
//
// // Set up edges, no special attributes.
// for(let i = 1; i < clients["154.103.165.66"].length; i++){
//   g.setEdge(i-1,i);
// }



// console.log(clients["154.103.165.66"]);
// var render = new dagreD3.render();
// console.log(render)

// var g = new dagre.graphlib.Graph();
// g.setGraph({});
// g.setDefaultEdgeLabel(function() { return {}; });
//
// // Here we"re setting nodeclass, which is used by our custom drawNodes function
// // below.
// let width1 = 100;
//           for(let i = 0; i < clients["154.103.165.66"].length; i++){
//             g.setNode(i, {label: clients["154.103.165.66"][i].method, width : 105, height : 100})
//           }
//
// g.nodes().forEach(function(v) {
//   var node = g.node(v);
//   // Round the corners of the nodes
//   node.rx = node.ry = 5;
// });
//
// // Set up edges, no special attributes.
// for(let i = 1; i < clients["154.103.165.66"].length; i++){
//   g.setEdge(i-1,i);
// }
//
// // Create the renderer
// dagre.layout(g);
// exports.clients = clients;
// exports.graph = g;
// g.nodes().forEach(function(v) {
//      console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
// });
// g.edges().forEach(function(e) {
//     console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
// });
