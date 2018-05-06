//Sequence Preserving Comparison
var seqPreservingComparison = function(client, length, nodes, start, incomingXorNodes, endName){
  var prev = start;
  var prevId = start;
  var endConection = {};
  var edges = [];
  var finalEnd;
  var k = null;
  var s = null;
  var l;
  for(let i = 0; i < length; i++){
    var str = client[i].method + client[i].location
    var key = client[i].method + ' ' + client[i].location;
    var status = client[i].status;
    if(nodes[str] === undefined){
      nodes[str] = {}
    }
    var node = {
      "id" : i,
      "startId" : prevId,
      "endId" : i,
      "dataNode" : client[i],
      "start" : prev,
      "end" : str+' '+status,
      "key" : key,
      "finalEnd" : start,
      "finalStart" : prev
    }
    let delay = computeDelay(nodes, node.start, node.dataNode);
    if(k == null || s == null){
      k = str;
      s = status;
    }
    else{
      l = nodes[k][s].statusArray.length;
      nodes[k][s].statusArray[l-1].finalEnd = str+' '+status;
      k = str;
      s = status;
    }
    if(nodes[str][status] === undefined){
      nodes[str][status] = {
        statusArray : [],
        outgoingXOR : false,
        delayArray : [],
      }
    }
    nodes[str][status].delayArray.push(delay);
    prev = str + ' ' + status;
    prevId = i;
    nodes[str][status].statusArray.push(node)
    if(i == (length-1)){
      endConection.e1 = prev;
      l = nodes[str][status].statusArray.length;
      nodes[k][s].statusArray[l-1].finalEnd = endName;
    }
  }
  nodes = outgoingXOR(nodes);
  nodes = incomingXOR(nodes, start, incomingXorNodes);
  nodes.endConection = endConection;
  return nodes;
}
var outgoingXOR = function(nodes){
  var counterArray = []
  var xorTitle;
  for(var key in nodes){
    for(var status in nodes[key]){
      if(nodes[key][status].statusArray.length > 1){
        let check = false;
        for(let i = 0; i < nodes[key][status].statusArray.length; i++){
          for(let j = i + 1; j < nodes[key][status].statusArray.length; j++){
            if(nodes[key][status].statusArray[i].finalEnd != nodes[key][status].statusArray[j].finalEnd){
              check = true;
            }
          }
        }
        if(check){
          xorTitle = key + ' ' + status;
          nodes[key][status].outgoingXOR = true;
          counterArray.push(xorTitle);
        }
      }
    }
  }
  for(var key in nodes){
    for(var status in nodes[key]){
      for(let i = 0; i < nodes[key][status].statusArray.length; i++){
        for(let j = 0; j < counterArray.length; j++){
          if(counterArray[j] == nodes[key][status].statusArray[i].start){
            // console.log(counterArray[j]);
            nodes[key][status].statusArray[i].start = "XOR-" + counterArray[j];
          }
        }
      }
    }
  }
  return nodes;
}
var incomingXOR = function(nodes, start, incomingXorNodes){
  var incomingXorKeys = []
  var keyCounter = 0;
  var keyArray = []
  for(var key in nodes){
    keyArray.push(key);
  }
  for(let i = 0; i < keyArray.length; i++){
    for(var key in nodes){
      for(var status in nodes[key]){
        for(let j = 0; j < nodes[key][status].statusArray.length; j++){
          let spaces = nodes[key][status].statusArray[j].end.split(' ');
          if((spaces[0] == start && i == 0) || spaces[0] == "XOR-"+keyArray[i] || spaces[0] == keyArray[i]){
            keyCounter++;
          }
        }
      }
    }
    if(keyCounter > 1){
      incomingXorKeys.push({ "key" : keyArray[i], "id" : i})
    }
    keyCounter = 0;
  }
  for(let i = 0; i < incomingXorKeys.length; i++){
    for(var key in nodes){
      if(key == incomingXorKeys[i].key){
        for(var status in nodes[key]){
          for(let j = 0; j < nodes[key][status].statusArray.length; j++){
            if(nodes[key][status].statusArray[j].start !== "inXOR-" + key){
              var spaces = nodes[key][status].statusArray[j].start
              nodes[key][status].statusArray[j].start = "inXOR-" + key
              if(incomingXorNodes[key] === undefined){
                incomingXorNodes[key] = {};
              }
              if(incomingXorNodes[key][spaces] === undefined){
                incomingXorNodes[key][spaces] = [];
              }
              incomingXorNodes[key][spaces].push(spaces.split(' '));
            }
          }
        }
      }
    }
  }
  var obj = {
    "nodes" : nodes,
    incomingXorNodes : incomingXorNodes,
  }
  return obj;
}

//Compute Delay Avg
var computeDelayAvg = function(nodes, key, st){
  var avg = 0;
  var counter = 0;
  if(st == "total"){
    let counter = 0;
    for(var status in nodes[key]){
      for(let i = 0; i < nodes[key][status].delayArray.length; i++){
        avg += nodes[key][status].delayArray[i];
        counter++;
      }
    }
    return (avg/counter);
  }
  for(let i = 0; i < nodes[key][st].delayArray.length; i++){
    avg += nodes[key][st].delayArray[i];
  }
  return (avg/nodes[key][st].delayArray.length);
}

//Simple Comparison Algorithm
var simpleComparison = function(clients, clientIP){
  var size = clients[clientIP].length
  var responses = [];
  var marked = new Array(size).fill(false);
  for(let i = 0; i < size; i++){
    responses[i] = [];
    if(!marked[i]){
      responses[i].push({id : i, client : clients[clientIP][i]})
      marked[i] = true;
      for(let j = i+1; j < size; j++){
        if((clients[clientIP][j].status != responses[i][0].client.status) && (clients[clientIP][j].method == responses[i][0].client.method) &&
        clients[clientIP][j].location == responses[i][0].client.location){
          marked[j] = true;
          responses[i].push({id : j, client : clients[clientIP][j] })
        }
      }
    }
  }
  return responses;
}

var computeDelay = function(nodes, startNode, endNode){
  if(startNode.includes("start")) return 0;
  startNode = startNode.split(' ');
  let length = nodes[startNode[0]][startNode[1]].statusArray.length;
  let startDate = new Date(nodes[startNode[0]][startNode[1]].statusArray[length-1].dataNode.datetime)
  let endDate = new Date(endNode.datetime);
  return (endDate-startDate);
}

var totalNumberOfRequests = function(nodes){
  var counter = 0;
  var totalNumberOfRequests = {}
  var max = Number.MIN_VALUE;
  for(var key in nodes){
    for(var status in nodes[key]){
      counter += (nodes[key][status].statusArray.length);
    }
    totalNumberOfRequests[key] = counter;
    if(max < counter){
      max = counter;
    }
    counter = 0;
  }
  return {"total" : totalNumberOfRequests,
  "maxRequests" : max};
}

var getSelectedPeriods = function(timePeriods){
  var elem = document.getElementById("multiSelect");
  var result = [];
  var options = elem && elem.options;
  var opt;
  for (let i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(timePeriods[parseInt(opt.value)] || timePeriods[parseInt(opt.text)]);
    }
  }
  var obj = {
    "identify" : "tp",
    "data" : result
  }
  drawGraph(obj);
}

var differenceThreshold = function(client){
  let avg = 0;
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  var timePeriods = [];
  for(let i = 1; i < client.length; i++){
    let date = new Date(client[i-1].datetime)
    let date1 = new Date(client[i].datetime)
    let diff = Math.abs(date1-date);
    avg+=diff;
    if(max < diff) max = diff
    if(min > diff) min = diff;
  }
  avg /= (client.length-1);
  let days =  (avg / (1000*60*60*24));
  let diffThreshold = (min+max)/2;
  var timeP = []
  timeP.push(client[0])
  for(let i = 1; i < client.length; i++){
    let date = new Date(client[i-1].datetime)
    let date1 = new Date(client[i].datetime)
    let diff = Math.abs(date1-date);
    if(diff > diffThreshold){
      timePeriods.push(timeP);
      timeP = []
    }
    timeP.push(client[i]);
  }
  return timePeriods;
}
