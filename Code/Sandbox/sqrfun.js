//Sequence Preserving Comparison
var seqPreservingComparison = function(client, length, nodes, start, incomingXorNodes, endName, tpIndex, comparisonTableData){
  var prev = start;
  var prevId = start;
  var endConnection = {};
  var edges = [];
  var finalEnd;
  var k = null;
  var s = null;
  var l;
  for(let i = 0; i < length; i++){
    var str = client[i].method + client[i].location;
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
      "finalStart" : prev,
    }
    let delay = computeDelay(nodes, node.start, node.dataNode);
    if(k == null || s == null){
      k = str;
      s = status;
    }
    else{
      l = nodes[k][s].statusArray.length;
      nodes[k][s].statusArray[l-1].finalEnd = str+' '+status;
      // if(k == "DELETE/last" && s == "204") nodes[k][s].statusArray[l-1].finalEnd = "POST/prev" + ' ' + "400";
      // if(k == "PUT/next" && s == "200") nodes[k][s].statusArray[l-1].finalEnd = "OPTIONS/other" + ' ' + "200";
      k = str;
      s = status;
    }
    if(nodes[str][status] === undefined){
      nodes[str][status] = {
        statusArray : [],
        outgoingXOR : false,
        delayArray : [],
        tpIpArray : [],
      }
    }
    if(nodes[str][status].tpIpArray.includes(tpIndex) != true){
      nodes[str][status].tpIpArray.push(tpIndex);
    }
    nodes[str][status].delayArray.push(delay);
    prev = str + ' ' + status;
    prevId = i;
    nodes[str][status].statusArray.push(node)
    if(i == (length-1)){
      endConnection.e1 = prev;
      l = nodes[str][status].statusArray.length;
      nodes[k][s].statusArray[l-1].finalEnd = endName;
    }
  }
  nodes = outgoingXOR(nodes);
  nodes = incomingXOR(nodes, start, incomingXorNodes);
  nodes.endConnection = endConnection;
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
            if(nodes[key][status].statusArray[i].finalEnd.split(' ')[0] != nodes[key][status].statusArray[j].finalEnd.split(' ')[0]){
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

// var getSelectedPeriods = function(timePeriods){
//   var elem = document.getElementById("multiSelect");
//   var result = [];
//   var options = elem && elem.options;
//   var opt;
//   for (let i=0, iLen=options.length; i<iLen; i++) {
//     opt = options[i];
//
//     if (opt.selected) {
//       result.push(timePeriods[parseInt(opt.value)] || timePeriods[parseInt(opt.text)]);
//     }
//   }
//   var obj = {
//     "identify" : "tp",
//     "data" : result
//   }
//   return result;
//   // drawGraph(obj);
// }
var getSelectedIPs = function(clients, elem){
  var result = {};
  var options = elem && elem.options;
  var opt;
  for (let i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result[opt.value] = (clients[opt.value] || clients[parseInt(opt.text)]);
    }
  }
  return result;
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
  if(timeP != []) timePeriods.push(timeP);
  return timePeriods;
}
var checkIfIncomingXorExists = function(nodes, key, incomingXorNodes, size, inXorId){

  if(size == 1){
    // console.log(key, incomingXorNodes);
    var id = Object.keys(incomingXorNodes[key])[0].split(' ');
    var k = id[0];
    var s = id[1];
    for(var status in nodes[key]){
      for(let i = 0; i < nodes[key][status].statusArray.length; i++){
        if(nodes[key][status].statusArray[i].start == inXorId){
          nodes[key][status].statusArray[i].start = id[0] + ' ' + id[1];
        }
      }
    }
    // console.log(nodes[key]);
  }
}

var multipleIncomingXorSetUp = function(g, nodes, key, inXorIdSize, maxDelay, minDelay, incomingXorNodes){
  var str = "inXOR-"+key
  if(inXorIdSize > 1){
    for(var space in incomingXorNodes[key]){
      var len = incomingXorNodes[key][space][0].length;
      if(len == 1){
        g.setEdge(incomingXorNodes[key][space][0][0], str,
          {class: "edge-thickness-" + incomingXorNodes[key][space].length + " delay-coloring-0"})
        }
        else{
          let avg = getIncomingEdgeIndexDelay(nodes, key, incomingXorNodes[key][space][0][0]+' '+incomingXorNodes[key][space][0][1], incomingXorNodes[key][space].length);
          // console.log(avg);
          bin = computeAssignBin(avg, maxDelay, 1);
          let p = getProbabilityLabel(nodes, incomingXorNodes[key][space][0][0], incomingXorNodes[key][space][0][1], incomingXorNodes[key][space].length);
          g.setEdge(incomingXorNodes[key][space][0][0]+' '+incomingXorNodes[key][space][0][1], str,
          { label: p,
            class: "edge-thickness-" + incomingXorNodes[key][space].length + " delay-coloring-"+bin})
        }
      }
    }
    else{
      // if(nodes["GET/post"]) console.log("Trigger");
      for(var space in incomingXorNodes[key]){
        var len = incomingXorNodes[key][space][0].length;
        if(len == 1){
          g.setEdge(incomingXorNodes[key][space][0][0], key,
            {class: "edge-thickness-" + incomingXorNodes[key][space].length + " delay-coloring-0"})
          }
          else{
            let avg = getIncomingEdgeIndexDelay(nodes, key, incomingXorNodes[key][space][0][0]+' '+incomingXorNodes[key][space][0][1], incomingXorNodes[key][space].length);
            bin = computeAssignBin(avg, maxDelay, 1);
            let p = getProbabilityLabel(nodes, incomingXorNodes[key][space][0][0], incomingXorNodes[key][space][0][1], incomingXorNodes[key][space].length);
            g.setEdge(incomingXorNodes[key][space][0][0]+' '+incomingXorNodes[key][space][0][1], key,
            { label: p,
              class: "edge-thickness-" + incomingXorNodes[key][space].length + " delay-coloring-"+bin})
          }
      }
    }
  }
  var getProbability = function(nodes, key, status, length){
    return (roundUp(length/nodes[key][status].statusArray.length*100,1));
  }
  var getProbabilityLabel = function(nodes, s1, s2, length){
    if(s1.includes("start")) return '';
    s1 =  s1.split('-')
    if(s1.length > 1) s1 = s1[1];
    else s1 = s1[0];
    let p = getProbability(nodes, s1, s2, length);
    if(p == 100) p = '';
    else p = p+'%';
    return p;
  }
  // var getComparisonTableNodes = function(nodes, comparisonTableData){
  //   var array = [];
  //   var totalArray = [];
  //   for(var key in nodes){
  //     if(comparisonTableData.nodes[key] === undefined){
  //       comparisonTableData.nodes[key] = {
  //         statuses : {},
  //         totalArray : [],
  //       }
  //     }
  //     for(var status in nodes[key]){
  //       for(let i = 0; i < nodes[key][status].statusArray.length; i++){
  //           if(array.includes(nodes[key][status].tpIpArray[i]) != true){
  //           array.push(nodes[key][status].tpIpArray[i]);
  //         }
  //         if(totalArray.includes(nodes[key][status].tpIpArray[i]) != true) totalArray.push(nodes[key][status].tpIpArray[i]);
  //       }
  //       if(array.length > 1) comparisonTableData.overlappingNodes.size++;
  //       else comparisonTableData.uniqueNodes.size++;
  //
  //       //nodecounter[array.length]++
  //       //nodecounter[1] // uniqueNodes
  //       //nodecounter[2] // two IP
  //       //nodecounter[3] // three IP
  //
  //       //nodeipcounter[IP]++ //how many nodes has IP?
  //
  //       if(comparisonTableData.nodes[key].statuses[status] === undefined){
  //         comparisonTableData.nodes[key].statuses[status] = [];
  //         comparisonTableData.nodes[key].statuses[status] = array;
  //       }
  //       array = [];
  //     }
  //     //BUG
  //     if(totalArray.length > 1) comparisonTableData.overlappingNodes.size++;
  //     let l = Object.keys(nodes[key]).length;
  //     if(totalArray.length == 1 && l > 1) comparisonTableData.uniqueNodes.size++;
  //     comparisonTableData.nodes[key].totalArray = totalArray;
  //     totalArray = [];
  //   }
  //   return comparisonTableData;
  // }
  var increaseAppropriateEdge = function(size, key, status, comparisonTableData, kind){
    if(kind === "outgoingXOR" && size == 1){
      if(comparisonTableData.nodes[key].totalArray.length == 1) comparisonTableData.uniqueEdges.size++;
      else comparisonTableData.overlappingEdges.size++;
    }
    else if(kind === "incomingXOR" && size == 1){
      if(comparisonTableData.nodes[key].totalArray.length == 1) comparisonTableData.uniqueEdges.size++;
      else comparisonTableData.overlappingEdges.size++;
    }
    else if(kind === "middleXOR"){
      if(comparisonTableData.nodes[key].statuses[status].length == 1) comparisonTableData.uniqueEdges.size++;
      else comparisonTableData.overlappingEdges.size++;
    }
  }

  var updateComparisonUniqueness = function(word, comparisonTableData, key, status){
    var dataUniqueness = comparisonTableData.uniqueness;
    var dataUniquenessNodes = comparisonTableData.uniquenessNodes;
    var dataNodeIpTp = comparisonTableData.nodeIpTp
    var _word = word.split(' ');
    _word.sort().reverse();
    if(dataUniqueness[_word.length-1] === undefined) dataUniqueness[_word.length-1] = 1;
    else dataUniqueness[_word.length-1]++;
    if(_word.length > 2) comparisonTableData.uniqueOverlapping.overlappingNodes.size++;
    else comparisonTableData.uniqueOverlapping.uniqueNodes.size++;
    var tPiP="";
    for(let i = 0; i < _word.length-1; i++){
      let val = _word[i].split('-')[1];
      if(i) tPiP += '-' + val
      else tPiP += val
      if(dataNodeIpTp[val] === undefined) dataNodeIpTp[val] = 1;
      else dataNodeIpTp[val]++;
    }
    if(dataUniquenessNodes[tPiP] === undefined) {
      dataUniquenessNodes[tPiP] = {};
      dataUniquenessNodes[tPiP].counter = 1;
      dataUniquenessNodes[tPiP].nodes = [];
      if(status === undefined) dataUniquenessNodes[tPiP].nodes.push(key);
      else dataUniquenessNodes[tPiP].nodes.push(key+' '+status);
    }
    else{
      dataUniquenessNodes[tPiP].counter++;
      if(status === undefined) dataUniquenessNodes[tPiP].nodes.push(key);
      else dataUniquenessNodes[tPiP].nodes.push(key+' '+status);
    }
  }
  var createComparisonUniquenessTable = function(data){
    var fx = function(data, arr){
      for(var node in data){
        if(node == 1) arr.push(["Unique Nodes", data[node]]);
        else arr.push(["Shared-"+node, data[node]]);
      }
    }
    return createPieChart(data, fx, "Number of Shared Nodes");
  }
  var createComparisonNodeIpTpTable = function(data){
    var fx = function(data, arr){
      for(var node in data){
        arr.push(["IP/TP Nodes-"+node, data[node]]);
      }
    }
    return createPieChart(data, fx, "IP/TP Number of Nodes")
  }
  var createConversationSharingNodes = function(data){
    var fx = function(data, arr){
    for(var elem in data){
      const oldElem = elem;
      elem = elem.split('-')
      if(elem.length > 1){
        arr.push(["IP/TP " + oldElem, data[oldElem].counter]);
      }
      else{
        arr.push(["IP/TP " + oldElem, data[oldElem].counter]);
      }
    }
  }
    return createPieChart(data, fx, "IP/TP Shared Nodes")
  }
  var createPieChart = function(data, fx, title){
    var arr = []
    arr.push(["Task", "Hours Per Day"]);
    fx(data, arr);
    // Optional; add a title and set the width and height of the chart
    var options = {'title': title, 'width':"50%", 'height': "200px"};

    // Display the chart inside the <div> element with id="piechart"
    return {data : arr,
            options : options}

  }
  var createTable = function(data, fx, id, caption){
    var i = 1;
    var table = document.createElement("TABLE");
    table.createCaption();
    table.innerHTML = "<b>" + caption + "</b>";
    var container = document.getElementById("comparisonTableData");
    var x = document.createElement("TR");
    x.setAttribute("id", ("myTr"+id));
    container.appendChild(table);
    table.setAttribute("id", id);
    table.appendChild(x);
    var y = document.createElement("TR");
    y.setAttribute("id", ("myTr1"+id));
    table.appendChild(y);
    for(var input in data){
      var th = document.createElement("TH")
      var td = document.createElement("TD");
      var str = fx(i);
      var text = document.createTextNode(str);
      var text1 = document.createTextNode(data[input]);
      th.appendChild(text);
      // console.log(x);
      x.appendChild(th);
      td.appendChild(text1);
      y.appendChild(td);
      i++;
    }
  }
  var clearTable = function(){
    var container = document.getElementById("comparisonTableData");
    while(container.hasChildNodes()) {
      container.removeChild(container.childNodes[0])
    };
  }
