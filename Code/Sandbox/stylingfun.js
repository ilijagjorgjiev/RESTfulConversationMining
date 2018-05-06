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
  // console.log("dsasda",node);
  let checker = 0;
  for(var s in nodes[k]){
    for(let i = 0; i < nodes[k][s].statusArray.length; i++){
      // if(node == 'XOR-'+nodes[k][s].statusArray[i].finalStart) console.log(nodes[k][s]);
      if(nodes[k][s].statusArray[i].finalStart.split(' ')[0] == node.split(' ')[0] || 'XOR-'+nodes[k][s].statusArray[i].finalStart == node){
        // console.log(node);
        avg+=nodes[k][s].delayArray[i];
        checker++;
      }
    }
  }
  if(checker == counter) return (avg/counter);
  else {
    // console.log(nodes[k][s].statusArray);
    // console.log(node, checker, counter, k);
    console.log(counter);
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
  var bin = Math.round((val - min)/particle);
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
