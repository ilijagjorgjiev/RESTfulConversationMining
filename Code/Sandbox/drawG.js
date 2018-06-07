var drawG = function(g, nodes, comparisonTableData, incomingXorNodes, totalAvgKey, maxDelay, minDelay, totalRequests, endConnections, statusObj){
  for(var key in nodes){
    var size = Object.keys(nodes[key]).length;
    if(size == 1){
      var status = Object.keys(nodes[key])[0]
      var str = "inXOR-"+key
      let word = setUpClassForDifferentIpTp(nodes, key, status);
      updateComparisonUniqueness(word, comparisonTableData, key, status);
      hasStatus(statusObj, status);
      let patternClazz = getPatternClassName(key, status);
      let clazz = getClassForNode(word, patternClazz, nodes, key, status);
      if(incomingXorNodes[key] !== undefined) checkIfIncomingXorExists(nodes, key, incomingXorNodes, Object.keys(incomingXorNodes[key]).length, "inXOR-"+key)
      let label = nodes[key][status].statusArray[0].key + '\n' + status + '\n' + "(" + nodes[key][status].statusArray.length + ")";
      let id = key+' '+status;
      g.setNode(id, { shape: "rect",
      label : label,
      class: clazz});
      if(nodes[key][status].outgoingXOR){
        g.setNode("XOR-"+id, {label: "XOR", shape: "diamond", class: "type-XOR outgoingXOR"});
      }
      if((nodes[key][status].statusArray.length) > 1 && Object.keys(incomingXorNodes[key]).length > 1){
        var str = "inXOR-"+key
        g.setNode(str, {label: "XOR", shape: "diamond", class: "type-XOR incomingXOR"});
      }
    }
    else{
      var st = Object.keys(nodes[key])[0]
      var word = setUpTotalClassForDifferentIpTp(nodes, key);
      let patternClazz = getPatternClassName(key, undefined);
      updateComparisonUniqueness(word, comparisonTableData, key, undefined);
      let clazz = getClassForNode(word, patternClazz, nodes, key, "");
      let label = nodes[key][st].statusArray[0].key + '\n' + "(" + totalRequests[key] + ")";
      g.setNode(key, {shape: "rect", label: label, class: clazz});
      g.setNode("middleXOR-"+key,{label: "XOR", shape: "diamond", class: "type-XOR middleXOR"});
      var str = "inXOR-"+key
      if(Object.keys(incomingXorNodes[key]).length > 1) g.setNode(str, {label: "XOR", shape: "diamond", class: "type-XOR incomingXOR"});
      for(var status in nodes[key]){
        let id = key+' '+status;
        word = setUpClassForDifferentIpTp(nodes, key, status);
        patternClazz = getPatternClassName(key, status);
        clazz = getClassForNode(word, patternClazz, nodes, key, status);
        let label = status + '\n' +"(" + nodes[key][status].statusArray.length + ")";
        updateComparisonUniqueness(word, comparisonTableData, key, status);
        hasStatus(statusObj, status);
        g.setNode(id, {shape: "rect", label : label, class: clazz});
        if(nodes[key][status].outgoingXOR){
          g.setNode("XOR-"+key+' '+status, {label: "XOR", shape: "diamond", class: "type-XOR outgoingXOR"});
        }
      }
    }
  }
  //Set Up Edges
  for(var key in nodes){
    var str = "inXOR-"+key
    var size = Object.keys(nodes[key]).length
    var bin = computeAssignBin(totalAvgKey[key].totalDelayAvgKey, maxDelay, 1);
    if(size == 1){
      var status = Object.keys(nodes[key])[0]
      let clazz = "edge-thickness-" + nodes[key][status].statusArray.length + " " + "delay-coloring-" + bin;
      let id = key+' '+status;
      if(nodes[key][status].outgoingXOR){
        g.setEdge(id,"XOR-"+id, {class: clazz});

      }
      if(nodes[key][status].statusArray.length > 1 && Object.keys(incomingXorNodes[key]).length == 1){
        let space = Object.keys(incomingXorNodes[key])[0]
        let p = getProbabilityLabel(nodes, nodes[key][status].statusArray[0].start.split(' ')[0], nodes[key][status].statusArray[0].start.split(' ')[1], incomingXorNodes[key][space].length);
        g.setEdge(nodes[key][status].statusArray[0].start, key+' '+status, {label: p, class: clazz})

      }
      if(nodes[key][status].statusArray.length == 1){
        let p = getProbabilityLabel(nodes, nodes[key][status].statusArray[0].start.split(' ')[0], nodes[key][status].statusArray[0].start.split(' ')[1], 1);
        g.setEdge(nodes[key][status].statusArray[0].start, key+' '+status, {label : p, class: clazz})

      }
      if(nodes[key][status].statusArray.length > 1 && Object.keys(incomingXorNodes[key]).length > 1){
        g.setEdge("inXOR-"+key, id, {class: clazz})

        for(var space in incomingXorNodes[key]){
          var len = incomingXorNodes[key][space][0].length;
          if(len == 1){
            g.setEdge(incomingXorNodes[key][space][0][0], str,
              {class: "edge-thickness-" + incomingXorNodes[key][space].length + " delay-coloring-0"})
              comparisonTableData.uniqueOverlapping.uniqueEdges.size++;

            }
            else{
              let avg = getIncomingEdgeIndexDelay(nodes, key, incomingXorNodes[key][space][0][0]+' '+incomingXorNodes[key][space][0][1], incomingXorNodes[key][space].length);
              bin = computeAssignBin(avg, maxDelay, 1);
              let p = getProbabilityLabel(nodes, incomingXorNodes[key][space][0][0], incomingXorNodes[key][space][0][1], incomingXorNodes[key][space].length);
              g.setEdge(incomingXorNodes[key][space][0][0]+' '+incomingXorNodes[key][space][0][1], str,
              { label : p,
                class: "edge-thickness-" + incomingXorNodes[key][space].length + " delay-coloring-"+bin})
              }
            }
          }
        }
        else{
          var str1 = "middleXOR-"+key;
          let clazz ="edge-thickness-"+totalRequests[key] + " " + "delay-coloring-"+bin;
          if(Object.keys(incomingXorNodes[key]).length > 1){
            g.setEdge(str,key, {
              class: clazz});

            }
            g.setEdge(key,str1, {class: "edge-thickness-"+totalRequests[key] + " " + "delay-coloring-0"});
            for(var status in nodes[key]){
              bin = computeAssignBin(nodes[key][status].avgDelay, maxDelay, 1);
              let p = roundUp(nodes[key][status].statusArray.length/totalRequests[key]*100,1)+"%";
              clazz = "edge-thickness-" +nodes[key][status].statusArray.length + " " + "delay-coloring-"+bin
              let id = key+' '+status;
              g.setEdge(str1, id,{label: p, class: clazz})
              if(nodes[key][status].outgoingXOR){
                g.setEdge(id, "XOR-"+id,
                {class: "edge-thickness-" + nodes[key][status].statusArray.length + " delay-coloring-0"});
              }
            }
            multipleIncomingXorSetUp(g, nodes, key, Object.keys(incomingXorNodes[key]).length, maxDelay, 1, incomingXorNodes)
          }
        }
        //Set Up End Node
        for(var end in endConnections){
          var endConnection = endConnections[end];
          var spaces =  endConnection.split(' ');
          var k = spaces[0]
          var s = spaces[1]
          if(nodes[k][s].outgoingXOR){
            g.setEdge("XOR-"+k+' '+s, "end-"+end, {
              label : roundUp(1/totalRequests[k]*100,1)+"%",
              class: "edge-thickness-1 delay-coloring-0"})
            }
            else{
              g.setEdge(k+' '+s, "end-"+end, {class: "edge-thickness-1 delay-coloring-0"});
            }
          }
          g.nodes().forEach(function(v) {
            var node = g.node(v);
            // console.log(node);
            // console.log(g.nodes())
            // Round the corners of the nodes
            node.rx = node.ry = 5;
          });
        }
