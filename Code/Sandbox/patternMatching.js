var identifyMethod = function(m1, m2){
  if(m1.method == "*") return true;
  else return (m1.method == m2);
}
var identifyStatus = function(s1, s2){
  if(s1.status == "*") return true;
  else return (s1.status == s2);
}
var identifyURL = function(u1, u2, placeholder){
  if(u1.url[0] == "$"){
    console.log(placeholder, u1.url);
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
var setUpNode = function(method, status, url){
  var node = {}
  node.method = method;
  node.url = url;
  node.status = status;
  return node;
}

var hasPattern = function(g, nodes, pattern){
  var ret = false;
  var placeholder = {};
  var oldpl;
  var nodesVisualization = [];
  for(var key in nodes){
    let space = key.split("/");
    let mt = space[0];
    let url = "/" + space.slice(1).join("/");
    if(identifyMethod(pattern[0], mt) && identifyURL(pattern[0], url, placeholder)){
      oldpl = placeholder;
      for(var status in nodes[key]){
        if(identifyStatus(pattern[0], status)){
          nodesVisualization.push(setUpNode(mt, status, url));
          ret = followUpPattern(nodes, key, status, pattern, placeholder, 1, nodesVisualization)
        }
        if(ret){
          setUpPatternVisualization(g, nodesVisualization);
          return ret;
        }
        placeholder = oldpl;
        nodesVisualization.splice(-1,1);
      }
    }
    placeholder = {};
  }
  return ret;
}

var followUpPattern = function(nodes, key, status, pattern, placeholder, j, nodesVisualization){
 var patternSize = Object.keys(pattern).length;
 // if(key == "GET/job/2" && status == "200")
 var oldPlaceholder = placeholder;
 if(j == patternSize) return true;

 for(let i = 0; i < nodes[key][status].statusArray.length; i++){
   let finalEnd = nodes[key][status].statusArray[i].finalEnd.split(' ');
   if(finalEnd.length > 1){
     let slash = finalEnd[0].split('/');
     let method = slash[0];
     let newUrl = "/" + slash.slice(1).join("/");
     let st = finalEnd[1];
     if(identifyMethod(pattern[j], method) && identifyStatus(pattern[j], st) && identifyURL(pattern[j], newUrl, placeholder)){
       var node = setUpNode(method, st, newUrl)
       nodesVisualization.push(node);
       var val = followUpPattern(nodes, finalEnd[0], finalEnd[1], pattern, placeholder, (j+1), nodesVisualization)
       if(finalEnd[0]=="PUT/job") console.log(key, status, i, nodes[key][status].statusArray.length);
       if(val) return true;
      nodesVisualization.splice(-1,1);
       placeholder = oldPlaceholder;
     }
   }
    if(j == patternSize) return true;
 }
 return j == patternSize;
}

var setUpPatternVisualization = function(g, nodesVisualization){
  for(let i = 0; i < nodesVisualization.length; i++){
    var full = nodesVisualization[i].method + nodesVisualization[i].url + ' ' + nodesVisualization[i].status;
    var key = nodesVisualization[i].method + nodesVisualization[i].url
    if(g._nodes[key] != undefined) g._nodes[key].class = "showPattern";
    g._nodes[full].style = "showPattern";
  }
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