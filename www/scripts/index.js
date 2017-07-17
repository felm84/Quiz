/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function loadJsonFile(file, callBack) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);
            callBack(json);
        }
    };
    xmlhttp.open("GET", file, true);
    xmlhttp.send();
}

loadJsonFile("./json/quizzes_sample.json", loadQuizzList);

//loadJsonFile("./json/sample.json", loadQuizzList);

function loadQuizzList(json) {
    for (var i = 0; i < json.length; i++)
        console.log(json[i].title);
}