/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$( "document" ).pagecontainer( "change", "questions.html" );

//loadJsonFile("./json/quizzes_sample.json", generateQuizPage);

/* obj constant holds object value 
* from a json file after executed
* selectObject function */

loadJsonFile("./json/quizzes_sample.json", selectObject);

let id = getCookie("quiz");

function selectObject(obj) {
  
  for (var i in obj) {
    if (obj[i].id === id) {
      console.log(obj[i]);
    }
  }
}

function generateQuizPage(obj) {
  generateHeaderTitle(obj.title);
  
  generateQuestion(obj);
  console.log(obj);
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