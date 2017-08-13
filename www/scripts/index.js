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
let URL = "http://introtoapps.com/datastore.php?";
let SID = "&appid=215242834";
var action = "action=load";
var objectID = "&objectid=quizzes.json";
var index = 0;
var object;
var quiz;
var questions = 1;



/* Checks user acount when form login is submitted*/
function CheckUser(users) {
  
  let id = "#login_error";
  var result = -1;
  
  if ($("#user").val() !== "" || $("#pass").val() !== "") {
    for(var u in users) {
      if($("#user").val() === users[u].username && $("#pass").val() === users[u].password) {
        result = 0;
      }
    }
  } else {
    result = -2;
  }
  
  switch(result) {
    case -2:
      GenerateError(id, "<p>You missed your Username or Password!</p>");
      break;
    case -1:
      GenerateError(id, "<p>Wrong Username or Password!</p>");
      break;
    default:
      Request(URL + action + SID + objectID, "GET", "json", LoadQuiz);
      $( ":mobile-pagecontainer" ).pagecontainer( "change", "index.html#quiz-list", {
        role: "page",
        transition: "flip"
      });
      break;
  }
}

// Generate popup error information
function GenerateError(id, error) {
  $(id + " p").remove("p");
  $(id).append(error);
  $(id).popup("open");
}

/* Checks user acount when login button is clicked*/
function LoadUser() {
  // Make a request to find user account.
  Request(URL + action + SID + "&objectid=users.json", "GET", "json", CheckUser);
 
}

/* TODO:
 * It will be implemented in Assignment02 */
function RegisterUser() {
 
  var data = $("#register_form").serialize().split("&");
  var obj={};
  for(var key in data)
  {
    obj[data[key].split("=")[0]] = data[key].split("=")[1];
  }
  
  for (var i in obj) {
    if (obj[i] !== "") {
      if (!CheckInputs(i, obj[i])) {
        break;
      }
    } else {
      GenerateError("#register_error", "<p>Please, fill all inputs up!</p>");
      break;
    }
  }
  
  data = JSON.stringify(obj);
   
  //var url = URL + "action=append" + SID + "&objectid=users.json&data=" + data;
  
  //Request(url, "POST", "post", LogOff); 
}

function CheckInputs(key, value) {
  
  var result = false;
  
  switch(key) {
    case "username":
      CheckUsername(value);
      break;
    case "password":
      CheckPassword(value);
      break;
    case "name":
      CheckName(value);
      break;
    case "email":
      CheckEmail(value);
      break;
  }
  return result;
}

function CheckUsername(value) {
  
  Request(URL + action + SID + "&objectid=users.json", "GET", "json", function(data) {
    let regex = /^(\w+)$/;

    if (value.length < 4 || value.length > 10) {
      GenerateError("#register_error", "<p>Username must have between 4 and 10 characters!</p>");
    } else if (!value.match(regex)) {
      GenerateError("#register_error", "<p>Username accepts letters and numbers only!</p>");
    } else {
      
      for (var u in data) {
        if (data[u].username === value) {
          GenerateError("#register_error", "<p>Username already taken!</p>");
          break;
        }
      }
    }
    
  });
  
}

function CheckPassword(value) {
  
  if (value.length < 5 || value.length > 15) {
    GenerateError("#register_error", "<p>Please, Password must have between 5 and 15 characters!</p>");
  }
}

function CheckName(value) {
  
  let regex = /^([a-zA-Z\s])+/;
  
  if (value.length < 2 || value.length > 40) {
    GenerateError("#register_error", "<p>Please, Full name must have between 2 and 40 characters!</p>");
  } else if (!value.match(regex)) {
    GenerateError("#register_error", "<p>Please, Full name accepts letters only!</p>");
  }
}

function CheckEmail(value) {
  
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  if (!value.match(regex)) {
    GenerateError("#register_error", "<p>Please, Use a valid email!</p>");
  }
}

function Request(url, type, dataType, callBack) {
  $.ajax ({
    url: url,
    type: type,
    dataType: dataType,
    complete: function () {
      // This callback function will trigger on data sent/received complete
      console.log("COMPLETE...");
 
    },
    success: function(data) {
      callBack(data);
    },
    error: function (error) {
      // This callback function will trigger on unsuccessful action                
      console.log(error);
    }
  });
}

/* Logs off and clear all values 
 * and return to #login page*/
function LogOff() {
  //TODO delete all cookies and clear inputs
  $('#login_form').trigger("reset");
  $('#register_form').trigger("reset");
  
  $( ":mobile-pagecontainer" ).pagecontainer( "change", "index.html", { 
    role: "page",
    transition: "flip",
    reverse: true
  });
}

/* Loads the page which passes through
 * the parameter apge and creates its
 * JQuery Mobile UI*/
function loadPage(page) {
  $(":mobile-pagecontainer").pagecontainer("change", page);
  $( '.ui-content' ).trigger( 'create' );
}

/* Loads and generates a list of
 * all quizzes available from json file*/
function LoadQuiz(quiz) {
  object = quiz;

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
    
    selectObject();
    //loadJsonFile(URL + action + SID + objectID, "GET", selectObject);
  }); 
}

/* Compares the selected quiz with
 * all the available in the json
 * file, then generates the quiz page*/
function selectObject() {
  let id = getCookie("quiz");
  for (var i in object) {
    if (object[i].id === id) {
      generateQuizPage(object[i]);
      break;
    }
  }
}

/* Generates parts of a quiz page*/
function generateQuizPage(selectedQuiz) {
    
  quiz = selectedQuiz;
  
  // Generates head title from the selected quiz
  generateHeaderTitle(quiz.title);
  
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
  if (quiz.hasOwnProperty('questionsPerPage')) {
    
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

  // creates a DOM element for each question
  quiz.questions.forEach(function(q) {
    $(".question").append(BuildQuestions(q));
  });

  $(".question div").first().addClass("first");
  $(".question div").last().addClass("last");
  
  // Hide all question from user
  $(".question").children().hide();
}

/* BuildQuestions function generate question
 * generate DOM elements to be added on when 
 * user selects a quiz, it will check every 
 * question type and select the right one. */
function BuildQuestions(question) {
    var q = "";
    var id = "q" + question.id;
    
    switch (question.type) {
      case "date" :
        q += "<div class=\"ui-field-contain\" id="+id+"><label for="+question.id+">"+question.text+"</label>";
        q += "<input type="+question.type+" name="+question.id+" id="+question.id+" placeholder="+question.help+"></div>";
        break;
      case "textbox" :
        if (question.help === undefined) question.help = "";
        q += "<div class=\"ui-field-contain\" id="+id+"><label for="+question.id+">"+question.text+"</label>";
        q += "<input type=\"text\" name="+question.id+" id="+question.id+" placeholder="+question.help+"></div>";
        break;
      case "textarea" :
        q += "<div class=\"ui-field-contain\" id="+id+"><label for="+question.id+">"+question.text+"</label>";
        q += "<textarea cols=\"40\" rows=\"5\" name="+question.id+" id="+question.id+">"+question.help+"</textarea></div>";
        break;
      case "choice" :
        q += "<div class=\"ui-field-contain\" id="+id+"><label class=\"select\" for="+question.id+">"+question.text+"</label>";
        q += "<select name="+question.id+" id="+question.id+" data-inline=\"true\">";
        question.options.forEach(function(a) {
          q += "<option value="+a+">"+a+"</option>";
        });
        q += "</select></div>";    
        break;
        case "slidingoption" :
          q += "<div class=\"ui-field-contain\" id="+id+"><legend>"+question.text+"</legend>"; 
          question.options.forEach(function(a) {
            q += "<input type=\"radio\" name=\"radio01\" id="+a+" value="+a+">";
            q += "<label for="+a+">"+a+"</label>";
          });
          q += "<br>";
          question.optionVisuals.forEach(function(a) {
            q += "<input type=\"radio\" name=\"radio02\" id="+a+" value="+a+">";
            q += "<label for="+a+">"+a+"</label>";
          });
          q += "</div>";
          break;
      case "scale" :
        q += "<div class=\"ui-field-contain\" id="+id+"><label for="+question.id+">"+question.text+"</label>";
        if (question.hasOwnProperty("gradientStart")) {
          q += "<input type=\"range\" onchange=\"changeBackgroundColor("+question.id+")\" name="+question.id+" id="+question.id+" value="+question.start+" min="+question.start+" max="+question.end+" step="+question.increment+" data-highlight=\"true\"></div>";
        } else {
          q += "<input type=\"range\" name="+question.id+" id="+question.id+" value="+question.start+" min="+question.start+" max="+question.end+" step="+question.increment+" data-highlight=\"true\"></div>";
        }
        break;
      case "multiplechoice" :
        q += "<div class=\"ui-field-contain\" id="+id+"><legend>"+question.text+"</legend>";
         question.options.forEach(function(a) {
            q += "<input type=\"checkbox\" name="+a+" id="+a+" value="+a+">";
            q += "<label for="+a+">"+a+"</label>";
          });
        q += "</div>";
        break;
    }
    return q;
  };

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
  countQuestions(quiz.questions.length);
  
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
  quiz.questionsPerPage.forEach(function(a){
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
  countQuestions(quiz.questions.length);
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
  index = index > quiz.questions.length ? quiz.questions.length : index;
  
  if (index === quiz.questions.length) {
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

/* Changes background color based 
 * on the value passed as a parameter
 * from range option */
function changeBackgroundColor(index) {
  let question = quiz.questions[index - 1];
  
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
  
  
  //var myObj = obj;
  //var myJSON = JSON.stringify(myObj);
  //localStorage.setItem("register", myJSON);
  
  console.log($(".question").serialize());
  
  //loadPage("#result");
}
