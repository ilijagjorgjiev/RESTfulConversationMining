
var disableConversionPaths = function(){
  var obj = document.body.classList;
  var length = obj.length
  for(let i = 0; i < length; i++){
    obj.toggle(obj[0]);
  }
}
var conversionPath = function(class_prefix, size, data, totalTpIpArray){
  let style = document.createElement('style')

  // style.disabled = true;
  // WebKit hack :(
  style.appendChild(document.createTextNode(""));

  // Add the <style> element to the page
  document.head.appendChild(style);
  var rainbow = createRainbow(size, totalTpIpArray);
  console.log(rainbow);
  var sheet = style.sheet;
  for(let i in totalTpIpArray){
    let st = "fill: "+rainbow[i];
    let clazz = "."+class_prefix+"-"+i;
    sheet.insertRule(".enable-path-" + i + " " +clazz+" { "+st+" }");
  }
  for(var rules in data){
    var line = rules.split('-');
    console.log(line[0]);
    var color =  hexToRgb(rainbow[line[0]]);
    for(let i = 1; i < line.length; i++){
      color = getGradientColor(color, hexToRgb(rainbow[line[i]]), 0.5);
    }
    if(line.length > 1){
      let st = "fill: rgb("+color[0]+","+color[1]+","+color[2]+")";
      var str1 = "";
      var str = "";
      st = " { "+st+" }";
      for(let i = 0; i < line.length; i++){
        str += (".enable-path-"+line[i])
        str1 += "."+class_prefix+"-"+line[i]
      }
      var final = str + " " + str1 + st;
      sheet.insertRule(final);
      // sheet.insertRule(".enable-path-"+i+".enable-path-"+j+" " +"."+class_prefix+"-"+i+"."+class_prefix+"-"+j+" { "+st+" }");
    }
  }
  // for(let i = 0; i < size; i++){
  //   for(let j = i + 1; j < size; j++){
  //     let color = getGradientColor(hexToRgb(rainbow[i]), hexToRgb(rainbow[j]), 0.5);
  //     let st = "fill: rgb("+color[0]+","+color[1]+","+color[2]+")";
  //     console.log(".enable-path-"+i+".enable-path-"+j+" " +"."+class_prefix+"-"+i+"."+class_prefix+"-"+j+" { "+st+" }");
  //     sheet.insertRule(".enable-path-"+i+".enable-path-"+j+" " +"."+class_prefix+"-"+i+"."+class_prefix+"-"+j+" { "+st+" }");
  //   }
  // }
  //Issue: Generalize for n, optimization.
}
var hexToRgb = function(hex){
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var createRainbow = function(size, totalTpIpArray){
  var rainbow = {};
  for (let i in totalTpIpArray) {
    var red   = sin_to_hex(i, 0 * Math.PI * 2/3, size); // 0   deg
    var blue  = sin_to_hex(i, 1 * Math.PI * 2/3, size); // 120 deg
    var green = sin_to_hex(i, 2 * Math.PI * 2/3, size); // 240 deg

    rainbow[totalTpIpArray[i]] = "#"+ red + green + blue;
  }
  return rainbow;
}
function sin_to_hex(i, phase, size) {
  var sin = Math.sin(Math.PI / size * 2 * i + phase);
  var int = Math.floor(sin * 127) + 128;
  var hex = int.toString(16);

  return hex.length === 1 ? "0"+hex : hex;
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
    console.log("ERROR IN getIncomingEdgeIndexDelay")
  };
}
// var triggerEdgeProbability = function(elem){
//   elem.onclick = function(){
//       if(elem.checked != true) disableEdgeProbability()
//       else enableEdgeProbability()
//   }
// }
// var enableEdgeProbability = function(){
//   $(document).ready(function(){
//     var list = document.getElementsByClassName("edgeLabel");
//     for(let i = 0; i < list.length; i++){
//       list[i].style.cssText = "opacity: 1;";
//     }
//   })
// }
// var disableEdgeProbability = function(){
//   $(document).ready(function(){
//     var list = document.getElementsByClassName("edgeLabel");
//     for(let i = 0; i < list.length; i++){
//       list[i].style.cssText = "opacity: 0;";
//     }
//   })
// }
var hasStatus = function(statusObj, status){
  if(statusObj[status] === undefined) statusObj[status] = true;
}
var setStatusColoring = function(statusObj, class_prefix, sheet){
  var size = Object.keys(statusObj).length;
  var rainbow = createRainbow(size);
  var i = 0;
  for(var status in statusObj){
    var st = "fill: "+rainbow[i];
    var clazz = "."+class_prefix+"-"+status;
    sheet.insertRule(clazz+" { "+st+" }");
    i++;
  }
}
var setStyles = function(){
  for(let i = 0; i < 5; i++){
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
var setEdgeProbabilityStyle = function(elem, class_prefix, sheet){
  var st = "opacity: 0;"
  var clazz = "."+class_prefix;
  sheet.insertRule(clazz+" { "+st+" }");
  var x = document.getElementsByTagName("STYLE")[3]
  x.disabled = false;
  elem.onclick = function(){
    if(elem.checked == true){
      x.disabled = true;
    }
    else{
      x.disabled = false;;
    }
  };
}
var setVisualizationConfig = function(nfc, eft, edc, sep, statusColoring, maxRequests, statusObj){
  var VisualizationConfig = document.getElementById("VisualizationConfig");
  var red = [255,0,0];
  var yellow = [255,255,0];
  setStyles();
  setNodeFrequencyColoring(red, yellow, "totalRequest", 1, maxRequests, document.getElementsByTagName("STYLE")[0].sheet);
  setEdgeFrequencyThickness("edge-thickness", 1, maxRequests, document.getElementsByTagName("STYLE")[1].sheet);
  setDelayFrequencyColoring(red, yellow, "delay-coloring", 0, 128, document.getElementsByTagName("STYLE")[2].sheet)
  setStatusColoring(statusObj, "status", document.getElementsByTagName("STYLE")[4].sheet);
  setEdgeProbabilityStyle(sep, "edgeLabel tspan", document.getElementsByTagName("STYLE")[3].sheet);
  setElementOnClick(nfc, 0);
  setElementOnClick(eft, 1);
  setElementOnClick(edc, 2);
  setElementOnClick(statusColoring, 4);
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
