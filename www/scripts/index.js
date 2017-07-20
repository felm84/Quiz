/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//myObj = { "name":"John", "age":31, "city":"New York" };
//myJSON = JSON.stringify(myObj);
//localStorage.setItem("testJSON", myJSON);

function loadUser(json) {
  let USER = $("#username").val();
  let PASS = $("#password").val();
  for (var i in json) {
    if (json[i].username === USER && json[i].password === PASS) {
      console.log(json[i].username + " - " + json[i].password);
      loadQuizPage();
      break;
    } else {
      console.log("Wrong pass");
    }
  }
}

function checkUser() {
  loadJsonFile("./json/users.json", loadUser);
}

function loadQuizPage() {
  window.location.href = "quizpage.html";
}


function registerUser() {
  let USER = $("#reg_username").val();
  let PASS = $("#reg_password").val();
  let RPASS = $("#rep_reg_password").val();
  let NAME = $("#reg_name").val();
  let EMAIL = $("#reg_email").val();

  var obj = {
    "username": USER,
    "password": RPASS,
    "name": NAME,
    "email": EMAIL,
    "save": false
  };

  //addUser(obj, "./json/users.json");
}

