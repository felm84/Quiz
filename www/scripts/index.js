/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// preload page
$.mobile.loadPage("question_page.html");

/* Checks user acount when form login is submitted*/
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

/* Checks user acount when form login is submitted*/
function checkUser() {
  loadJsonFile("./json/users.json", "GET", loadUser);
}

function logOff() {
  //TODO delete all cookies and clear inputs
  $("#username").val("");
  $("#password").val("");
  loadPage("index.html");
}

/* Loads the page which passes through
 * the parameter apge and creates its
 * JQuery Mobile UI*/
function loadPage(page) {
  $(":mobile-pagecontainer").pagecontainer("change", page);
  $( '.ui-content' ).trigger( 'create' );
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
    list += "<li><a href=\"question_page.html\" data-prefetch=\"true\" id="+ quiz[i].id +" class=\"quiz-item\" data-transition=\"slide\">" + quiz[i].title + "</a></li>";
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

    // Generates a cookie to be used in #questionsPage
    document.cookie = "quiz="+id;
    loadJsonFile("./json/quizzes_sample.json", "GET", selectObject);
  }); 
}

/* Compares the selected quiz with
 * all the available ones in the json
 * file, then generates the quizPage*/
function selectObject(obj) {
  let id = getCookie("quiz");
  for (var i in obj) {
    if (obj[i].id === id) {
      generateQuizPage(obj[i]);
    }
  }
}

// Global variables to control next and previous questions
var questArray;
var index = 0;

/* Generates parts of a quiz page*/
function generateQuizPage(obj) {
  index = 0;
  generateHeaderTitle(obj.title);
  questArray = generateQuestions(obj);
}

function generateHeaderTitle(title) {
  $(".title").text(title);
}

function generateQuestions(obj) {

  var questions = [];

  obj.questions.forEach(function(q) {
    questions.push(new Question(q));
  });

  //First question
  buildAQuestion(questions, index);
  disableButton("#prevBtn");
  
  // return the array with all questions from selected quiz
  return questions;
}

/* Function to connect global variable to
 * Question constructor, then generates the question*/
function buildAQuestion(arrayQ, index) {
  $(".question").html(arrayQ[index].buildQuestion());
  loadPage("question_page.html");
  countQuestions(arrayQ.length);
}

//================================================================================================
function disableButton(element) {
  $(element).addClass("ui-state-disabled");
}

function enableButton(element) {
  $(element).removeClass("ui-state-disabled");
}

/* Function selects and build next question
 * from global variable questArray */
function nextQuestion() {
  index++;
  if (index === (questArray.length - 1)) {
    disableButton("#nextBtn");
    buildAQuestion(questArray, index);
  } else {
    enableButton("#prevBtn");
    buildAQuestion(questArray, index);
  }
}

/* Function selects and build previous question
 * from global variable questArray */
function prevQuestion() {
  index--;
  if (index === 0) {
    disableButton("#prevBtn");
    buildAQuestion(questArray, index);
  } else {
    enableButton("#nextBtn");
    buildAQuestion(questArray, index);
  }
}

function countQuestions(length) {
  $("#questionCounter").html("Question: " + (index + 1) + "/" + length);
}

function Question(question) {

  this.Id = question.id;
  this.text = question.text;
  this.type = question.type;
  this.help = question.help;
  this.question = question;

  this.buildQuestion = function() {
    var q = "";
    switch (this.question.type) {
      case "date" :
        q += "<label for="+this.Id+">"+this.text+"</label>";
        q += "<input type="+this.type+" name="+this.Id+" id="+this.Id+" placeholder="+this.help+">";
        break;
      case "textbox" :
        if (this.help === undefined) this.help = "";
        q += "<label for="+this.Id+">"+this.text+"</label>";
        q += "<input type=\"text\" name="+this.Id+" id="+this.Id+" placeholder="+this.help+">";
        break;
      case "textarea" :
        q += "<label for="+this.Id+">"+this.text+"</label>";
        q += "<textarea cols=\"40\" rows=\"8\" name="+this.Id+" id="+this.Id+">"+this.help+"</textarea>";
        break;
      case "choice" :
        q += "<label class=\"select\" for="+this.Id+">"+this.text+"</label>";
        q += "<select name="+this.Id+" id="+this.Id+" data-inline=\"true\">";
        this.question.options.forEach(function(a) {
          q += "<option value="+a+">"+a+"</option>";
        });
        q += "</select>";    
        break;
        case "slidingoption" :
          q += "<legend>"+this.text+"</legend>"; 
          this.question.options.forEach(function(a) {
            q += "<input type=\"radio\" name=\"radio01\" id="+a+" value="+a+">";
            q += "<label for="+a+">"+a+"</label>";
          });
          q += "<br>";
          this.question.optionVisuals.forEach(function(a) {
            q += "<input type=\"radio\" name=\"radio02\" id="+a+" value="+a+">";
            q += "<label for="+a+">"+a+"</label>";
          });   
          break;
      case "scale" :
        q += "<label for="+this.Id+">"+this.text+"</label>";
        q += "<input type=\"range\" name="+this.Id+" id="+this.Id+" value="+this.question.start+" min="+this.question.start+" max="+this.question.end+" step="+this.question.increment+" data-highlight=\"true\">";
        if (this.question.hasOwnProperty("gradientStart")) {
          //changeBackgroundColor(this.question.gradientStart, this.question.gradientEnd, this.question.end, this.question.start);
        }
        break;
      case "multiplechoice" :
        q += "<legend>"+this.text+"</legend>";
         this.question.options.forEach(function(a) {
            q += "<input type=\"checkbox\" name="+a+" id="+a+" value="+a+">";
            q += "<label for="+a+">"+a+"</label>";
          });
        
        break;
    }
    return q;
  };

//  this.buildQuestions = function() {
//    var q = "";
//    if (question.hasOwnProperty('questionsPerPage')) {
//      q += "<legend>Questions per page:</legend>";
//      question.questionsPerPage.forEach(function(a){
//        q += "<label for="+a+">"+a+"</label>";
//        q += "<input type=\"radio\" class=\"qpp\" name=\"qpp\" id="+a+" value="+a+">";
//        //TODO another function where it creates another page inside this one
//      }); 
//    } else {
//      q += "<label for="+this.Id+">"+this.text+"</label>";
//      q += "<input type="+this.type+" name="+this.Id+" id="+this.Id+" placeholder="+this.help+">";
//      //TODO function to create page1, page2 an so on
//    }
//
//    return q;
//  };
}

function changeBackgroundColor(gradientStart, gradientEnd, length, value) {
  // Converts from hexadecimal to integer
  let intStart = parseInt(gradientStart, 16);
  let intEnd = parseInt(gradientEnd, 16);
  let fragment = Math.abs(intStart - intEnd) / length;
  var color = (value * fragment).toString(16);;
  
  $(".ui-content").css("background-color", color);
  console.log(color);
}
  
  
  
