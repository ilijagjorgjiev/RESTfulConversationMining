
var conversionPath = function(class_prefix, color){
  let style = document.createElement('style')

  // style.disabled = true;
  // WebKit hack :(
  style.appendChild(document.createTextNode(""));

  // Add the <style> element to the page
  document.head.appendChild(style);
  var sheet = style.sheet;
  var st = "fill: rgb("+color[0]+","+color[1]+","+color[2]+")";
  var clazz = "."+class_prefix+"-"+0;
  sheet.insertRule(".enable-path-0 " +clazz+" { "+st+" }");
  var clazz = "."+class_prefix+"-"+1;
  sheet.insertRule(".enable-path-1 " +clazz+" { fill:red }");
  sheet.insertRule(".enable-path-0.enable-path-1 " +"."+class_prefix+"-"+0+"."+class_prefix+"-"+1+" { fill:purple }");
  var x = document.getElementsByTagName("STYLE")[3];
  // x.disabled = false;
}
var setFxClasses = function(class_prefix, minShading, maxShading, fx, sheet){
  var MAX = maxShading;
  for(let i = minShading; i <= maxShading; i++){
    var percent = calculatePercentage(minShading, MAX, i);

    var st = fx(percent, i);

    var clazz = "."+class_prefix+"-"+i;

    sheet.insertRule(clazz+" { "+st+" }");
  }
}

var setDelayFrequencyColoring = function(first_color, second_color, class_prefix, minShading, maxShading, sheet){

  var fx = function(percent, lvl){

    var color = getGradientColor(first_color, second_color, percent);

    if (lvl == 0) { color = "black;"}

    var fill = "fill: rgb("+color[0]+","+color[1]+","+color[2]+");";
    var stroke = "stroke: rgb("+color[0]+","+color[1]+","+color[2]+");";
    return (stroke + '\n' + fill);

  };

  setFxClasses(class_prefix, minShading, maxShading, fx, sheet)

}
var setNodeFrequencyColoring = function(first_color, second_color, class_prefix, minShading, maxShading, sheet){
  var fx = function(percent, lvl){
    var color = getGradientColor(first_color, second_color, percent);
    var st = "fill: rgb("+color[0]+","+color[1]+","+color[2]+")";
    return st;
  }
  setFxClasses(class_prefix, minShading, maxShading, fx, sheet);
}
// Edge Frequency Thickness
var setEdgeFrequencyThickness = function(class_prefix, minShading, maxShading, sheet){
  var fx = function(percent, lvl){
    var w = 3;
    var particle = w/maxShading;
    lvl--;
    w = 1.5 + lvl*particle;
    var st = "stroke: #333; fill: black; stroke-width: "+ w +"px;";
    return st;
  }
  setFxClasses(class_prefix, minShading, maxShading, fx, sheet);
}
var deleteStyles = function(){
  var x = document.getElementsByTagName("STYLE");
  for(let i = 0; i < x.length; i++){
    x[i].remove();
  }
}

//Set Classes of Nodes, corresponding with their number of requests.
var setNodeClasses = function(g, nodes, totalRequestsData){
  var totalRequests = totalRequestsData.total;
  var maxRequests = totalRequestsData.maxRequests;
  var red = [255,0,0];
  var yellow = [255,255,0];
  for(var key in g._nodes){
    if(g._nodes[key].shape == "rect"){
      var spaces = key.split(' ');
      if(spaces[1] === undefined){
        // var percent = calculatePercentage(1, maxRequests, totalRequests[key]);
        // var color = getGradientColor(red, yellow, (percent));
        // g._nodes[key].style = "fill: rgb("+color[0]+","+color[1]+","+color[2]+")"
        g._nodes[key].class += " totalRequest-"+totalRequests[key];
      }
      else{
        // var percent = calculatePercentage(1, maxRequests, nodes[spaces[0]][spaces[1]].statusArray.length);
        // var color = getGradientColor(red, yellow, (percent));
        // g._nodes[key].style = "fill: rgb("+color[0]+","+color[1]+","+color[2]+")"
        g._nodes[key].class += " totalRequest-"+nodes[spaces[0]][spaces[1]].statusArray.length;
      }
    }
  }
}
//Get Delay Avg for Incoming Edge
var getIncomingEdgeIndexDelay = function(nodes, k, node, counter){
  let avg = 0;
  let checker = 0;
  for(var s in nodes[k]){
    for(let i = 0; i < nodes[k][s].statusArray.length; i++){
      // if(k == 'POST/last') console.log(nodes[k][s].statusArray[i])
      if(nodes[k][s].statusArray[i].finalStart == node || 'XOR-'+nodes[k][s].statusArray[i].finalStart == node){
        avg+=nodes[k][s].delayArray[i];
        checker++;
      }
    }
  }
  if(checker == counter) return (avg/counter);
  else {
    // console.log(nodes[k][s].statusArray);
    // console.log(nodes[k]);
    // console.log(counter);
    // console.log(k,node);
    console.log("ERROR IN getIncomingEdgeIndexDelay")
  };
}
var setStyles = function(){
  for(let i = 0; i < 3; i++){
    let style = document.createElement('style')

    style.disabled = true;
    // WebKit hack :(
    style.appendChild(document.createTextNode(""));

    // Add the <style> element to the page
    document.head.appendChild(style);
    var x = document.getElementsByTagName("STYLE")[i];
    x.disabled = true;
  }
}
var setVisualizationConfig = function(nfc, eft, edc, maxRequests){
  var VisualizationConfig = document.getElementById("VisualizationConfig");
  var red = [255,0,0];
  var yellow = [255,255,0];
  setStyles();
  setNodeFrequencyColoring(red, yellow, "totalRequest", 1, maxRequests, document.getElementsByTagName("STYLE")[0].sheet);
  setEdgeFrequencyThickness("edge-thickness", 1, maxRequests, document.getElementsByTagName("STYLE")[1].sheet);
  setDelayFrequencyColoring(red, yellow, "delay-coloring", 0, 128, document.getElementsByTagName("STYLE")[2].sheet)
  setElementOnClick(nfc, 0);
  setElementOnClick(eft, 1);
  setElementOnClick(edc, 2);
  VisualizationConfig.style = "diplay: visible;"
}
var setElementOnClick = function(elem, index){
  elem.onclick = function(){
    if(elem.checked != true){
      var x = document.getElementsByTagName("STYLE")[index];
      x.disabled = true;
    }
    else{
      var x = document.getElementsByTagName("STYLE")[index];
      x.disabled = false;;
    }
  };
}

//Get Min & Max Delay Value of the whole Graph
var computeMinMaxAvgDelayVal = function(nodes){
  var MAXtotal = Number.MIN_VALUE;
  var MINtotal = Number.MAX_VALUE;
  var avgStatus = 0;
  var avgTotal = 0;
  var counterStatus = 0;
  var counterTotal = 0;
  var totalAvgKey = {};
  for(var key in nodes){
    for(var status in nodes[key]){
      for(let i = 0; i < nodes[key][status].delayArray.length; i++){
        avgStatus+= nodes[key][status].delayArray[i];
        if(MAXtotal < nodes[key][status].delayArray[i]) MAXtotal = nodes[key][status].delayArray[i];
        avgTotal += nodes[key][status].delayArray[i];
        counterStatus++;
        counterTotal++;
      }
      avgStatus = (avgStatus/counterStatus);
      nodes[key][status].avgDelay = avgStatus;
      if(MAXtotal < avgStatus) MAXtotal = avgStatus;
      if(MINtotal > avgStatus) MINtotal = avgStatus;
      avgStatus = 0;
      counterStatus = 0;
    }
    if(totalAvgKey[key] === undefined){
      totalAvgKey[key] = {};
      avgTotal = avgTotal/counterTotal;
      totalAvgKey[key].totalDelayAvgKey = avgTotal;
    }
    if(MAXtotal < avgTotal) MAXtotal = avgTotal;
    if(MINtotal > avgTotal) MINtotal = avgTotal;
    avgTotal = 0;
    counterTotal = 0;
  }
  return {
    nodes : nodes,
    totalAvgKey : totalAvgKey,
    MAX : MAXtotal,
    MIN : MINtotal,
  };
}
//Compute Bin and Assign it
var computeAssignBin = function(val, max, min){
  var particle = (max - min)/128
  var bin = Math.ceil((val - min)/particle);
  return bin;
}

//Disable Coloring, Set Media to Print
var getGradientColor = function(color1, color2, weight){
  var w1 = weight;
  var w2 = 1 - w1;
  var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
  Math.round(color1[1] * w1 + color2[1] * w2),
  Math.round(color1[2] * w1 + color2[2] * w2)];
  return rgb;
}
var calculatePercentage = function(min, max, val){
  if((max-min) == 0) return 1;
  return (((val - min)) / (max - min))
}
var roundUp = function(num, precision){
  precision = Math.pow(10, precision)
  return Math.ceil(num * precision) / precision
}
var setUpClassForDifferentIpTp = function(nodes, key, status){
  var word = "";
  for(let i = 0; i < nodes[key][status].tpIpArray.length; i++){
    word += ('tpIpColoring-' + nodes[key][status].tpIpArray[i] + ' ');
  }
  return word;
}
var setUpTotalClassForDifferentIpTp = function(nodes, key){
  var array = [];
  var word = "";
  for(var status in nodes[key]){
    for(let i = 0; i < nodes[key][status].tpIpArray.length; i++){
      if(array.includes(nodes[key][status].tpIpArray[i]) != true){
        array.push(nodes[key][status].tpIpArray[i]);
        word += ('tpIpColoring-' + nodes[key][status].tpIpArray[i] + ' ');
      }
    }
  }
  return word;
}
// var getAllTpIp = function(nodes){
//   var array = []
//   for(var key in nodes){
//     for(var status in nodes[key]){
//       for(let i = 0; i < nodes[key][status].tpIpArray.length; i++){
//         if(array.includes(nodes[key][status].tpIpArray[i]) != true) array.push(nodes[key][status].tpIpArray[i]);
//       }
//     }
//   }
//   return array;
// }
// var pattern = {
//   "1" : {
//     method : "GET",
//     status : "200"
//   },
//   "2" : {
//     method : "POST",
//     status : "401"
//   }
// }
// var hasPattern = function(pattern, nodes){
//   console.log(Object.keys(pattern).length)
//   for(var key in nodes){
//     if (matchNode(pattern["1"],nodes[key]))
//       if (followPattern(pattern,nodes,key))
//         return true; //find first occurence
//
//     var k = key.split('/'); // GET/post -> {200, 201}
//     var node_method = k[0];
//     if (node_method = pattern["1"].method) {
//       //for each status in nodes[key]
//       //follow graph and match the rest of the pattern
//     }
//   }
// }
//
// //return true if the pattern is contained into nodes starting from key
// var matchNode(pattern_node, haystack_node) {
//   //METHOD + status
//   //METHOD + URL + status
//   //METHOD + URL/$ + status
// }
//
// //return true if the pattern is contained into nodes starting from key
// var followPattern(pattern,nodes,key) {
//   //pattern is a sequence
//   //variants find immediate
//   //find transitive
//
//   var position //pattern["1"],nodes[key]
//
//   while (?) {
//     var next = { pattern: pattern(position).next() , haystack: nodes[key].next() };
//     if (!matchNode(next.pattern, next.haystack_))
//       return false;
//   }
//
// }
//
// var pattern_exact_URL = {
//   "1" : {
//     ip : "C1", //exact IP match (some *wildcard*)
//     method : "GET",
//     status : "200",
//     url : "/" //exact string matching
//   },
//   "2" : {
//     method : "GET",
//     status : "200",
//     url : "/edit"
//   },
//   "3" : {
//     method : "PUT",
//     status : "200",
//     url : "/"
//   }
// }
//
// var pattern_variableURL = {
//   "1" : {
//     xip : "C1",
//     method : "GET",
//     status : "200",
//     xurl : "/"
//   },
//   "2" : {
//     xip : "C2",
//     method : "GET",
//     status : "200",
//     xurl : "/edit"
//   },
//   "3" : {
//     xip : "C1",
//     method : "PUT",
//     status : "200",
//     xurl : "/"
//   }
// }
//
//
// var pattern_variableURL = {
//   "1" : {
//
//     method : "GET",
//     status : "200",
//     xurl : "/"
//   },
//   "2" : {
//     method : "GET",
//     status : "200",
//     xurl : "/edit"
//   },
//   "3" : {
//     method : "PUT",
//     status : "200",
//     xurl : "/"
//   }
// }
//
//
// GET 200 /
// GET 200 /edit
// PUT 200 /
//
// GET 200 /blog/
// GET 200 /blog/edit
// PUT 200 /
//
// GET 200 /blog/
// GET 200 /blog/edit
// PUT 200 /blog/
//
// //remember actual placeholder value
// URL["/"] not defined
// URL["/"] = "/blog/" //store
// URL["/edit"] = "/blog/edit"
// URL["/"] is defined
// URL["/"] =?= "/blog/" //compare
//
// GET 200 /blog/post/
// GET 200 /blog/edit
// PUT 200 /blog/post/
//
// //remember actual placeholder value
// URL["/"] = "/blog/post"
