var pattern = {
  "0" : {
    method : "GET",
    status : "200"
  },
  "1" : {
    method : "DELETE",
    status : "500"
  },
  // "2" : {
  //   method : "GET",
  //   status : "404"
  // },
  // "3" : {
  //   method : "GET",
  //   status : "200"
  // },
  // "4" : {
  //   method : "GET",
  //   status : "300"
  // }
}
var patternURL = {
  "0" : {
    method : "POST",
    status : "200",
    url : "/resource/edit"
  },
  "1" : {
    method : "POST",
    status : "401",
    url : "/resource"
  },
  "2" : {
    method : "POST",
    status : "201",
    url : "/"
  }
}
var patternWild = {
  "0" : {
    method : "OPTIONS",
    status : "200",
    url : "$1"
  },
  "1" : {
    method : "POST",
    status : "403",
    url : "$2"
  },
  "2" : {
    method : "OPTIONS",
    status : "200",
    url : "$3"
  },
  "3" : {
    method : "GET",
    status : "303",
    url : "$1"
  }
}
var patternMixed = {
  "0" : {
    method : "*",
    status : "*",
    url : "*"
  },
  "1" : {
    method : "*",
    status : "500",
    url : "*"
  },
  "2" : {
    method : "DELETE",
    status : "*",
    url : "/last"
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
  "5" : {
    method : "OPTIONS",
    status : "200",
    url : "$1"
  },
  "6" : {
    method : "POST",
    status : "403",
    url : "$2"
  },
  "7" : {
    method : "OPTIONS",
    status : "200",
    url : "$3"
  },
  "8" : {
    method : "GET",
    status : "303",
    url : "$1"
  }
}
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
//     url : "*" //*
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
//     url : "$2"
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
