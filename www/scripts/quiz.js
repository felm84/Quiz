/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


loadJsonFile("./json/quizzes_sample.json", loadQuiz);

function logOff() {
  window.location.href = "index.html";
}

/* Loads and generates a list of
 * all quizzes available from json file*/
function loadQuiz(quiz) {
  /* Loops through the quiz object and
   * convert it into HTML list tags */
  for (var i in quiz) {
    $("#quiz_list").append("<li><a href=\"questions.html\" id="+ quiz[i].id +" class=\"quiz-item\" data-transition=\"slide\">" + quiz[i].title + "</a></li>");
  }
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

