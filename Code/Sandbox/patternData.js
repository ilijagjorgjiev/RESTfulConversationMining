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
    url : "/other"
  },
  "1" : {
    method : "POST",
    status : "403",
    url : "/resource/edit"
  },
  "2" : {
    method : "OPTIONS",
    status : "200",
    url : "/job/2/output"
  },
  "3" : {
    method : "GET",
    status : "303",
    url : "/other"
  }
}
patternURL = patternWild;

var patternMixed = {
  "0" : {
    method : "OPTIONS",
    status : "200"
  }, //match only exact method and status, ignore URL
  "1" : {
    method : "POST",
    status : "403",
    url : "/resource/edit"
  }, //match exact method and status, and URL
  "2" : {
    method : "OPTIONS",
    status : "200",
    xurl : "/1"
  }, //match exact method and status, and URL placeholder
  "3" : {
    method : "GET",
    status : "303",
    xurl : "/1"
  } //match exact method and status, and URL placeholder
}

var patternMixed = {
  "0" : {
    method : "OPTIONS",
    status : "200",
    url : undefined //*
  }, //match only exact method and status, ignore URL
  "1" : {
    method : "POST",
    status : "403",
    url : "/resource/edit"
  }, //match exact method and status, and URL
  "2" : {
    method : "OPTIONS",
    status : "200",
    url : "$1"
  }, //match exact method and status, and URL placeholder
  "3" : {
    method : "GET",
    status : "303",
    url : "/*/"
  } //match exact method and status, and URL placeholder
}

// * 200 *
// * 200 /$
// * * *
// OPTIONS * *
// OPTIONS 200 *
// POST 403 /resource/edit
// OPTIONS 200 $1
// GET 303 $1
