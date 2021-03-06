/* 
 * This files was created by Felipe Menezes
 * on 12/07/2017. 
 * This is a quiz app required by SIT313 - Mobile Computing
 * for assignment01.
 * 
 */


/* GLOBAL VARIABLES
 * index = holds number of questions in #questionCounter
 * quiz = holds all quiz object information from the selected quiz in quizzes.json file
 * questions = holds the number of questions selected in questions per page
 * score = holds the total amount of weighting earned
 * username = holds the username value to be used in   */

var index = 0;
var quiz;
var questions = 1;
var score = 0;
var username;
var quizList;

// Clears local storage every start
localStorage.clear();

$(document).ready(function() {
  
  // Holds the timeout function
  var wakeUp;
  
  // Block of code with all event handler possible for inputs to be checked
  $("input").on({
    // Checks input after 3 seconds of input focused and no action from user
    focus: function() {
      let input = this;
      wakeUp = setTimeout(function() {
        checkInput(input);
      }, 3000);
    },
    // Checks input after key is up
    keyup: function() {
      // Keyup check input, then add error if any
      checkInput(this);
    },
    // Stops counting, removes error message and checks input when user leave input
    blur: function() {
      clearTimeout(wakeUp);
      removeInputError(this);
      checkInput(this);
    },
    // Stops counting and removes error message when key is down
    keydown: function() {
      clearTimeout(wakeUp);
      removeInputError(this);
    }
  });
});

// Checks input function 
function checkInput(input) {
  // Holds name from passed input
  let inputType = $(input).attr("name");
  
  // Holds value from passed input 
  let inputValue = $(input).val();
  
  // Validation
  var result = false;
  
  // If input value is empty, it presents error under the input
  if(inputValue === "") {
    addInputError(input, "Please, fill this input!");
    
    // If is not empty, it checks the input value
  } else {
    switch(inputType) {
      case "username":
        result = checkUsername(input, inputValue);
        break;
      case "password":
        result = checkPassword(input, inputValue);
        break;
      case "name":
        result = checkName(input, inputValue);
        break;
      case "email":
        result = checkEmail(input, inputValue);
        break;
    }
  }
  return result;
}

// Adds error right under the checked input
function addInputError(input, message) {
  let p =  "<p class='error'>";
  let error = $(p).text(message);
  let parent = $(input).parent();
  
  // Checks if error is present, if so it changes the message
  if($(parent).next().hasClass("error")) {
    $(parent).next().text(message);
    
    // Else it presents the error
  } else {
    $(parent).after(error);
  }
  
  // Adds red shadown around the input
  addRedShadow(input);
}

// Removes error right under the checked input
function removeInputError(input) {
  let parent = $(input).parent();
  
  // Removes the error from input
  if($(parent).next().hasClass("error")) {
    $(parent).next().remove();
  }
  
  removeRedShadow(input);
}

// Add red color to the error message
function addRedShadow(input) {
  $(input).css("box-shadow", "0 0 10px red");
}

// Removes red color to the error message
function removeRedShadow(input) {
  $(input).css("box-shadow", "");
}

/* Checks user acount when form login is submitted*/
function checkUser() {
  
  // Converts the form into an array of objects
  var data = $("#login_form").serializeArray();
  
  var obj = {};
  
  // Loop converts data serialized into an object.
  data.forEach(function(a){
    obj[a.name] = a.value;
  });
  
  if (obj.user === "") {
    addInputError($("#user"), "Please, type your username!");
  } else if (obj.pass === "") {
    addInputError($("#pass"), "Please, type your password!");
  } else {
    // Converts password input value to sha256 cryptography value
    obj.pass = SHA256(obj.pass);
    
    // Make a request to find user account.
    request("http://introtoapps.com/datastore.php?action=load&appid=215242834&objectid=users.json", "GET", "json", "#login_error", function(users) {
      // Then a loop runs until users last object in users.json
      for (var u in users) {
        // It compares username and password typed to users.json data
        if (obj.user === users[u].username && obj.pass === users[u].password) {
          // Updates the username global variable;
          username = users[u].username;
          
          // Presents the user full name and login is succeful
          $("#color-name").text(users[u].name);

          // Request loads all available quizzes from quizzes.json
          request("http://introtoapps.com/datastore.php?action=load&appid=215242834&objectid=quizzes.json", "GET", "json", "#quiz-list_error", loadQuiz);
 
          // Changes from index page to #quiz-list page
          $( ":mobile-pagecontainer" ).pagecontainer( "change", "index.html#quiz-list", {
            role: "page",
            transition: "flip"
          });
          
          // Break out of loop when username and password match 
          break;
        } else {
          // Generates a pop up error when username or password is wrong
          generateError("#login_error", "Wrong Username or Password!");
        }
      }   
    });
  }
}

// Generate popup error information
function generateError(id, error) {
  $(id + " p").text(error);
  $(id).popup("open");
}

/* Gets all information from register form,
 * validades, then update the data base if all true.*/
function registerUser() {
 
  var data = $("#register_form").serializeArray();
  var obj={};
  
  // Loop converts data serialized into an object.
  data.forEach(function(a){
    obj[a.name] = a.value;
  });
  
  for (var i in obj) {
    if (checkInput($("#"+i))) {
      if (i === "password") {
        obj[i] = SHA256(obj[i]);
      } else if (i === "email") {
        data = JSON.stringify(obj);

        // Updates users.json file with a new user
        request("http://introtoapps.com/datastore.php?action=append&appid=215242834&objectid=users.json&data="+data, "POST", "", "#register_error", logOff);
      }
    } else {
      break;
    }
  }    
}

/* Checks username and present errors if fail */
function checkUsername(input, value) {
  var result = false;
  
  // Regular expression (letters and numbers)
  let regex = /^(\w+)$/;
  
  // Checks if input value length is between 4 and 10 
    if (value.length < 4 || value.length > 10) {
      addInputError(input, "Username must have between 4 and 10 characters!");
    
      // Checks if input value match regular expression
    } else if (!value.match(regex)) {
      addInputError(input, "Username accepts letters and numbers only!");

      // Else loops through all users and check if user already exist
    } else {
      result = true;
      // Makes request to get all users in users.json file
      request("http://introtoapps.com/datastore.php?action=load&appid=215242834&objectid=users.json", "GET", "json", "#register_error", function(data) {    
        for (var u in data) {
          if (data[u].username === value) {
            addInputError(input, "Username has already been taken!");
            result = false;
            break;
          }
        }
      });
    }
  return result;
}

/* Checks password and present errors if fail */
function checkPassword(input, value) {
  var result = false;
    
  // Checks if input value length is between 5 and 15 characters
  if (value.length < 5 || value.length > 15) {
    addInputError(input, "Password must have between 5 and 15 characters!");
    
  } else {
    result = true;
  }
  
  return result;
}

/* Checks name and present errors if fail */
function checkName(input, value) {
  var result = false;
  
  // Regular expression(letters only)
  let regex = /^([a-zA-Z\s])+$/;
  
  // Checks if input value is between 2 and 40 characters
  if (value.length < 2 || value.length > 40) {
    addInputError(input, "Full name must have between 2 and 40 characters!");
    
   // Checks if input value matches regular expression 
  } else if (!value.match(regex)) {
    addInputError(input, "Full name accepts letters only!");
    
  } else {
    result = true;
  }
  
  return result;
}

/* Checks email and present errors if fail */
function checkEmail(input, value) {
  var result = false;
  
  // Regular expression(xx@xx.com or xx@xx.com.au)
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  // Checks if input value matches regular expression
  if (!value.match(regex)) {
    addInputError(input, "Please, type a valid email!");
    
  } else {
    result = true;
  }
  return result;
}

function request(url, type, dataType, errorId, callBack) {
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
    error: function (xhr, status, error) {
      generateError(errorId, xhr.status + " - " +  error);
      
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
    }
  });
}

/* Logs off and clear all values 
 * and return to #login page*/
function logOff() {
  clearForms();
  clearTables();
  $( ":mobile-pagecontainer" ).pagecontainer( "change", "index.html", { 
    role: "page",
    transition: "flip",
    reverse: true
  });
}

// Remove all elements from especific forms
function clearForms() {
  // Reset all form's values
  $("form").trigger("reset");
  
  /* Remove all elements from form 
   * with class question
   * in QUESTIONS PAGE */
  $(".question").empty();
  
  /* Remove all elements from form 
   * with id qpp (questions per page)
   * in QUESTIONS PER PAGE */
  $("#qpp").empty();
  
  // Disable both next and previows buttons
  disableElement("#nextBtn");
  disableElement("#prevBtn");
}

// Remove all elements from especific tables
function clearTables() {
  /* Remove all elements from id answer-list
   * in ANSWERS LIST PAGE */
  $("#answer-list").empty();
  
  /* Remove all elements from id result-list
   * in RESULT PAGE */
  $("#result-list").empty();
}

/* Loads the page which passes through
 * the parameter apge and creates its
 * JQuery Mobile UI*/
function loadPage(page) {
  $(":mobile-pagecontainer").pagecontainer("change", page);
  $(".ui-content").trigger("create");
}

/* Loads and generates a list of
 * all quizzes available from json file*/
function loadQuiz(quizzes) {
  var list = "";
  
  quizList = quizzes;
  
  /* Loops through the quiz object and
   * convert it into HTML list tags */
  for (var i in quizzes) {
    list += "<li>\n\
      <a href=\"#\" data-prefetch=\"true\" id="+ quizzes[i].id +" class=\"quiz-item\" data-transition=\"slide\">" + quizzes[i].title + "</a>\n\
      </li>";
  }

  // Inserts the list into #q-list 
  $("#q-list").html(list);

  // Refreshes the quiz list to apply all jquery mobile UI
  $( "#q-list" ).listview( "refresh" );

  /* Event listener to catch the clicked 
   * quiz item in the quiz list
   * then keeps id in let id constants*/
  $(".quiz-item").click(function(){    
    selectObject(null, $(this).attr("id"), quizzes);
  }); 
}

/* Compares the selected quiz with
 * all the available in the json
 * file, then generates the quiz page*/
function selectObject(answers, quizId, quizzes) {
  for (var i in quizzes) {
    if (quizzes[i].id === quizId) {
      generateQuizPage(answers, quizzes[i]);
      break;
    }
  }
}

/* Generates parts of a quiz page*/
function generateQuizPage(answers, selectedQuiz) {
  // quiz holds all questions from the selected quiz 
  quiz = selectedQuiz;
  
  // Generates head title from the selected quiz
  $(".title").text(quiz.title);
  
  // Gets all questions from the selected quiz
  getQuestions(answers);
}

/* Gets all questions from selected quiz and 
 * finds out if quiz has option of question 
 * per page */
function getQuestions(answers) {
  
  // Generates a list of all question in the DOM
  generateQuestionList(answers);
  
  // Finds out if selected quiz has questionsPerPage option
  if (quiz.hasOwnProperty('questionsPerPage')) {
    
    // Generates questions per page option
    generateQuestionsPerPage();
    
    // Loads #questionPerPage page
    $( ":mobile-pagecontainer" ).pagecontainer( "change", "index.html#questionPerPage", {
      role: "page",
      transition: "slide"
    });
    $(".ui-content").trigger("create");
    
  } else {
    questions = 1;
    // Shows first question in #question page
    getFirstQuestion(questions);
  }
}

/* Convert all questions from object variable
 * into DOM objects and append them into the
 * .question page */
function generateQuestionList(answers) {
  
  if (answers !== null && answers["quiz-id"] === quiz.id) {
    // creates a DOM element for each question
    quiz.questions.forEach(function(q) {
      $(".question").append(buildQuestions(q, answers.answers[q.id]));
    });
  } else {
    // creates a DOM element for each question
    quiz.questions.forEach(function(q) {
      $(".question").append(buildQuestions(q, ""));
    });
  }
  

  $(".question div").first().addClass("first");
  $(".question div").last().addClass("last");
  
  // Hide all question from user
  $(".question").children().hide();
}

/* BuildQuestions function generate question
 * generate DOM elements to be added on when 
 * user selects a quiz, it will check every 
 * question type and select the right one. */
function buildQuestions(question, answer) {
  var q = "";
  var id = "q" + question.id;
  
  switch (question.type) {
    case "date" :
      q += "<div class=\"ui-field-contain\" id="+id+"><label for="+question.id+">"+question.text+"</label>";
      q += "<input type="+question.type+" name="+question.id+" id="+question.id+" value="+answer+" placeholder="+question.help+"></div>";
      break;
    case "textbox" :
      if (question.help === undefined) question.help = "";
      q += "<div class=\"ui-field-contain\" id="+id+"><label for="+question.id+">"+question.text+"</label>";
      if (answer !== "") {
        q += "<input type=\"text\" name="+question.id+" id="+question.id+" value="+answer+"></div>";
      } else {
        q += "<input type=\"text\" name="+question.id+" id="+question.id+" placeholder="+question.help+"></div>";
      }
      
      if (question.hasOwnProperty("validate")) {
        //TODO validade input
      }
      break;
    case "textarea" :
      q += "<div class=\"ui-field-contain\" id="+id+"><label for="+question.id+">"+question.text+"</label>";
      if (answer !== "") {
        q += "<textarea cols=\"40\" rows=\"5\" name="+question.id+" id="+question.id+">"+answer+"</textarea></div>";
      } else {
        q += "<textarea cols=\"40\" rows=\"5\" name="+question.id+" id="+question.id+">"+question.help+"</textarea></div>";
      }
      break;
    case "choice" :
      q += "<div class=\"ui-field-contain\" id="+id+"><label class=\"select\" for="+question.id+">"+question.text+"</label>";
      q += "<select name="+question.id+" id="+question.id+" data-inline=\"true\">";
      question.options.forEach(function(a) {
        if (answer === a) {
          q += "<option value="+a+" selected>"+a+"</option>";
        } else {
          q += "<option value="+a+">"+a+"</option>";
        } 
      });
      q += "</select></div>";    
      break;
      case "slidingoption" :
        q += "<div class=\"ui-field-contain\" id="+id+"><legend>"+question.text+"</legend>";
        for (var a = 0; a < question.options.length; a++) {
          if (answer === question.options[a] || a + 1 === question.options.length) {
            q += "<input type=\"radio\" name="+question.id+" id="+question.options[a]+" value="+question.options[a]+" checked>";
          } else {
            q += "<input type=\"radio\" name="+question.id+" id="+question.options[a]+" value="+question.options[a]+">";
          }
          q += "<label for="+question.options[a]+">"+question.options[a]+"</label>";
        }
        
        for (var a = 0; a < question.options.length; a++) {
          if (answer === question.optionVisuals[a] || a + 1 === question.optionVisuals.length) {
            q += "<input type=\"radio\" name="+question.id+" id="+question.optionVisuals[a]+" value="+question.optionVisuals[a]+" checked>";
          } else {
            q += "<input type=\"radio\" name="+question.id+" id="+question.optionVisuals[a]+" value="+question.optionVisuals[a]+">";
          }
          q += "<label for="+question.optionVisuals[a]+">"+question.optionVisuals[a]+"</label>";
        }

        q += "</div>";
        break;
    case "scale" :
      q += "<div class=\"ui-field-contain\" id="+id+"><label for="+question.id+">"+question.text+"</label>";
      if (answer === "") answer = question.start;
      if (question.hasOwnProperty("gradientStart")) {
        q += "<input type=\"range\" onchange=\"changeBackgroundColor("+question.id+")\" name="+question.id+" id="+question.id+" value="+answer+" min="+question.start+" max="+question.end+" step="+question.increment+" data-highlight=\"true\"></div>";
      } else {
        q += "<input type=\"range\" name="+question.id+" id="+question.id+" value="+answer+" min="+question.start+" max="+question.end+" step="+question.increment+" data-highlight=\"true\"></div>";
      }
      break;
    case "multiplechoice" :
      q += "<div class=\"ui-field-contain\" id="+id+"><legend>"+question.text+"</legend>";
       question.options.forEach(function(a) {
         if (answer.indexOf(a) > -1) {
           q += "<input type=\"checkbox\" name="+question.id+" id="+a+" value="+a+" checked>";
         } else {
           q += "<input type=\"checkbox\" name="+question.id+" id="+a+" value="+a+">";
         } 
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
  $( ":mobile-pagecontainer" ).pagecontainer( "change", "index.html#question", {
    role: "page",
    transition: "slide"
  });
  $(".ui-content").trigger("create");
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
function presentQuestion(bool) { 
  
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
    $(".question").append("<input type=\"button\" onclick=\"buildAnswerObj()\" id=\"submit\" data-theme=\"b\" value=\"Submit Quiz\">");
    //TODO fix it
    loadPage("#question");
  } else {
    enableElement("#prevBtn");
  }
  presentQuestion(true);
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
  presentQuestion(false);
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

// Checks answers from quizzes that have answers
function checkAnswers() {
  
  score = 0;
  
  // Holds all ids with right answer
  var rightAnswers = [];
  
  // Gets all answers storaged in local storage
  let userAnswers = JSON.parse(localStorage.getItem("answers"));
  
  // Gets all questions from selected quiz
  let apiAnswer = quiz.questions;
  
  // Loops through each answer from user
  apiAnswer.forEach(function(q) {
    
    // Checks if apiAnswer question has "answer" property
    if (q.hasOwnProperty("answer")) {
      
      // Checks type of answer is an object
      if (typeof q.answer !== "object") {
        
        // Checks if answer from user matches api
        if (q.answer.toString().toUpperCase() === userAnswers[q.id].toString().toUpperCase()) {
          score += q.weighting;
          rightAnswers.push(q.id);
        }
        // If not an object
      } else {
        // Checks if api question is multiplechoice
        if (q.type === "multiplechoice") {
          
          // Checks length from both api and user and sort them
          if (q.answer.length === userAnswers[q.id].length) {
            q.answer.sort();
            userAnswers[q.id].sort();
            
            // Loops through each answer in api multiplechoice array
            for (var i = 0; i < q.answer.length; i++) {
              
              // If all indexes from the multiplechoice array passed, it gives score and push answer id into rightAnswers array
              if ((q.answer[i].toString().toUpperCase() === userAnswers[q.id][i].toString().toUpperCase()) 
              && (i + 1 === q.answer.length)) {
                score += q.weighting;
                rightAnswers.push(q.id);
                
                // If answers from both indexes arrays match, it continues
              } else if (q.answer[i] === userAnswers[q.id][i]) {
                continue;
                
                // Any mismatch it breaks out of the loop  
              } else {
                break;
              }
            }
          }
          // If not multiplechoice, but still an object(array of answers)
        } else {
          // Loops through the array in api question
          for (var i in q.answer) {
            
            // If answers from both indexes arrays match, it scores user, break out of loop and pushes id into rightAnswers array
            if (q.answer[i].toString().toUpperCase() === userAnswers[q.id][0].toString().toUpperCase()) {
              score += q.weighting;
              rightAnswers.push(q.id);
              break;
            }
          }
        }
      }
    }
  });
  
  // Generates result
  generateResult(rightAnswers, userAnswers);
}

// Converts user answers into an object
function buildAnswerObj() {
 
  // Serializes all inputs from question class form
  var data = $(".question").serializeArray();
  
  // Holds all questions from selected quiz
  var apiAnswer = quiz.questions;
  
  // Object will hold user answers
  var obj = {};
  
  // Checks if user answer length is equal or bigger than quiz one
  if (data.length >= quiz.questions.length) {
    
    // Loops through each answer from user
    for (var i = 0; i < data.length; i++) {
      
      //  Checks if current question is an object
      if (typeof quiz.questions[data[i].name - 1].answer === "object") {

        // Checks if obj has alread an id alocated into it.
        // If yes, it pushes the value into the array inside obj,
        // If not, it creates an array with the value inside obj.
        if (obj.hasOwnProperty(data[i].name)) {
          obj[data[i].name].push(data[i].value);
        } else {
          obj[data[i].name] = [data[i].value];
        }
        
        // Set the name with correspondent value
      } else {
        obj[data[i].name] = data[i].value;
      }
    }
    // If data length is smaller than quiz questions length
  } else {
    // Loops through all api questions
    for (var i = 0; i < quiz.questions.length; i++) {
      
      // Checks if current api question is an object and current user one is undefined.
      // If true for both, it sets up the object property with empty array,
      // else if it sets up the object property with an value in array,
      // finally else, it sets up just the value without any array.
      if (typeof quiz.questions[i].answer === "object" && data[i] === undefined) {
        obj[quiz.questions[i].id] = [""];
      } else if (typeof quiz.questions[i].answer === "object") {
        obj[data[i].name] = [data[i].value];
      } else {
        obj[data[i].name] = data[i].value;
      }
    }
  }
  
  for (var i = 0; i < apiAnswer.length; i++) {
    if (apiAnswer[i].hasOwnProperty("validate")) {
      if(!checkValidation(obj[apiAnswer[i].id], apiAnswer[i].validate, 
      "Please, type a valid data in question: " + apiAnswer[i].id))
        break;
    }
    if (i + 1 === apiAnswer.length) {
      storageData("answers", obj);
      generateTable();
      presentAnswers();
    }
  }
}

function checkValidation(value, validation, message) {
  
  let regex = new RegExp(validation.replace(/["|/]/g, ""));
  var result = false;
  
  if (!value.match(regex)) {
    generateError("#answer_error", message);
  } else {
    var result = true;
  }
  
  return result;
}

// Storage objects into local storage
function storageData(name, data) {
  
  localStorage.setItem(name, JSON.stringify(data));
  
}

// Changes the page to answers page
function presentAnswers() {
  
  $( ":mobile-pagecontainer" ).pagecontainer( "change", "index.html#answers", { 
    role: "page",
    transition: "flip"
  });
  $(".ui-content").trigger("create");
}

// Generates the table result with all user answers
function generateTable() {
  // Retrieve all user answers saved in local storage
  let answers = JSON.parse(localStorage.getItem("answers"));
  
  // Holds table DOM elements
  var table = "";
  
  // Set up button to save result
  $("#save-check").html("<input type=\"button\" onclick=\"saveResult()\"  data-theme=\"b\" value=\"Save Answers\">");
  
  // For each answer in answers it builds the table
  for (var i in answers) {
    table += "<tr>";
    table += "<th class=\"title\">" + i + "</th>";
    table += "<td>"+quiz.questions[i-1].text+"</td>";
    table += "<td>" + answers[i] + "</td></tr>";
  }
  
  // Checks if quiz has answers to match with user's ones
  for (var q = 0; q < quiz.questions.length; q++) {
    // If yes, it change the initial button from save result to check answers
    if (quiz.questions[q].hasOwnProperty("answer")) {
      
      $("#save-check").html("<input type=\"button\" onclick=\"checkAnswers()\"  data-theme=\"b\" value=\"Check Answers\">");
      break;
    }
  }
  
  // Sets the table into the page and refreshes it to update jquery mobile UI
  $("#answer-list").append(table);
  $(".answer-list").table("refresh"); 
}

// Generates error marks if any in quizzes that have answers to match with user's one
function generateResult(rightAnswers, userAnswers) {
  // Clear any previous result in result-list id
  $("#result-list").empty();
  
  // Holds right and wrong icons
  let right = "<td><p class=\"right ui-btn ui-icon-check ui-shadow ui-corner-all ui-btn-inline ui-btn-icon-notext\"></p></td>";
  let wrong = "<td><p class=\"wrong ui-btn ui-icon-delete ui-shadow ui-corner-all ui-btn-inline ui-btn-icon-notext\"></p></td>";
  
  // Holds table DOM elements
  var table = "";
  
  // For each answer in answers it builds the table
  quiz.questions.forEach(function(q){
    // Block of code build a table row 
    table += "<tr>";
    table += "<th class=\"title\">" + q.id + "</th>";
    table += "<td>" + q.text + "</td>";
    table += "<td>" + userAnswers[q.id] + "</td>";
    
    // If question has answer property it checks if matches the user's one
    // and set the icon into table with score
    if (q.hasOwnProperty("answer")) {
      for (var a = 0; a < rightAnswers.length; a++) {
        if (rightAnswers[a] === q.id) {
          table += right;
          table += "<td>+ " + q.weighting + "</td>";
          break;
        } else if (a + 1 === rightAnswers.length) {
          table += wrong;
          table += "<td>0</td>";
        }
      }
    }
    
    // Closes the table row every loop
    table += "</tr>";
  });
  
  // Sets the table into the page and refreshes it to update jquery mobile UI
  $("#result-list").append(table);
  $("#total-score").text(score);
  $(".answer-list").table("refresh");
  presentResult();
}

// Changes the page to result page
function presentResult() {
  
  $( ":mobile-pagecontainer" ).pagecontainer( "change", "index.html#result", { 
    role: "page",
    transition: "flip"
  });
  $(".ui-content").trigger("create");
}

// Saves user answers to be loaded as last quiz result
function saveResult() {
  // Associates the result with username
  let user = "result-" + username;
  
  // Retrieves the user answers from local storage
  let userAnswers = JSON.parse(localStorage.getItem("answers"));
  
  // Gets the quiz id to be used when buildResultObj as a parameter
  let quizId = quiz.id;
  
  // Builds result object and turn it into a string
  let result = JSON.stringify(buildResultObj(quizId, userAnswers));
  
  // Request is made to sabe the result and returns to list of quizzes page
  request("http://introtoapps.com/datastore.php?action=save&appid=215242834&objectid="+user+"&data="+result, "POST", "", "#result_error", returnToQuizzes);

}

// Builds an object with all answers to be saved in saveResult()
function buildResultObj(quizId, answers) {
  var result = {  
    "quiz-id": quizId,
    "answers": answers   
  };

  return result;
}

// Clear all forms, tables and return to list of quizzes
function returnToQuizzes() {
  clearForms();
  clearTables();
  $( ":mobile-pagecontainer" ).pagecontainer( "change", "#quiz-list", { 
    role: "page",
    transition: "flip",
    reverse: true
  });
}

// Loads last quiz answered by the user if exist
function loadLastResult() {
  
  request("http://introtoapps.com/datastore.php?action=load&appid=215242834&objectid=result-" + username, "GET", "json", "#quiz-list_error", function(data) {
    
    selectObject(data, data["quiz-id"], quizList);
    
  });
}