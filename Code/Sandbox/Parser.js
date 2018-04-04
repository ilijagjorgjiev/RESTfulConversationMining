var exports = module.exports
var requireFromUrl = require('require-from-url/sync');
var fs = require('fs');
var dagre = require("dagre");
var dagreD3 = require("dagre-d3");
// var graphlib = requireFromUrl("https://dagrejs.github.io/project/graphlib-dot/v0.6.3/graphlib-dot.js")
// var d3v4 = requireFromUrl("https://d3js.org/d3.v4.js")


var links = fs.readFileSync("../../../Code/log.txt", 'utf8').split('\n')
var logs = [];
var clients = {};


//Read the file and parse it to objects
for(let i = 0; i < links.length; i++){
  let str = links[i];
  let spaces = str.split(' ');
  if(str != ''){
    let obj = {date : spaces[0], time : spaces[1], ip : spaces[2], method : spaces[3], location: spaces[4], status : spaces[5]}
    logs[i] = obj;
  }
}


//Bug: the logs may contain some undefined entries. Fixed the bug with undefined it was due to an empty line. --Fixed

//Client segmentation.
for(let i = 0; i < logs.length; i++){
  var ip = logs[i].ip;
  if(clients[ip] === undefined) {
    clients[ip] = [];
  }
  clients[ip].push(logs[i]);
}

//Sort Each Client by time/date.
var compare = function(a,b) {
  if(a > b) return 1
  else if (a === b) return 0
  else return -1
}
for(var ip in clients){
  if(ip !== undefined){
    for(let i = 0; i < clients[ip].length; i++){
      console.log(clients[ip][i])
      let build1 = clients[ip][i].date.split('/')
      let build2 = clients[ip][i].time.split(':')
      let date = new Date();
      date.setDate(build1[0])
      date.setMonth(build1[1])
      date.setFullYear(build1[2])
      date.setHours(build2[0])
      date.setMinutes(build2[1])
      date.setSeconds(build2[2])
      clients[ip][i].datetime = date;
    }
  }
}
for(var ip in clients){
  clients[ip].sort((a,b) => compare(a.datetime,b.datetime));
}

//Save Data into the data.js file.
var filepath = "data.js"
var content = "var clients = " + JSON.stringify(clients);
fs.writeFile(filepath, content, (err) => {
  if (err) throw err;

  console.log("The file was succesfully saved!");
});
