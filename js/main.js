document.querySelector('.btnDeck').addEventListener('click', fetchDeck)

function fetchDeck() {
    fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
    .then(res => res.json())
    .then(data =>{
        let deckId = data.deck_id
        resetDOM()
        createTwoDecks(deckId)
        document.querySelector(`.btnReset`).addEventListener('click' , () => {
            resetDOM()
            fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/return/`)
        })
    })
    .catch(err => console.log(err))
}
function resetDOM() {
    document.querySelector(`.result`).innerText = ''
    let spanList = document.querySelectorAll('span')
    let imgList = document.querySelectorAll('img')
    let btnList = document.querySelectorAll('button')
    Array.from(imgList).forEach(e => e.src ='')
    Array.from(spanList).forEach(e => e.innerText = '')
    Array.from(btnList).forEach(e => e.removeAttribute('disabled'))
}
function createTwoDecks(deckId) {
    let deckOne =[], deckTwo =[]
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        for(let i = 0; i<data.cards.length; i=i+2) {
            deckOne.push(data.cards[i])
            deckTwo.push(data.cards[i+1])
    }
    
    playGame(deckOne,deckTwo)
})
}
function playGame(deckOne,deckTwo) {
    let result = document.querySelector('.result')
    let cardOne, cardTwo, valOne, valTwo, totalCardOne, totalCardTwo, stakes = [], tempOneDeck =[], tempTwoDeck =[];

    document.querySelector(`.drawCards`).addEventListener('click', () => {
        totalCardOne = deckOne.length + tempOneDeck.length
        totalCardTwo = deckTwo.length + tempTwoDeck.length
        
        if(deckOne.length === 0 || deckTwo.length === 0) mergeDecks()

        cardOne = deckOne.pop()
        cardTwo = deckTwo.pop()
        stakes.push(cardOne,cardTwo)

        displayDOM()
        checkWin()
    })
    function checkWin() {

        valOne = checkVal(cardOne)
        valTwo = checkVal(cardTwo)

        totalCardOne = deckOne.length + tempOneDeck
        totalCardTwo = deckTwo.length + tempTwoDeck.length
    
        if(valOne > valTwo) {
            tempOneDeck =tempOneDeck.concat(stakes)
            stakes=[]
            result.innerText = `Player One wins this round!`
        }
        else if(valOne < valTwo) {
            tempTwoDeck = tempTwoDeck.concat(stakes)
            stakes =[]
            result.innerText = `Player Two wins this round!`
        }
        else {
            if(totalCardOne < 4 || totalCardTwo < 4) {
                totalCardOne = deckOne.length + tempOneDeck
                totalCardTwo = deckTwo.length + tempTwoDeck.length

                gameOver(totalCardOne,totalCardTwo)

            } else war()
        }
    }
    function displayDOM() {
        document.querySelector(`.deckValOne`).innerText = deckOne.length
        document.querySelector(`.deckValTwo`).innerText = deckTwo.length

        document.querySelector(`.deckOne`).src = cardOne.image
        document.querySelector(`.deckTwo`).src = cardTwo.image

        document.querySelector(`.discardValOne`).innerText = tempOneDeck.length
        document.querySelector(`.discardValTwo`).innerText = tempTwoDeck.length  
        
        document.querySelector('.warStakes').innerText = stakes.length
    }
    function war() {
        for(let i = 0; i<3; i++){
            stakes.push(deckOne.pop(), deckTwo.pop())
        }
        displayDOM()
        result.innerText = `It's WAR! 3 cards more at stake from each player`
    }
    function mergeDecks() {
        deckOne = shuffleDeck(deckOne.concat(tempOneDeck))
        tempOneDeck = []

        deckTwo = shuffleDeck(deckTwo.concat(tempTwoDeck))
        tempTwoDeck = []
        
        if(deckOne.length === 0 || deckTwo.length === 0) gameOver(deckOne.length, deckTwo.length)
    }
}
function shuffleDeck(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
function gameOver(score1,score2) {
    let winner
    score1 > score2 ? winner = 1 : winner = 2
    document.querySelector(`.drawCards`).setAttribute('disabled', true)
    document.querySelector('.result').innerText = `Player ${winner} has Won the game! Wohoo!` 
}
function checkVal(card) {
    switch(card.value) {
        case 'KING': return 13
        break;
        case 'QUEEN': return 12
        break;
        case 'JACK': return 11
        break;
        case 'ACE': return 14
        break;
        default: return Number(card.value)
        break;
    }
}