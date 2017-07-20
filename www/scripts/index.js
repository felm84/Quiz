/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function loadUser(json) {
  let USER = $("#username").val();
  let PASS = $("#password").val();
  for (var i in json) {
    if (json[i].username === USER && json[i].password === PASS) {
      console.log(json[i].username + " - " + json[i].password);
      loadPage("#quizList");
      loadJsonFile("./json/quizzes_sample.json", "GET", loadQuiz);
      break;
    } else {
      console.log("Wrong pass");
    }
  }
}

function checkUser() {
  loadJsonFile("./json/users.json", "GET", loadUser);
}

function logOff() {
  //TODO delete all cookies and clear inputs
  
  loadPage("#login");
}



function loadPage(page) {
  $(":mobile-pagecontainer").pagecontainer("change", page);
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

//myObj = obj;
//myJSON = JSON.stringify(myObj);
//localStorage.setItem("testJSON", myJSON);
}

/* Loads and generates a list of
 * all quizzes available from json file*/
function loadQuiz(quiz) {
  var list = "";
  /* Loops through the quiz object and
   * convert it into HTML list tags */
  for (var i in quiz) {
    list += "<li><a href=\"#questionsPage\" id="+ quiz[i].id +" onclick=\"test()\" class=\"quiz-item\" data-transition=\"slide\">" + quiz[i].title + "</a></li>";
  }
  
  // Inserts the list into quiz_list id 
  $("#quiz_list").html(list);
  
  
  // Refreshes the quiz list to apply all jquery mobile UI
  $( "#quiz_list" ).listview( "refresh" );
 
 /* Event listener to catch the clicked 
  * quiz item in the quiz list
  * then keep id and obj in constants*/
 $(".quiz-item").click(function(){ 
   let id = $(this).attr("id");
   
   // Generates a cookie to be used in questions.html
   document.cookie = "quiz="+id;
 }); 
}


function test() {
  
  loadJsonFile("./json/quizzes_sample.json", "GET", selectObject);
}

function selectObject(obj) {
  let id = getCookie("quiz");
  for (var i in obj) {
    if (obj[i].id === id) {
      generateQuizPage(obj[i]);
    }
  }
}

function generateQuizPage(obj) {
  generateHeaderTitle(obj.title);
  
  generateQuestion(obj);
}

function generateHeaderTitle(title) {
  $(".title").text(title);
}

function generateQuestion(obj) {
  var q = "";
  if (obj.hasOwnProperty('questionsPerPage')) {
    q += "<legend>Questions per page:</legend>";
    obj.questionsPerPage.forEach(function(a){
      q += "<label for="+a+">"+a+"</label>";
      q += "<input type=\"radio\" name=\"qpp\" id="+a+" value="+a+">";  
    }); 
  } else {
    q += "<label for="+obj.questions[0].id+">"+obj.questions[0].text+"</label>";
    q += "<input type="+obj.questions[0].type+" name="+obj.questions[0].id+" id="+obj.questions[0].id+" placeholder="+obj.questions[0].help+">";
    
  }
  $(".question").html(q);
}

function extractElementFromObj(obj) {
//  for (var e in obj) {
//    switch(obj[e]){
//      obj[e] = "";
//    }
//    
//  }
  console.log(obj);
}