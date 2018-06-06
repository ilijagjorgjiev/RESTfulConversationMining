var hasPatternWholeGraph = function(g, nodes, pattern, candidateP, shareNum){
  var ret = false;
  var placeholder = {};
  var oldpl;
  var nodesVisualization = [];
  var matrixNodesVisualization = {
    n : [],
    w : [],
  };
  var wholeNodesVisualization = [];
  setVisitedArray(nodes);
  for(var key in nodes){
    let space = key.split("/");
    let mt = space[0];
    let url = "/" + space.slice(1).join("/");
    if(identifyMethod(pattern[0], mt) && identifyURL(pattern[0], url, placeholder)){
      oldpl = placeholder;
      for(var status in nodes[key]){
        if(identifyStatus(pattern[0], status)){
          var fx = function(){
            nodesVisualization.push(setUpNode(mt, status, url));
            console.log("start="+space + status,  nodes[key][status].tpIpArray);
            wholefollowUp(nodes, key, status, pattern, placeholder, 1, nodesVisualization, matrixNodesVisualization, candidateP, shareNum, nodes[key][status].tpIpArray, wholeNodesVisualization);
            placeholder = oldpl;
            nodesVisualization.splice(-1,1);
          }
          if(candidateP){
            if(nodes[key][status].tpIpArray.length > 1){
              fx();
            }
          }
          else{
            if(pattern[0].ips != undefined && pattern[0].ips > 1){
              shareNum = pattern[0].ips;
              if(nodes[key][status].tpIpArray.length > 1) fx();
            }
            else{
              fx();
            }
          }
        }
      }
    }
    placeholder = {};
    setVisitedArray(nodes);

  }
  if(matrixNodesVisualization.n.length > 0){
    console.log(matrixNodesVisualization);
    return{
      bool : true,
      matrixNodesVisualization : matrixNodesVisualization
    }
  }
  return false;
}

var wholefollowUp = function(nodes, key, status, pattern, placeholder, j, nodesVisualization, matrixNodesVisualization, candidateP, shareNum, followUpArr, wholeNodesVisualization){
  var patternSize = Object.keys(pattern).length;
  let oldPl = Object.assign({}, placeholder);
  if(j >= patternSize) return;
  if((pattern[j-1].status == "*" || pattern[j-1].status == "any") && j != 1){
    if(pattern[j].type == "whole"){
      wholeNodesVisualization.splice(-1,1);
      let slash = key.split('/');
      let method = slash[0];
      let newUrl = "/" + slash.slice(1).join("/");
      for(var st in nodes[key]){
        var node = setUpNode(method, st, newUrl)
        wholeNodesVisualization.push(node);
        wholeFx(nodes, key, st, pattern, placeholder, j, nodesVisualization, patternSize, matrixNodesVisualization, candidateP, shareNum, followUpArr, wholeNodesVisualization);
        wholeNodesVisualization.splice(-1,1);
      }
    }
    else{
      nodesVisualization.splice(-1,1);
      let slash = key.split('/');
      let method = slash[0];
      let newUrl = "/" + slash.slice(1).join("/");
      for(var st in nodes[key]){
        var node = setUpNode(method, st, newUrl)
        nodesVisualization.push(node);
        // nodes[key][st].visitedArray[]
        // for(let i = 0; i < nodes[key][st])
        wholeFx(nodes, key, st, pattern, placeholder, j, nodesVisualization, patternSize, matrixNodesVisualization, candidateP, shareNum, followUpArr, wholeNodesVisualization);
        nodesVisualization.splice(-1,1);
      }
    }
  }
  else{
    wholeFx(nodes, key, status, pattern, placeholder, j, nodesVisualization, patternSize, matrixNodesVisualization, candidateP, shareNum, followUpArr, wholeNodesVisualization);
  }
  return;
}

var wholeFx = function(nodes, key, status, pattern, placeholder, j, nodesVisualization, patternSize, matrixNodesVisualization, candidateP, shareNum, followUpArr, wholeNodesVisualization){
  let oldPlaceholder = Object.assign({}, placeholder);
  for(let i = 0; i < nodes[key][status].statusArray.length; i++){
    let finalEnd = nodes[key][status].statusArray[i].finalEnd.split(' ');
    if(finalEnd.length > 1){
      let slash = finalEnd[0].split('/');
      let method = slash[0];
      let newUrl = "/" + slash.slice(1).join("/");
      let st = finalEnd[1];
      if(!nodes[key][status].visitedArray[i]){
        console.log(finalEnd[0], finalEnd[1], j);
        if(identifyMethod(pattern[j], method) && identifyStatus(pattern[j], st) && identifyURL(pattern[j], newUrl, placeholder)){
          console.log(finalEnd[0], finalEnd[1], j);
          var node = setUpNode(method, st, newUrl);
          var fx = function(){
            nodesVisualization.push(node);
            if(j+1 == patternSize){
              // console.log(key, status, nodes[key][status].tpIpArray);
              if(pattern[j].ips != undefined && pattern[j].ips > 1){
                if(nodes[finalEnd[0]][finalEnd[1]].tpIpArray.length >= pattern[j].ips){
                  var newArray = nodesVisualization.slice();
                  var newArr = wholeNodesVisualization.slice();
                  matrixNodesVisualization.n.push(newArray);
                  matrixNodesVisualization.w.push(newArr);
                }
              }
              else{
                console.log(finalEnd[0], finalEnd[1])
                var newArray = nodesVisualization.slice();
                var newArr = wholeNodesVisualization.slice();
                matrixNodesVisualization.n.push(newArray);
                matrixNodesVisualization.w.push(newArr);
              }
            }
            var val = wholefollowUp(nodes, finalEnd[0], finalEnd[1], pattern, placeholder, j+1, nodesVisualization, matrixNodesVisualization, candidateP, shareNum, followUpArr, wholeNodesVisualization)
            nodesVisualization.splice(-1,1);
            placeholder = oldPlaceholder;
          }
          var fx1 = function(){
            // console.log(key, status, nodes[key][status].visitedArray);
            let obj = identifyCandidate(candidateP,  nodes[key][status].tpIpArray, shareNum, followUpArr, nodes[key][status].statusArray, nodes[key][status].visitedArray)
            // console.log(obj);
            if(obj.bool){
              if(obj.bool) followUpArr = obj.followUpArr;
              fx();
            }
          }
          if(candidateP){
            fx1();
          }
          else{
            shareNum = pattern[j-1].ips;
            followUpArr = nodes[key][status].tpIpArray;
            if(pattern[j-1].ips != undefined && pattern[j-1].ips > 1){
              fx1();
            }
            else{
              nodes[key][status].visitedArray[i] = true;
              fx();
            }

          }
        }
        else if(pattern[j].type == "whole"){
          console.log(j, key, status, nodesVisualization.slice(), finalEnd[0], finalEnd[1]);
          nodes[key][status].visitedArray[i] = true;
          let node = setUpNode(method, st, newUrl);
          wholeNodesVisualization.push(node);
          var val = wholefollowUp(nodes, finalEnd[0], finalEnd[1], pattern, placeholder, j, nodesVisualization, matrixNodesVisualization, candidateP, shareNum, followUpArr, wholeNodesVisualization);
          wholeNodesVisualization.splice(-1,1);
        }
      }
    }
    else{
      nodes[key][status].visitedArray[i] = true;
    }
  }
  return;
}


var identifyMethod = function(m1, m2){
  if(m1.method == "*" || m1.method == "any") return true;
  else return (m1.method == m2);
}
var identifyStatus = function(s1, s2){
  if(s1.status == "*" || s1.status == "any") return true;
  else return (s1.status == s2);
}
var identifyURL = function(u1, u2, placeholder){
  if(u1.url[0] == "$"){
    if(placeholder[u1.url] === undefined){
      placeholder[u1.url] = u2;
      return true;
    }
    else{
      return placeholder[u1.url] == u2;
    }
  }
  else if(u1.url[0] == "/"){
    return (u1.url == u2);
  }
  else{
    return true;
  }
}
var identifyCandidate = function(candidateP, arr, shareNum, followUpArr, statusArray, visitedArray){
  // console.log(arr, followUpArr, shareNum);
  if(candidateP || shareNum > 1){
    if(shareNum > arr.length) return false;
    else{
      let counter = 0;
      for(let i = 0; i < followUpArr.length; i++){
        if(arr.includes(followUpArr[i])){
          counter++;
        }
      }
      var fx = function(followUpArr){
        let newCounter = 0;
        let newArr = []
        let combs = k_combinations(statusArray, shareNum)
        let val = counter;
        let finalEnd;
        while(val >= shareNum){
          let combs = k_combinations(statusArray, val)
          for(let i = 0; i < combs.length; i++){
            finalEnd = combs[i][0].finalEnd;
            // console.log(finalEnd, combs[i])
            if(!visitedArray[combs[i][0].arrIndex]){
              newArr.push(combs[i][0].conv);
              for(let j = 1; j < combs[i].length; j++){
                // console.log(combs[i][j].finalEnd);
                if(combs[i][j].finalEnd == finalEnd && !visitedArray[combs[i][j].arrIndex]){
                  newArr.push(combs[i][j].conv);
                }
              }
              for(let k = 0; k < followUpArr.length; k++){
                if(newArr.includes(followUpArr[k])){
                  newCounter++;
                }
              }
              // console.log(newArr, arr, newCounter, visitedArray);
              if(newCounter == counter || (newCounter >= shareNum && newCounter < followUpArr.length)){
                var revertVisited = [];
                for(let j = 0; j < combs[i].length; j++){
                  visitedArray[combs[i][j].arrIndex] = true;
                  revertVisited.push(combs[i][j].arrIndex);
                }
                if(counter < followUpArr.length) console.log("PASS")
                return{
                  revertVisited : revertVisited,
                  bool : true,
                  followUpArr : newArr
                }
              }
              newArr = []
              newCounter = 0;
            }
          }
          val--;
        }
        return {
          revertVisited : [],
          bool : false
        }
        // val--;
      }
      if(counter == followUpArr.length){
        let obj = fx(followUpArr);
        if(obj.bool) return obj;
        else return false;
      }
      else if(counter >= shareNum && counter < followUpArr.length){
        followUpArr = arr;
        console.log(followUpArr);
        fx(followUpArr);
      }
      // return counter == followUpArr.length;
    }
  }
  return true;
}

var setUpNode = function(method, status, url){
  var node = {}
  node.method = method;
  node.url = url;
  node.status = status;
  return node;
}
var setVisitedArray = function(nodes){
  for(var key in nodes){
    for(var status in nodes[key]){
      nodes[key][status].visitedArray = [];
      for(let i = 0; i < nodes[key][status].statusArray.length; i++){
        nodes[key][status].visitedArray[i] = false;
      }
    }
  }
}
var revertVisitedArray = function(visitedArray, revertVisited){
  for(let i = 0; i < revertVisited.length; i++){
    visitedArray[revertVisitedArray[i]] = false;
  }
}
var hasPattern = function(g, nodes, pattern, candidateP, shareNum){
  var ret = false;
  var placeholder = {};
  var oldpl;
  var nodesVisualization = [];
  var matrixNodesVisualization = [];
  setVisitedArray(nodes);
  for(var key in nodes){
    let space = key.split("/");
    let mt = space[0];
    let url = "/" + space.slice(1).join("/");
    if(identifyMethod(pattern[0], mt) && identifyURL(pattern[0], url, placeholder)){
      oldpl = placeholder;
      for(var status in nodes[key]){
        if(identifyStatus(pattern[0], status)){
          var fx = function(){
            nodesVisualization.push(setUpNode(mt, status, url));
            console.log("start="+space + status,  nodes[key][status].tpIpArray);
            followUpPattern(nodes, key, status, pattern, placeholder, 1, nodesVisualization, matrixNodesVisualization, candidateP, shareNum, nodes[key][status].tpIpArray);
            placeholder = oldpl;
            nodesVisualization.splice(-1,1);
          }
          if(candidateP){
            if(nodes[key][status].tpIpArray.length > 1){
              fx();
            }
          }
          else{
            if(pattern[0].ips != undefined && pattern[0].ips > 1){
              shareNum = pattern[0].ips;
              if(nodes[key][status].tpIpArray.length > 1) fx();
            }
            else{
              fx();
            }
          }
        }
      }
    }
    placeholder = {};
    setVisitedArray(nodes);
  }
  if(matrixNodesVisualization.length > 0){
    console.log(matrixNodesVisualization);
    return{
      bool : true,
      matrixNodesVisualization : matrixNodesVisualization
    }
  }
  return false;
}

var followUpPattern = function(nodes, key, status, pattern, placeholder, j, nodesVisualization, matrixNodesVisualization, candidateP, shareNum, followUpArr){
  var patternSize = Object.keys(pattern).length;
  let oldPl = Object.assign({}, placeholder);
  if(j >= patternSize) return;
  if((pattern[j-1].status == "*" || pattern[j-1].status == "any") && j != 1){
    nodesVisualization.splice(-1,1);
    let slash = key.split('/');
    let method = slash[0];
    let newUrl = "/" + slash.slice(1).join("/");
    for(var st in nodes[key]){
      var node = setUpNode(method, st, newUrl)
      nodesVisualization.push(node);
      fx(nodes, key, st, pattern, placeholder, j, nodesVisualization, patternSize, matrixNodesVisualization, candidateP, shareNum, followUpArr);
      nodesVisualization.splice(-1,1);
    }
  }
  else{
    fx(nodes, key, status, pattern, placeholder, j, nodesVisualization, patternSize, matrixNodesVisualization, candidateP, shareNum, followUpArr);
  }
  return;
}
var fx = function(nodes, key, status, pattern, placeholder, j, nodesVisualization, patternSize, matrixNodesVisualization, candidateP, shareNum, followUpArr){
  let finalEnds = []
  let oldPlaceholder = Object.assign({}, placeholder);
  for(let i = 0; i < nodes[key][status].statusArray.length; i++){
    let finalEnd = nodes[key][status].statusArray[i].finalEnd.split(' ');
    if(finalEnd.length > 1){
      let slash = finalEnd[0].split('/');
      let method = slash[0];
      let newUrl = "/" + slash.slice(1).join("/");
      let st = finalEnd[1];
      // console.log(finalEnd, candidateP, j);
      if(identifyMethod(pattern[j], method) && identifyStatus(pattern[j], st) && identifyURL(pattern[j], newUrl, placeholder)){
        var node = setUpNode(method, st, newUrl)
        var fx = function(){
          nodesVisualization.push(node);
          if(j+1 == patternSize){
            // console.log(j, jSizeBool, obj.bool);
            var newArray = nodesVisualization.slice();
            // setUpPatternVisualization(nodes);
            matrixNodesVisualization.push(newArray);
          }
          var val = followUpPattern(nodes, finalEnd[0], finalEnd[1], pattern, placeholder, j+1, nodesVisualization, matrixNodesVisualization, candidateP, shareNum, followUpArr)
          nodesVisualization.splice(-1,1);
          placeholder = oldPlaceholder;
        }
        var fx1 = function(){
          let obj = identifyCandidate(candidateP,  nodes[key][status].tpIpArray, shareNum, followUpArr, nodes[key][status].statusArray, nodes[key][status].visitedArray)
          if(obj.bool){
            if(obj.bool) followUpArr = obj.followUpArr;
            fx();
          }
        }
        if(candidateP){
          fx1();
        }
        else{
          shareNum = pattern[j-1].ips;
          console.log(shareNum);
          followUpArr = nodes[key][status].tpIpArray;
          if(pattern[j-1].ips != undefined && pattern[j-1].ips > 1){
            fx1();
          }
          else fx();
        }
      }
    }
  }
  return;
}
var setUpPatternVisualization = function(g, matrixNodesVisualization){
  let style = document.createElement('style')

  style.disabled = true;
  // WebKit hack :(
  style.appendChild(document.createTextNode(""));

  // Add the <style> element to the page
  document.head.appendChild(style);

  var rainbow = createRainbow(matrixNodesVisualization.n.length);
  var st = document.getElementsByTagName("STYLE")[6];
  var sheet = document.getElementsByTagName("STYLE")[6].sheet;
  var clazz;
  var fx = function(rainbow, nodesVisualization, j){
    console.log(rainbow, j);
    for(let i = 0; i < nodesVisualization.length; i++){
      let full = nodesVisualization[i].method + nodesVisualization[i].url + ' ' + nodesVisualization[i].status;
      let key = nodesVisualization[i].method + nodesVisualization[i].url
      // console.log(key, full, i, nodesVisualization);
      let st = "fill: "+rainbow[j];
      if(g._nodes[key] !== undefined){
        clazz = getPatternClassName(key, undefined);
        // console.log(clazz);
        sheet.insertRule("."+clazz+"{ "+st+" }");
      }
      clazz = getPatternClassName(key, nodesVisualization[i].status);
      // console.log(clazz);
      sheet.insertRule("."+clazz+"{ "+st+" }");
    }
  }
  for(let j = 0; j < matrixNodesVisualization.n.length; j++){
    var nodesVisualization = matrixNodesVisualization.n[j];
    fx(rainbow, nodesVisualization, j)
  }
  for(let i = 0; i < rainbow.length; i++){
    rainbow[i] = rgbToHex(getGradientColor([0, 0, 0], hexToRgb(rainbow[i]), 0.5));
    console.log(rainbow[i]);
  }
  for(let i = 0; i < matrixNodesVisualization.w.length; i++){
    var wholeNodesVisualization = matrixNodesVisualization.w[i];
    fx(rainbow, wholeNodesVisualization, i);
  }
  st.disabled = false;
}
var createRainbow = function(size){
  var rainbow = new Array(size);
  for (var i=0; i<size; i++) {
    var red   = sin_to_hex(i, 0 * Math.PI * 2/3, size); // 0   deg
    var blue  = sin_to_hex(i, 1 * Math.PI * 2/3, size); // 120 deg
    var green = sin_to_hex(i, 2 * Math.PI * 2/3, size); // 240 deg

    rainbow[i] = "#"+ red + green + blue;
  }
  return rainbow;
}
var getPatternClassName = function(key, status){
  // console.log(key);
  let _key = key.split('/');
  let clazz = '';
  for(let i = 0; i < _key.length; i++){
    if(i == 0) clazz += _key[i]
    else clazz += ("-"+_key[i])
  }
  if(status !== undefined) clazz += "-"+status;
  return clazz;
}
//Link: https://gist.github.com/axelpale/3118596
function k_combinations(set, k) {
  var i, j, combs, head, tailcombs;

  // There is no way to take e.g. sets of 5 elements from
  // a set of 4.
  if (k > set.length || k <= 0) {
    return [];
  }

  // K-sized set has only one K-sized subset.
  if (k == set.length) {
    return [set];
  }

  // There is N 1-sized subsets in a N-sized set.
  if (k == 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }

  // Assert {1 < k < set.length}

  // Algorithm description:
  // To get k-combinations of a set, we want to join each element
  // with all (k-1)-combinations of the other elements. The set of
  // these k-sized sets would be the desired result. However, as we
  // represent sets with lists, we need to take duplicates into
  // account. To avoid producing duplicates and also unnecessary
  // computing, we use the following approach: each element i
  // divides the list into three: the preceding elements, the
  // current element i, and the subsequent elements. For the first
  // element, the list of preceding elements is empty. For element i,
  // we compute the (k-1)-computations of the subsequent elements,
  // join each with the element i, and store the joined to the set of
  // computed k-combinations. We do not need to take the preceding
  // elements into account, because they have already been the i:th
  // element so they are already computed and stored. When the length
  // of the subsequent list drops below (k-1), we cannot find any
  // (k-1)-combs, hence the upper limit for the iteration:
  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    // head is a list that includes only our current element.
    head = set.slice(i, i + 1);
    // We take smaller combinations from the subsequent elements
    tailcombs = k_combinations(set.slice(i + 1), k - 1);
    // For each (k-1)-combination we join it with the current
    // and store it to the set of k-combinations.
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}

// var hasPatternWholeGraph = function(g, nodes, pattern, startKey, startStatus){
//   var ret = false;
//   var nodesVisualization = []
//   ret = followUpPatternWholeGraph(nodes, startKey, startStatus, pattern, 0, nodesVisualization)
//   if(ret) setUpPatternVisualization(g, nodesVisualization);
//   return ret;
// }
// var followUpPatternWholeGraph = function(nodes, key, status, pattern, j, nodesVisualization){
//   console.log(nodes);
// }
// var getStartStatus = function(nodes, key){
//   var min = Number.MAX_VALUE;
//   for(var stat1 in nodes[key]){
//     var st1 = nodes[startNode][stat1].statusArray[0]
//     for(var stat2 in nodes[key]){
//       var st2 = nodes[startNode][stat2].statusArray[0]
//       if()
//     }
//   }
// }
// var followUpPatternMSUW = function(nodes, key, status, pattern, placeholder){
//   var patternSize = Object.keys(pattern).length;
//   var  j = 1;
//   if(j == patternSize) return true;
//   for(let i = 0; i < nodes[key][status].statusArray.length; i++){
//     let finalEnd = nodes[key][status].statusArray[i].finalEnd.split(' ');
//     if(finalEnd.length > 1){
//       let slash = finalEnd[0].split('/');
//       let method = slash[0];
//       let newUrl = "/";
//       newUrl+= slash.slice(1).join("/");
//       let st = finalEnd[1];
//       if(matchMethod(pattern[j], method) && matchStatus(pattern[j], st)){
//         if(placeholder[pattern[j].url] === undefined){
//           placeholder[pattern[j].url] = newUrl;
//           key = finalEnd[0];
//           status = finalEnd[1];
//           j++;
//           i = -1;
//         }
//         else{
//           if(newMatchURL(newUrl, placeholder[pattern[j].url])){
//             key = finalEnd[0];
//             status = finalEnd[1];
//             j++;
//             i = -1;
//           }
//         }
//       }
//     }
//     if(j == patternSize) return true;
//   }
//   return (j==patternSize);
// }
//
// var patternMSUW = function(nodes, pattern){
//   var ret = false;
//   var placeholder = {};
//   for(var key in nodes){
//     let space = key.split('/');
//     let mt = space[0];
//     let url = "/";
//     url+= space.slice(1).join("/");
//     if(placeholder[pattern[0].url] === undefined && matchMethod(pattern["0"], mt)){
//       for(var status in nodes[key]){
//         if(matchStatus(pattern["0"], status)){
//           placeholder[pattern[0].url] = url;
//           ret = followUpPatternMSUW(nodes, key, status, pattern, placeholder)
//         }
//         if(ret){return ret};
//         placeholder = {};
//       }
//     }
//   }
//   return ret;
// }
// var followUpPatternMSUW = function(nodes, key, status, pattern, placeholder){
//   var patternSize = Object.keys(pattern).length;
//   var  j = 1;
//   if(j == patternSize) return true;
//   for(let i = 0; i < nodes[key][status].statusArray.length; i++){
//     let finalEnd = nodes[key][status].statusArray[i].finalEnd.split(' ');
//     if(finalEnd.length > 1){
//       let slash = finalEnd[0].split('/');
//       let method = slash[0];
//       let newUrl = "/";
//       newUrl+= slash.slice(1).join("/");
//       let st = finalEnd[1];
//       if(matchMethod(pattern[j], method) && matchStatus(pattern[j], st)){
//         if(placeholder[pattern[j].url] === undefined){
//           placeholder[pattern[j].url] = newUrl;
//           key = finalEnd[0];
//           status = finalEnd[1];
//           j++;
//           i = -1;
//         }
//         else{
//           if(newMatchURL(newUrl, placeholder[pattern[j].url])){
//             key = finalEnd[0];
//             status = finalEnd[1];
//             j++;
//             i = -1;
//           }
//         }
//       }
//     }
//     if(j == patternSize) return true;
//   }
//   return (j==patternSize);
// }
// var newMatchURL = function(u1, u2){
//   return u1 == u2;
// }
// // var pattern_variableURL = {
// //   "1" : {
// //
// //     method : "GET",
// //     status : "200",
// //     xurl : "/"
// //   },
// //   "2" : {
// //     method : "GET",
// //     status : "200",
// //     xurl : "/edit"
// //   },
// //   "3" : {
// //     method : "PUT",
// //     status : "200",
// //     xurl : "/"
// //   }
// // }
// //
// //
// // GET 200 /
// // GET 200 /edit
// // PUT 200 /
// //
// // GET 200 /blog/
// // GET 200 /blog/edit
// // PUT 200 /
// //
// // GET 200 /blog/
// // GET 200 /blog/edit
// // PUT 200 /blog/
// //
// // //remember actual placeholder value
// // URL["/"] not defined
// // URL["/"] = "/blog/" //store
// // URL["/edit"] = "/blog/edit"
// // URL["/"] is defined
// // URL["/"] =?= "/blog/" //compare
// //
// // GET 200 /blog/post/
// // GET 200 /blog/edit
// // PUT 200 /blog/post/
// //
// // //remember actual placeholder value
// // URL["/"] = "/blog/post"
// var matchMethod = function(m1, m2){
//   return (m1.method == m2);
// }
// var matchStatus = function(s1, s2){
//   return (s1.status == s2);
// }
// var matchURL = function(u1, u2){
//   return u1.url == u2;
// }
//
// var patternMethondStatusURL = function(nodes, pattern){
//   var ret = false;
//   for(var key in nodes){
//     let space = key.split('/');
//     let mt = space[0];
//     let url = "/";
//     url+= space.slice(1).join("/");
//     if(matchMethod(pattern["0"], mt) && matchURL(pattern["0"], url)){
//       for(var status in nodes[key]){
//         if(matchStatus(pattern["0"], status)){
//           ret = followUpPatternMethodStatusURL(nodes, key, status, pattern)
//         }
//         if(ret) return ret;
//       }
//     }
//   }
//   return ret;
// }
// var followUpPatternMethodStatusURL = function(nodes, key, status, pattern){
//   var patternSize = Object.keys(pattern).length;
//   var  j = 1;
//   if(j == patternSize) return true;
//   for(let i = 0; i < nodes[key][status].statusArray.length; i++){
//     let finalEnd = nodes[key][status].statusArray[i].finalEnd.split(' ');
//     if(finalEnd.length > 1){
//       let slash = finalEnd[0].split('/');
//       let method = slash[0];
//       let newUrl = "/";
//       newUrl+= slash.slice(1).join("/");
//       let st = finalEnd[1];
//       if(matchMethod(pattern[j], method) && matchStatus(pattern[j], st) && matchURL(pattern[j], newUrl)){
//         key = finalEnd[0];
//         status = finalEnd[1];
//         j++;
//         i = -1;
//       }
//     }
//     if(j == patternSize) return true;
//   }
//   return (j==patternSize);
// }
// var patternMethondStatus = function(nodes, pattern){
//   var ret = false;
//   for(var key in nodes){
//     if(matchMethod(pattern["0"], key.split('/')[0])){
//       for(var status in nodes[key]){
//         if(matchStatus(pattern["0"], status)){
//           ret = followUpPatternMethodStatus(nodes, key, status, pattern)
//         }
//         if(ret) return ret;
//       }
//     }
//   }
//   return ret;
// }
// var followUpPatternMethodStatus = function(nodes, key, status, pattern){
//   var patternSize = Object.keys(pattern).length;
//   var  j = 1;
//   if(j == patternSize) return true;
//   for(let i = 0; i < nodes[key][status].statusArray.length; i++){
//     //get the next conversation node
//     let finalEnd = nodes[key][status].statusArray[i].finalEnd.split(' ');
//     if(finalEnd.length > 1){
//       let method = finalEnd[0].split('/')[0];
//       let st = finalEnd[1];
//       if(matchMethod(pattern[j], method) && matchStatus(pattern[j], st)){
//         key = finalEnd[0];
//         status = finalEnd[1];
//         j++;
//         i = -1;
//       }
//     }
//     if(j == patternSize) return true;
//   }
//   return (j==patternSize);
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
