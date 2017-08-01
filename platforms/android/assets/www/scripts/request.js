/* 
 * This files was created by Felipe Menezes
 * on 12/07/2017. 
 * This is a quiz app required by SIT313 - Mobile Computing
 * for assignment01.
 * 
 */

/* Makes a request and returns data back to
 * callBack function */
function loadJsonFile(file, method, callBack) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var json = JSON.parse(this.responseText);
      callBack(json);
    }
  };
  xmlhttp.open(method, file, true);
  xmlhttp.send();
}

/* Gets cookie passed as a parameter */
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}