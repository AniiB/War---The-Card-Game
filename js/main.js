//get deck
//store deck id locally
let newDeckBtn = document.querySelector('.btnDeck')
let resetDeck = document.querySelector(`.btnReset`)
let drawCardBtn = document.querySelector(`.drawCards`)
newDeckBtn.addEventListener('click', fetchDeck)
let winner


function fetchDeck() {
    fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
    .then(res => res.json())
    .then(data =>createDecks(data))
    .catch(err => console.log(err))
}

function createDecks(data) {
    let deckOne =[], deckTwo = [];
    let deckId = data.deck_id
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`)
    .then(res => res.json())
    .then(data => populateDecks(data))

    resetDeck.addEventListener('click', () => {
        winner = undefined
        let imgList = document.querySelectorAll('img')
        Array.from(imgList).forEach(e => e.src = '')
        document.querySelector('.result').innerText = ''
        fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`)

        fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`)
        .then(res => res.json())
        .then(data => populateDecks(data))
    })

    function populateDecks(data) {
        
        for(let i = 0; i<data.cards.length; i++) {
            if(i%2 === 0) deckOne.push(data.cards[i])
            else deckTwo.push(data.cards[i])
        }
        letsPlay(deckOne, deckTwo)
    }
}


function letsPlay(deckOne, deckTwo) {
    if(winner == undefined) {

    let discardOneDeck = []
    let discardTwoDeck = []
    let warStakes = []
    let cardOne, cardTwo,valOne,valTwo
    const result = document.querySelector('.result')

    drawCardBtn.addEventListener('click', drawCards)
    
    function drawCards() {
        if(deckOne.length > 0 && deckTwo.length > 0) {

            cardOne = deckOne.pop()
            warStakes.push(cardOne)
            document.querySelector(`.cardOne`).src = cardOne.image
    
            cardTwo = deckTwo.pop()
            warStakes.push(cardTwo)
            document.querySelector(`.cardTwo`).src = cardTwo.image
    
            valOne = getCardVal(cardOne)
            valTwo = getCardVal(cardTwo)
    
            checkWin(valOne,valTwo)
        } else combineDeck()

    }

    function checkWin(valOne,valTwo) {
        if(valOne > valTwo) {
            discardOneDeck = discardOneDeck.concat(warStakes)
            warStakes =[]
            result.innerText = `Player 1 wins this round! Draw Again!`
        } else if( valTwo > valOne) {
            discardTwoDeck = discardTwoDeck.concat(warStakes)
            warStakes = []
            result.innerText = `Player 2 wins this round! Draw Again!`
        } else if(valOne === valTwo) {
            result.innerText = `It's WAR!`
            initiateWar()
        }
    }

    function initiateWar() {
        let totalCardsOne = deckOne.length + discardOneDeck.length
        let totalCardsTwo = deckTwo.length + discardTwoDeck.length

        if(totalCardsOne > 3 && totalCardsTwo > 3) {
            for(let i = 0; i < 3; i++) {
                warStakes.push(deckOne.pop())
                warStakes.push(deckTwo.pop())
            }
            drawCards()
        } else gameOver(totalCardsOne,totalCardsTwo)
        
    }

    function combineDeck() {
        deckOne = shuffleDeck(deckOne.concat(discardOneDeck))
        deckTwo = shuffleDeck(deckTwo.concat(discardTwoDeck))
        discardOneDeck = []
        discardTwoDeck = []
        if(deckOne.length === 0 || deckTwo.length === 0) {
            gameOver(deckOne.length, deckTwo.length)
        }
    }
}
}

function gameOver(l1,l2) {
    
    l1 > l2 ? winner = `1` : winner = '2'
    fetchDeck()
    document.querySelector('.result').innerText = `Player ${winner} has won the game. Please Reset or fetch a new Deck.`
}

function shuffleDeck(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a
}

function getCardVal(card){
    console.log(card)
    switch(card.value) {
        case 'ACE' : return 14
        break;
        case 'KING' : return 13
        break;
        case 'QUEEN' : return 12
        break;
        case 'JACK' : return 11
        break;
        default: return Number(card.value)
        break;
    }
}