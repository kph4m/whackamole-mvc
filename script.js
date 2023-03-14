// Model ==> database, data
const Model = (() => {

    // Game variables
    let score = 0;
    let timer = 30;

    // Intervals variables
    // interval at which moles are made to disappear
    let disappearMoleId;

    // interval at which moles are created
    let moleIntervalId;

    // interval at which timer is decremented
    let timerIntervalId;

    // interval at which snakes are created
    let snakeIntervalId;

    // State for moles
    class MoleState {
        constructor() {
            this._moleList = []
        }

        get moleList() {
            return this._moleList
        }

        set moleList(newList) {
            this._moleList = newList
        }

        addMole(index) {
            this._moleList.push(index)
        }

        removeMole(index) {
            this._moleList = this._moleList.filter(item => item !== index)
        }

        includes (index) {
            return this._moleList.includes(index)
        }
    }

    // State for snakes
    class SnakeState {
        constructor() {
            this._snakeList = []
        }

        get snakeList() {
            return this._snakeList
        }

        set snakeList(newList) {
            this._snakeList = newList
        }

        addSnake(index) {
            this._snakeList.push(index)
        }

        removeSnake(index) {
            this._snakeList = this._snakeList.filter(item => item !== index)
        }

        includes(index) {
            return this._snakeList.includes(index)
        }
    }

    return {
        MoleState,
        SnakeState,
        score,
        timer,
        disappearMoleId,
        moleIntervalId,
        timerIntervalId,
        snakeIntervalId
    }

})()

// View ==> UI
const View = (() => {

    // Dom elements
    let gameBoard = document.getElementById('game-board');
    let scoreValue = document.getElementById('score');
    let timerValue = document.getElementById('time-left');
    let startButton = document.getElementById('start-button');
    let blockElements = document.getElementsByClassName('block');

    return {
        gameBoard,
        scoreValue,
        timerValue,
        startButton,
        blockElements
    }
})()

// Controller ==> logic
const Controller = ((view, model) => {

    let { gameBoard, scoreValue, timerValue, startButton, blockElements } = view

    let { MoleState, SnakeState, score, timer, disappearMoleId, moleIntervalId, timerIntervalId, snakeIntervalId } = model

    let moles = new MoleState();

    let snakes = new SnakeState();

    const resetGame = () => {
        // reset game variables
        score = 0;
        timer = 30;

        // reset UI
        scoreValue.innerText = score;
        timerValue.innerText = timer;

        // reset intervals
        clearInterval(moleIntervalId);
        clearInterval(timerIntervalId);
        clearInterval(snakeIntervalId);
        clearInterval(disappearMoleId);

        // reset mole array
        moles.moleList = []

        // reset mole images
        for (let i = 0; i < blockElements.length; i++) {
            blockElements[i].style.backgroundImage = "none";
        }
    }

    const decrementTimer = () => {
        timer--;
        timerValue.innerText = timer;
        if (timer === 0) {
            clearInterval(moleIntervalId);
            clearInterval(timerIntervalId);
            clearInterval(snakeIntervalId); 
            clearInterval(disappearMoleId);
            alert("Time's up! Your got a score of ' + score + '!'");
        }
    }

    const createMole = () => {
        if (moles.moleList.length< 3) {
            let randomIndex = Math.floor(Math.random() * blockElements.length);

            // if already exists, generate another random number
            while (moles.includes(randomIndex) || snakes.includes(randomIndex)) {
                randomIndex = Math.floor(Math.random() * blockElements.length);
            }
            moles.addMole(randomIndex);
            blockElements[randomIndex].style.backgroundImage = "url('./images/mole.jpeg')";
        }
    }

    const whackMole = (event) => {
        const block = event.target;
        const index = Array.from(gameBoard.children).indexOf(block);
        if (moles.includes(index)) {
            score++;
            scoreValue.innerText = score;
            moles.removeMole(index);
            block.style.backgroundImage = "none"
        }
    }

    const disappearMole = () => {
        if (moles.moleList.length > 0) {
            blockElements[moles.moleList[0]].style.backgroundImage = "none";
            moles.removeMole(moles.moleList[0]);
        }
    }

    const createSnake = () => {
        if (snakes.snakeList.length < 1) {
            let randomIndex = Math.floor(Math.random() * blockElements.length);

            // if already exists, generate another random number
            while (snakes.includes(randomIndex)) {
                randomIndex = Math.floor(Math.random() * blockElements.length);
            }

            // if its the same as the mole, remove the mole
            if (moles.includes(randomIndex)) {
                moles.removeMole(randomIndex);
            }

            snakes.addSnake(randomIndex);
            blockElements[randomIndex].style.backgroundImage = "url('./images/mine.jpeg')";
        }

        // make snake go to a random position after 2 seconds
        if (snakes.snakeList.length === 1) {
            let randomIndex = Math.floor(Math.random() * blockElements.length);
            blockElements[snakes.snakeList[0]].style.backgroundImage = "none";
            snakes.removeSnake(snakes.snakeList[0]);

            // if already exists, generate another random number
            while (snakes.includes(randomIndex)) {
                randomIndex = Math.floor(Math.random() * blockElements.length);
            }

            // if its the same as the mole, remove the mole
            if (moles.includes(randomIndex)) {
                moles.removeMole(randomIndex);
                blockElements[randomIndex].style.backgroundImage = "none";
            }
            snakes.addSnake(randomIndex);
            blockElements[randomIndex].style.backgroundImage = "url('./images/mine.jpeg')";
        }
    }

    const whackSnake = (event) => {
        const block = event.target;
        const index = Array.from(gameBoard.children).indexOf(block);
        if (snakes.includes(index)) {
            for (let i = 0; i < blockElements.length; i++) {
                blockElements[i].style.backgroundImage = "url('./images/mine.jpeg')";
            }
            clearInterval(moleIntervalId);
            clearInterval(timerIntervalId);
            clearInterval(snakeIntervalId);
            clearInterval(disappearMoleId);
            alert('Game Over! Your got a score of ' + score + '!')
        }
    }

    const startGame = () => {
        resetGame()

        // start the timer at 1 second interval
        timerIntervalId = setInterval(decrementTimer, 1000);

        // create moles at 1 second interval
        moleIntervalId = setInterval(createMole, 1000);

        // create snakes at 2 second interval
        snakeIntervalId = setInterval(createSnake, 2000);

        // make the mole disappear after 2 seconds
        disappearMoleId = setInterval(disappearMole, 2000);
    }
    startButton.addEventListener('click', startGame);
    gameBoard.addEventListener('click', whackMole);
    gameBoard.addEventListener('click', whackSnake);

})(View, Model)