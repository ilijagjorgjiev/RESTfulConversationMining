var patternPlaceholder = {
  "0" : {
    method : "POST",
    status : "201",
    url : "$1"
  },
  "1" : {
    method : "GET",
    status : "*",
    url : "$2",
  },
  "2" : {
    method : "GET",
    status : "201",
    url : "$3"
  },
  "3" : {
    method : "DELETE",
    status : "*",
    url : "$3",
  },
}
var patternPlaceholder1 = {
  "0" : {
    method : "POST",
    status : "201",
    url : "$1"
  },
  "1" : {
    method : "GET",
    status : "*",
    url : "$2",
  },
}

var patternWild = {
  "0" : {
    method : "OPTIONS",
    status : "404",
    url : "$1"
  },
  "1" : {
    method : "*",
    status : "404",
    url : "$2"
  },
  "2" : {
    method : "*",
    status : "500",
    url : "$1"
  },
  "3" : {
    method : "DELETE",
    status : "*",
    url : "$3"
  },
  "4" : {
    method : "OPTIONS",
    status : "*",
    url : "*",
  },
  "5" : {
    method : "DELETE",
    status : "204",
    "url" : "$4"
  },
  "6" : {
    method : "DELETE",
    status : "500",
    "url" : "$1"
  }
}
var patternMixed = {
  "0" : {
    method : "*",
    status : "*",
    url : "*"
  },
  "1" : {
    method : "DELETE",
    status : "*",
    url : "/last"
  },
  "2" : {
    method : "*",
    status : "500",
    url : "*"
  },
  "3" : {
    method : "POST",
    status : "*",
    url : "/prev"
  },
  "4" :{
    method : "PUT",
    status : "*",
    url : "*",
  },
  5 : {method: "DELETE", url: "/job/1", status: "*", type: "whole"}
}
  var ipPattern = {
    "0" : {
      method : "POST",
      status : "*",
      url : "*",
      ips : 4,
    },
    "1" :{
      method : "GET",
      status : "*",
      url : "*",
      ips : 4
    },
    "2" :{
      method : "POST",
      status : "*",
      url : "*",
      ips : 2,
    },
    // "3" :{
    //   method : "GET",
    //   status : "*",
    //   url : "*",
    // }
  }

  var wholePattern = {
    "0" : {method: "POST", url: "/poll", status: "*", type: "whole"},
    "1" : {method: "PUT", url: "$2", "status" : "*", type: "whole"}
}

var posterPattern = {
  "0" :
  {method: "POST", url:"/poll/1", status: "201"},
  "1" :
  {method: "DELETE", url:"/poll/1", status: "200"}
}

  // var candidatePattern= {
  //   0 : {method: "*", url: "*", status: "*", ips: at least 2},
  //   1 : {method: "GET", url: "*", status: "*", ips: at least 2},
  //   2 : {method: "*", url: "*", status: "*", ips: at least 2},
  // }

  var user_select_patterns = { patternWild : patternWild, patternMixed : patternMixed,
    ipPattern : ipPattern,
  wholePattern : wholePattern,
 ptrn :  posterPattern,
 patternPlaceholder : patternPlaceholder,
  patternPlaceholder1  :  patternPlaceholder1};

  // "6" : {
  //   method : "POST",
  //   status : "403",
  //   url : "$2"
  // },
  // "7" : {
  //   method : "OPTIONS",
  //   status : "200",
  //   url : "$3"
  // },
  // "8" : {
  //   method : "GET",
  //   status : "303",
  //   url : "$1"
  // }
// patternURL = patternWild;
//
// var patternMixed = {
//   "0" : {
//     method : "OPTIONS",
//     status : "200"
//   }, //match only exact method and status, ignore URL
//   "1" : {
//     method : "POST",
//     status : "403",
//     url : "/resource/edit"
//   }, //match exact method and status, and URL
//   "2" : {
//     method : "OPTIONS",
//     status : "200",
//     xurl : "/1"
//   }, //match exact method and status, and URL placeholder
//   "3" : {
//     method : "GET",
//     status : "303",
//     xurl : "/1"
//   } //match exact method and status, and URL placeholder
// }
//
// var patternMixed = {
//   "0" : {
//     method : "OPTIONS",
//     status : "200",
//     url : $1
//   }, //match only exact method and status, ignore URL
//   "1" : {
//     method : "POST",
//     status : "403",
//     url : "/resource/edit"
//   }, //match exact method and status, and URL
//   "2" : {
//     method : "OPTIONS",
//     status : "200",
//     url : "$1"
//   }, //match exact method and status, and URL placeholder
//   "3" : {
//     method : "GET",
//     status : "303",
//     url : "$1"
//   } //match exact method and status, and URL placeholder
// }

// * 200 *
// * 200 /$
// * * *
// OPTIONS * *
// OPTIONS 200 *
// POST 403 /resource/edit
// OPTIONS 200 $1
// GET 303 $1
