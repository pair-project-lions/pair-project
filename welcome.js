$('#start-game-button').on('click', function() {
    window.location.href = 'index.html'
});
$(document).ready(function() {
    var audio = $('#background-music')[0]
    audio.play();
});
var music= document.getElementById("ad"); 

function playAudio() { 
  music.play(); 
} 

playAudio()