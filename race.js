const horses = JSON.parse(sessionStorage.getItem('HORSES'))
const track = document.querySelector('main')
const deck = document.querySelector('#card-deck')
const discard = document.querySelector('#discard')
const cardChoices = Object.keys(horses)
const wagerDisplay = document.querySelector('#wager-pool')
const raceAgain = document.querySelector('#race-again')

///////////   Globals above //////////////

console.log(horses)
console.log(cardChoices)

const createHorse = () => {
  Object.keys(horses).forEach((horse, index) => {
    const newDivWager = document.createElement('div')
    track.appendChild(newDivWager)
    newDivWager.classList.add(`horse${index}`)
    newDivWager.classList.add('size')
    newDivWager.innerText =
      horses[`${horse}`].name + ': ' + horses[`${horse}`].wagerAmount
    const newDivHorse = document.createElement('div')
    track.appendChild(newDivHorse)
    newDivHorse.classList.add('post')
    newDivHorse.classList.add('size')
    newDivHorse.id = `horse${index}`
  })
  sessionStorage.clear()
}

const chooseRandomCard = () => {
  const random = Math.ceil(Math.random() * Object.keys(horses).length - 1)
  const card = cardChoices[random]
  return card
}

const poolWagers = () => {
  let allWagers = Object.keys(horses)
    .map((horse) => {
      return horses[`${horse}`].wagerAmount
    })
    .reduce((accumulator, value) => {
      return accumulator + value
    }, 0)
  // console.log(parseInt(allWagers, 10))

  wagerDisplay.innerText = `Up for Grabs: $${parseInt(allWagers, 10)}`
  return parseInt(allWagers, 10)
}

const payout = (winningHorse) => {
  let pool = poolWagers()
  let winnersWager = parseInt(horses[`${winningHorse}`].wagerAmount, 10)
  return pool - winnersWager
}

const checkWinner = (horse) => {
  if (horses[`${horse}`].flipCount === 8) {
    deck.removeEventListener('click', moveHorse)
    console.log(horses[`${horse}`].name + ' wins!')
    let winnerPayout = payout(horse)
    wagerDisplay.innerText =
      horses[`${horse}`].name.toUpperCase() +
      ` wins! Backers collect $${winnerPayout}!`
    raceAgain.style.display = 'initial'
  }
}

const moveHorse = () => {
  let randomHorse = chooseRandomCard()
  Object.keys(horses).forEach((horse, index) => {
    if (horse === randomHorse) {
      ++horses[`${randomHorse}`].flipCount
      let addClass = document.getElementById(`${randomHorse}`)
      addClass.classList.remove(
        'post',
        'spot' + (horses[`${randomHorse}`].flipCount - 1)
      )
      addClass.classList.add('spot' + horses[`${randomHorse}`].flipCount)
      discard.innerText = horses[`${randomHorse}`].name
      // console.log(horses[`${randomHorse}`])
    }
    checkWinner(randomHorse)
  })
}

///////////   Function above //////////////

deck.addEventListener('click', moveHorse)

window.addEventListener('load', () => {
  createHorse()
  poolWagers()
  raceAgain.style.display = 'none'
  track.style.gridTemplateRows = `repeat(${Object.keys(horses).length}, 1fr`
})
