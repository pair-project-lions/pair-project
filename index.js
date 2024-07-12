function Card(value, suit, image) {
this.value = value
this.suit = suit
this.image = image

this.createElement = function() {
var img = document.createElement('img')
img.src = this.image
img.alt = this.value + ' of ' + this.suit
img.dataset.value = this.value
img.dataset.suit = this.suit
return img
}
}

function ChkobbaGame() {
this.deck = []
this.playerHand = []
this.computerHand = []
this.centerCards = []
this.playerScore = 0
this.computerScore = 0
this.selectedCard = null
this.selectedCenterCards = []
this.isPlayerTurn = true
this.lastCapturePlayer = null  
this.initializeDeck = function() {
var suits = ['9loub', 'trefle', 'dineri', 'pique']
var values = [1, 2, 3, 4, 5, 6, 7, 10]

for (var i = 0; i < suits.length; i++) {
for (var j = 0; j < values.length; j++) {
var image = 'images/cards/' + values[j] + '_of_' + suits[i] + '.png'
this.deck.push(new Card(values[j], suits[i], image))
}
}

this.shuffleDeck()
}
this.shuffleDeck = function() {
for (var i = this.deck.length - 1; i > 0; i--) {
var j = Math.floor(Math.random() * (i + 1))
var temp = this.deck[i]
this.deck[i] = this.deck[j]
this.deck[j] = temp
}
}
this.dealInitialCards = function() {
this.playerHand = this.deck.slice(0, 3)
this.computerHand = this.deck.slice(3, 6)
this.centerCards = this.deck.slice(6, 10)
this.deck = this.deck.slice(10) 

this.displayCards('#player-hand', this.playerHand, true)
this.displayCards('#computer-hand', this.computerHand, false)
this.displayCards('#center-cards', this.centerCards, true)
this.calculateScore()
this.displayScore()
}
this.dealNextCards = function() {
this.playerHand = this.deck.slice(0, 3)
this.computerHand = this.deck.slice(3, 6)
this.deck = this.deck.slice(6) 

this.displayCards('#player-hand', this.playerHand, true)
this.displayCards('#computer-hand', this.computerHand, false)
this.displayCards('#center-cards', this.centerCards, true)
}

this.displayCards = function(selector, cards, clickable) {
var container = document.querySelector(selector)
container.innerHTML = ''
for (var i = 0; i < cards.length; i++) {
var cardElement = cards[i].createElement();
if (clickable) {
cardElement.addEventListener('click', this.onCardClick.bind(this, cards[i], selector));
}
container.appendChild(cardElement)
}
}


this.onCardClick = function(card, selector) {
if (this.isPlayerTurn && selector === '#player-hand') {
this.selectedCard = card
this.isPlayerTurn = false
this.checkAndCaptureCards()
if (!this.isPlayerTurn) {
setTimeout(this.playComputerTurn.bind(this), 1000)
}
} else if (selector === '#center-cards') {
var index = this.selectedCenterCards.indexOf(card)
if (index > -1) {
this.selectedCenterCards.splice(index, 1)
} else {
this.selectedCenterCards.push(card)
}
}
}

this.checkAndCaptureCards = function() {
if (this.selectedCard && this.selectedCenterCards.length > 0) {
var totalValue = this.selectedCenterCards.reduce(function(sum, card) {
return sum + card.value
}, 0)

if (totalValue === this.selectedCard.value) {
this.captureCards('player')
} else {
this.centerCards.push(this.selectedCard)
this.playerHand.splice(this.playerHand.indexOf(this.selectedCard), 1)
this.selectedCard = null
this.selectedCenterCards = []
this.displayCards('#center-cards', this.centerCards, true)
this.displayCards('#player-hand', this.playerHand, true)
this.switchTurn('player')
}
} else if (this.selectedCard && this.selectedCenterCards.length === 0) {
this.centerCards.push(this.selectedCard)
this.playerHand.splice(this.playerHand.indexOf(this.selectedCard), 1)
this.selectedCard = null
this.displayCards('#center-cards', this.centerCards, true)
this.displayCards('#player-hand', this.playerHand, true)
this.switchTurn('player')
}
}


this.captureCards = function(player) {
this.centerCards = this.centerCards.filter(function(card) {
return this.selectedCenterCards.indexOf(card) === -1
}.bind(this))

var cardIndex = this.playerHand.indexOf(this.selectedCard)
if (cardIndex > -1) {
this.playerHand.splice(cardIndex, 1)
}

this.selectedCard = null
this.selectedCenterCards = []
this.displayCards('#player-hand', this.playerHand, true)
this.displayCards('#center-cards', this.centerCards, true)
this.calculateScore()
this.displayScore()
this.lastCapturePlayer = player
this.switchTurn(player)
}


this.endRound = function() {

while (this.deck.length > 0) {

if (this.playerHand.length < 3) {
this.playerHand.push(this.deck.pop())
}


if (this.computerHand.length < 3) {
this.computerHand.push(this.deck.pop())
}
}


this.displayCards('#player-hand', this.playerHand, true)
this.displayCards('#computer-hand', this.computerHand, false)
this.displayCards('#center-cards', this.centerCards, true)
}

this.playComputerTurn = function() {
if (this.isPlayerTurn) {
return; 
}

var captured = false;
console.log("Tour de l'ordinateur");


for (var i = 0; i < this.computerHand.length; i++) {
for (var j = 0; j < this.centerCards.length; j++) {
if (this.computerHand[i].value === this.centerCards[j].value) {
this.selectedCard = this.computerHand[i];
this.selectedCenterCards.push(this.centerCards[j]);
console.log("L'ordinateur capture avec une carte de même valeur :", this.selectedCard);
this.captureCards();
this.computerHand.splice(i, 1);
captured = true;
break;
}
}
if (captured) break;
}


if (!captured) {
for (var i = 0; i < this.computerHand.length; i++) {
var targetValue = this.computerHand[i].value;
var combinations = this.findCombinations(this.centerCards, targetValue);

if (combinations.length > 0) {
this.selectedCard = this.computerHand[i];
this.selectedCenterCards = combinations[0]; 
console.log("L'ordinateur capture avec une combinaison de cartes de somme égale :", this.selectedCard, this.selectedCenterCards);
this.captureCards();
this.computerHand.splice(i, 1);
captured = true;
break;
}
}
}


if (!captured) {
var randomIndex = Math.floor(Math.random() * this.computerHand.length);
var randomCard = this.computerHand[randomIndex];

if (randomCard) {
this.centerCards.push(randomCard);
console.log("L'ordinateur joue une carte aléatoire :", randomCard);
this.computerHand.splice(randomIndex, 1);
} else {
console.log("Aucune carte à jouer pour l'ordinateur.");
}
}

   
this.selectedCard = null;
this.selectedCenterCards = [];
this.displayCards('#computer-hand', this.computerHand, false);
this.displayCards('#center-cards', this.centerCards, true);


if (this.playerHand.length === 0 && this.computerHand.length === 0) {
if (this.deck.length > 0) {
this.dealCards();
} else {
this.endGame();
return;
}
}

console.log("Tour du joueur");
this.isPlayerTurn = true; 
};


this.findCombinations = function(cards, targetValue) {
var results = [];

function findSubset(subset, startIndex, sum) {
if (sum === targetValue) {
results.push(subset.slice());
return;
}
if (sum > targetValue || startIndex >= cards.length) {
return;
}
for (var i = startIndex; i < cards.length; i++) {
subset.push(cards[i]);
findSubset(subset, i + 1, sum + cards[i].value);
subset.pop();
}
}

findSubset([], 0, 0);
return results;
};


this.dealCards = function() {
for (var i = 0; i < 3; i++) {
if (this.deck.length > 0) {
this.playerHand.push(this.deck.pop());
}
if (this.deck.length > 0) {
this.computerHand.push(this.deck.pop());
}
}
this.displayCards('#player-hand', this.playerHand, true);
this.displayCards('#computer-hand', this.computerHand, false);
console.log("Nouvelles cartes distribuées aux joueurs");
};


  
this.findCardCombinations = function(cards, targetValue) {
var result = [];
var combinations = [];

function findCombinations(start, currentCombination, currentSum) {
if (currentSum === targetValue) {
result.push([...currentCombination]);
return;
}

for (var i = start; i < cards.length; i++) {
if (currentSum + cards[i].value <= targetValue) {
currentCombination.push(cards[i]);
findCombinations(i + 1, currentCombination, currentSum + cards[i].value);
currentCombination.pop();
}
}
}

findCombinations(0, [], 0);
return result;
};

this.calculateScore = function() {
var playerdineriCount = 0;
var computerdineriCount = 0;
var sbou3p = 0;
var sdoussp = 0;
var sbou3c = 0;
var sdoussc = 0;
 var chkoba = new Audio('/audio/Voix 001.mp3');

if(this.isPlayerTurn===true&&this.centerCards.length===0){
this.computerScore++
chkoba.play()
console.log(this.computerScore,"chkoba")
 }
 else if(this.isPlayerTurn===false&&this.centerCards.length===0){
this.playerScore++
chkoba.play()
console.log(this.playerScore,"chkoba")
 }
for (var i = 0; i < this.playerHand.length; i++) {
if (this.playerHand[i].suit === 'dineri') {
playerdineriCount++;
}
}

for (var i = 0; i < this.computerHand.length; i++) {
if (this.computerHand[i].suit === 'dineri') {
computerdineriCount++;
}
}

if (playerdineriCount > 5) {
this.playerScore++;
}
if (computerdineriCount > 5) {
this.computerScore++;
}

for (var i = 0; i < this.playerHand.length; i++) {
if (this.playerHand[i].value === 7) {
sbou3p++;
} else if (this.playerHand[i].value === 6) {
sdoussp++;
}
}

for (var i = 0; i < this.computerHand.length; i++) {
if (this.computerHand[i].value === 7) {
sbou3c++;
} else if (this.computerHand[i].value === 6) {
sdoussc++;
}
}

if (sbou3p >= 3 || (sbou3p === 2 && sdoussp === 3)) {
this.playerScore++;
}
if (sbou3c >= 3 || (sbou3c === 2 && sdoussc === 3)) {
this.computerScore++;
}

if (this.playerHand.filter(function(card) { return card.value === 7; }).length >= 3 || 
(this.playerHand.filter(function(card) { return card.value === 7; }).length >= 2 && 
this.playerHand.filter(function(card) { return card.value === 6; }).length >= 3)) {
this.playerScore++;
}

if (this.computerHand.filter(function(card) { return card.value === 7; }).length >= 3 || 
(this.computerHand.filter(function(card) { return card.value === 7; }).length >= 2 && 
this.computerHand.filter(function(card) { return card.value === 6; }).length >= 3)) {
this.computerScore++;
}

if (this.playerScore >= 21) {
alert('Player wins the round!');
this.resetGame();
} else if (this.computerScore >= 21) {
alert('Computer wins the round!');
this.resetGame();
}
}

this.displayScore = function() {
document.getElementById('player-score').textContent = 'Joueur: ' + this.playerScore
document.getElementById('computer-score').textContent = 'Ordinateur: ' + this.computerScore
}

this.switchTurn = function(currentPlayer) {
if (currentPlayer === 'player') {
this.isPlayerTurn = false
setTimeout(this.playComputerTurn.bind(this), 1000)
} else {
this.isPlayerTurn = true
}

this.checkEndOfTurn()
}
this.checkEndOfTurn = function() {
if (this.playerHand.length === 0 && this.computerHand.length === 0) {
if (this.deck.length > 0) {
this.dealNextCards()
} else {
this.endGame()
}
}
}
this.endGame = function() {
if (this.centerCards.length > 0) {
if (this.lastCapturePlayer === 'player') {
this.playerScore += this.centerCards.length
} else {
this.computerScore += this.centerCards.length
}
}

this.calculateScore()
this.displayScore()
alert('Le jeu est terminé !')
}
this.startGame = function() {
this.initializeDeck()
this.dealInitialCards()
}
}
var game = new ChkobbaGame()
game.startGame()
