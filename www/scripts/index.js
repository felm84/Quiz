/* 
 * This files was created by Felipe Menezes
 * on 12/07/2017. 
 * This is a quiz app required by SIT313 - Mobile Computing
 * for assignment01.
 * 
 */

// Submit form result
// 
// 1=2017-07-29&
// 2=Felipe+Menezes&
// 3=Write+4+paragraphs%0D%0Afsdfs%0D%0Asdf%0D%0Asdf&
// 4=Male&
// radio01=Happy&
// radio02=😆&
// 6=3&
// 7=0.03

/* GLOBAL VARIABLES
 * index = holds number of questions in #questionCounter
 * object = holds an array with all the questions from selected quiz
 * questions = holds the number of questions selected in questions per page */
var index = 0;
var object;
var questions = 1;

/* Checks user acount when form login is submitted*/
function loadUser(json) {
  let USER = $("#username").val();
  let PASS = $("#password").val();
  for (var i in json) {
    if (json[i].username === USER && json[i].password === PASS) {
      loadPage("#quiz-list");
      loadJsonFile("./json/quizzes_sample.json", "GET", loadQuiz);
      break;
    } else {
      // TODO implement error message
      console.log("Wrong pass");
    }
  }
}

/* Checks user acount when form login is submitted*/
function checkUser() {
  loadJsonFile("./json/users.json", "GET", loadUser);
}

/* Logs off and clear all values 
 * and return to #login page*/
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

/* TODO:
 * It will be implemented in Assignment02 */
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
    list += "<li><a href=\"#\" data-prefetch=\"true\" id="+ quiz[i].id +" class=\"quiz-item\" data-transition=\"slide\">" + quiz[i].title + "</a></li>";
  }

  // Inserts the list into #q-list 
  $("#q-list").html(list);

  // Refreshes the quiz list to apply all jquery mobile UI
  $( "#q-list" ).listview( "refresh" );

  /* Event listener to catch the clicked 
   * quiz item in the quiz list
   * then keeps id in let id constants*/
  $(".quiz-item").click(function(){
    let id = $(this).attr("id");
    // Generates a cookie to be used in #question
    document.cookie = "quiz="+id;
    loadJsonFile("./json/quizzes_sample.json", "GET", selectObject);
  }); 
}

/* Compares the selected quiz with
 * all the available in the json
 * file, then generates the quiz page*/
function selectObject(obj) {
  let id = getCookie("quiz");
  for (var i in obj) {
    if (obj[i].id === id) {
      generateQuizPage(obj[i]);
    }
  }
}

/* Generates parts of a quiz page*/
function generateQuizPage(obj) {
  // Holds the selected quiz obj in object variable
  object = obj;
  
  // Generates head title from the selected quiz
  generateHeaderTitle(object.title);
  
  // Finds which quiz was selected
  getQuestions();
}

// Generates head title from the selected quiz
function generateHeaderTitle(title) {
  $(".title").text(title);
}

/* Removes every element inside both forms:
 * .question and #qpp, so it can be added again
 * when user returns to #quiz-list page */
function clearPageForm() {
  $(".question").empty();
  $("#qpp").empty();
  disableElement("#nextBtn");
  disableElement("#prevBtn");
}

/* Gets all questions from selected quiz and 
 * finds out if quiz has option of question 
 * per page */
function getQuestions() {
  
  // Generates a list of all question in the DOM
  generateQuestionList();
  
  // Finds out if selected quiz has questionsPerPage option
  if (object.hasOwnProperty('questionsPerPage')) {
    
    // Generates questions per page option
    generateQuestionsPerPage();
    
    // Loads #questionPerPage page
    loadPage("#questionPerPage");
  } else {
    questions = 1;
    // Shows first question in #question page
    getFirstQuestion(questions);
  }
}

/* Convert all questions from object variable
 * into DOM objects and append them into the
 * .question page */
function generateQuestionList() {
  var questions = [];

  // creates a new Question object for each question
  object.questions.forEach(function(q) {
    questions.push(new Question(q));
  });

  // Loads all questions into DOM
  questions.forEach(function(q) {
    $(".question").append(q.buildQuestion());
  });
  
  $(".question div").first().addClass("first");
  $(".question div").last().addClass("last");
  
  // Hide all question from user
  $(".question").children().hide();
}

/* Generates first questions based on
 * the number passed as numOfQues parameter */
function getFirstQuestion(numOfQues) {
  index = numOfQues;
   
  $(".first").addClass("active");
  
  if(numOfQues > 1) {
    for (var i = 1; i < numOfQues; i++) {
      $(".active").next().addClass("active");
    }
  }
    
  // Count how many questions quiz has and current question
  countQuestions(object.questions.length);
  
  $(".active").show();
  
  // Enables next button
  enableElement("#nextBtn");
  
  // Loads page after all questions are appended into DOM
  loadPage("#question");
}

/* Generates a radio option for each index
 * in questionsPerPage array from json object,
 * then shows them for user */
function generateQuestionsPerPage() {
  var q = "";
  q += "<div class=\"ui-field-contain\"><legend>Questions per page:</legend>";
  object.questionsPerPage.forEach(function(a){
    q += "<label for="+a+">"+a+"</label>";
    q += "<input type=\"radio\" class=\"qpp\" name=\"qpp\" id="+a+" value="+a+">";
  });
  q += "</div>";

  $("#qpp").append(q);
  
  // Shows all options generate in var q
  $("#qpp div").first().addClass("active");
  $(".active").show();
  
  // Activates change event listner in .qpp
  $(".qpp").change(function() {
    
    // Number of questions to be shown
    questions = parseInt($(this).val());
  
    // Loads the number of questions selected by user
    getFirstQuestion(questions);
  });
}

/* Builds questions based on how many questions
 * are selected to be presented and button pressed*/
function buildQuestions(bool) { 
  
  let first = $(".active").first();
  let last = $(".active").last();
  
  $(".active").hide();
  $(".active").removeClass("active");
  
  // True = nextQuestion clicked
  // False = prevQuestion clicked
  if (bool === true) {
    last.next().addClass("active");
    if (questions > 1) {
      
      for (var i = 1; i < questions; i++) {
        if (!$(".active").hasClass("last")) {
          $(".active").next().addClass("active");
        }
      }
    }
  } else {
    first.prev().addClass("active");
    if (questions > 1 ){
      for (var i = 1; i < questions; i++) {
        if (!$(".active").hasClass("first")) {
          $(".active").prev().addClass("active");
        } 
      }
    }
  }
  
  // Shows all .active divs to the user
  $(".active").show();
  
  // Updates question counter
  countQuestions(object.questions.length);
}

/* Disables element passed as parameter */
function disableElement(element) {
  $(element).addClass("ui-state-disabled");
}

/* Enables element passed as parameter */
function enableElement(element) {
  $(element).removeClass("ui-state-disabled");
}

/* Function selects and build next question
 * from global variable object */
function nextQuestion() {
  
  index += questions;
  index = index > object.questions.length ? object.questions.length : index;
  
  if (index === object.questions.length) {
    disableElement("#nextBtn");
    enableElement("#prevBtn");
    $(".question").append("<input type=\"submit\" id=\"submit\" data-theme=\"b\" value=\"Submit Quiz\">");
    loadPage("#question");
  } else {
    enableElement("#prevBtn");
  }
  buildQuestions(true);
}

/* Function selects and build previous question
 * from global variable object */
function prevQuestion() {
  
  index -= questions;
  index = index < questions ? questions : index;

  if (index === questions) {
    disableElement("#prevBtn");
    enableElement("#nextBtn");
  } else {
    enableElement("#nextBtn");
  }
  $("#submit").remove();
  buildQuestions(false);
}

/* Updates #questionCounter based
 * on index global variable and 
 * number of questions available*/
function countQuestions(length) {
  
  if (index > length) {
    index = length;
  } else if (index < 1) {
    index = 1;
  }
  $("#questionCounter").html("Question: " + (index) + "/" + length);
}

/* Object to be generate when user selects
 * a quiz, it will check every question type
 * and generate DOM elements to be added on
 * the page. */
function Question(question) {

  this.Id = question.id;
  this.text = question.text;
  this.type = question.type;
  this.help = question.help;
  this.question = question;

  /* Constructor will be used to filter all
   * questions from json file and loads the
   * right input type into DOM */
  this.buildQuestion = function() {
    var q = "";
    var pageId = "q" + this.Id;
    switch (this.question.type) {
      case "date" :
        q += "<div class=\"ui-field-contain\" id="+pageId+"><label for="+this.Id+">"+this.text+"</label>";
        q += "<input type="+this.type+" name="+this.Id+" id="+this.Id+" placeholder="+this.help+"></div>";
        break;
      case "textbox" :
        if (this.help === undefined) this.help = "";
        q += "<div class=\"ui-field-contain\" id="+pageId+"><label for="+this.Id+">"+this.text+"</label>";
        q += "<input type=\"text\" name="+this.Id+" id="+this.Id+" placeholder="+this.help+"></div>";
        break;
      case "textarea" :
        q += "<div class=\"ui-field-contain\" id="+pageId+"><label for="+this.Id+">"+this.text+"</label>";
        q += "<textarea cols=\"40\" rows=\"5\" name="+this.Id+" id="+this.Id+">"+this.help+"</textarea></div>";
        break;
      case "choice" :
        q += "<div class=\"ui-field-contain\" id="+pageId+"><label class=\"select\" for="+this.Id+">"+this.text+"</label>";
        q += "<select name="+this.Id+" id="+this.Id+" data-inline=\"true\">";
        this.question.options.forEach(function(a) {
          q += "<option value="+a+">"+a+"</option>";
        });
        q += "</select></div>";    
        break;
        case "slidingoption" :
          q += "<div class=\"ui-field-contain\" id="+pageId+"><legend>"+this.text+"</legend>"; 
          this.question.options.forEach(function(a) {
            q += "<input type=\"radio\" name=\"radio01\" id="+a+" value="+a+">";
            q += "<label for="+a+">"+a+"</label>";
          });
          q += "<br>";
          this.question.optionVisuals.forEach(function(a) {
            q += "<input type=\"radio\" name=\"radio02\" id="+a+" value="+a+">";
            q += "<label for="+a+">"+a+"</label>";
          });
          q += "</div>";
          break;
      case "scale" :
        q += "<div class=\"ui-field-contain\" id="+pageId+"><label for="+this.Id+">"+this.text+"</label>";
        if (this.question.hasOwnProperty("gradientStart")) {
          q += "<input type=\"range\" onchange=\"changeBackgroundColor("+this.Id+")\" name="+this.Id+" id="+this.Id+" value="+this.question.start+" min="+this.question.start+" max="+this.question.end+" step="+this.question.increment+" data-highlight=\"true\"></div>";
        } else {
          q += "<input type=\"range\" name="+this.Id+" id="+this.Id+" value="+this.question.start+" min="+this.question.start+" max="+this.question.end+" step="+this.question.increment+" data-highlight=\"true\"></div>";
        }
        break;
      case "multiplechoice" :
        q += "<div class=\"ui-field-contain\" id="+pageId+"><legend>"+this.text+"</legend>";
         this.question.options.forEach(function(a) {
            q += "<input type=\"checkbox\" name="+a+" id="+a+" value="+a+">";
            q += "<label for="+a+">"+a+"</label>";
          });
        q += "</div>";
        break;
    }
    return q;
  };

}

/* Changes background color based 
 * on the value passed as a parameter
 * from range option */
function changeBackgroundColor(index) {
  let question = object.questions[index - 1];
  
  // Converts from hexadecimal value to integer
  let intStart = parseInt(question.gradientStart.slice(1), 16);
  let intEnd = parseInt(question.gradientEnd.slice(1), 16);
  
  // Gets an individual value from the division length
  let fragment = Math.abs(intStart - intEnd) / question.end;
  
  var value = $("#"+index).val();
  
  // Holds color value
  var color;
  
  /* Determines which one is bigger value
   * then converts interger to hexadecimal */
  if (intStart < intEnd) {
    color = ((value * fragment) + intStart).toString(16);
  } else {
    color = ((value * fragment) + intEnd).toString(16);
  }
  
  color = "#" + color;
  $(".ui-slider-bg").css("background-color", color);
}
    
function presentResult() {
  loadPage("#result");
}
