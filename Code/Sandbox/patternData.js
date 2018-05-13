var pattern = {
  "0" : {
    method : "GET",
    status : "200"
  },
  "1" : {
    method : "POST",
    status : "401"
  },
  "2" : {
    method : "GET",
    status : "404"
  },
  "3" : {
    method : "GET",
    status : "200"
  },
  "4" : {
    method : "GET",
    status : "300"
  }
}
var patternURL = {
  "0" : {
    method : "GET",
    status : "200",
    url : "/job/3"
  },
  "1" : {
    method : "GET",
    status : "300",
    url : "/other"
  },
  "2" : {
    method : "POST",
    status : "401",
    url : "/last"
  }
}
var patternWild = {
  "0" : {
    method : "GET",
    status : "200",
    url : "/job"
  },
  "1" : {
    method : "GET",
    status : "300",
    url : "/"
  },
  "2" : {
    method : "POST",
    status : "401",
    url : "/job"
  }
}
