let squares=Array.from(document.querySelectorAll(".grid .grid-blocks"));

const displayScore=document.getElementById("displayScore"); // TO DISPLAY THE SCORE
const displayHighScore=document.getElementById("displayHighScore"); // TO DISPLAY THE HIGH SCORE
const displayHighScoreView=document.getElementById("displayHighScoreView"); // TO HIGHLIGHT THE NEW HIGH SCORE
const width=30;
let snake=[255, 254, 253, 252, 251, 250];
let foodIndex=0;
let bonusFoodIndex1=-1;
let bonusFoodIndex2=-1;
let tempBonusFoodIndex1=-1;
let tempBonusFoodIndex2=-1;
let bonusFoodIndex1TimerID=null;
let bonusFoodIndex2TimerID=null;
let tempTimer1=null;
let tempTimer2=null;
let direction=1;
let previousDirection=0;
let keyPressTime=99999;
let previousKeyPressTime=0;
let score=0;
let highScore=0;
let speedFactor=0.95;
let timeInterval=300;
let timerID=null;
let isGameOver=true;

// BUTTONS
const startOrPauseBtn=document.getElementById("startOrPauseBtn");
const leftBtn=document.getElementById("leftBtn");
const upBtn=document.getElementById("upBtn");
const rightBtn=document.getElementById("rightBtn");
const downBtn=document.getElementById("downBtn");
const infoBtn=document.getElementById("infoBtn");

// FUNCTIONS

// FOR STARTING A NEW GAME
function newGame()
{
    squares.forEach( (value, index) => squares[index].classList.remove("snake"));
    squares.forEach((value, index) => squares[index].classList.remove("food", "bonus-food-1", "bonus-food-2"));
    score=0;
    displayScore.innerHTML=score;
    direction=1;
    keyPressTime=99999;
    previousKeyPressTime=0;
    snake=[255, 254, 253, 252, 251, 250];
    snake.forEach(value => squares[value].classList.add("snake"));
    bonusFoodIndex1=-1;
    bonusFoodIndex2=-1;
    generateFood();
    timeInterval=300;
}

// CONTROLLING THE SNAKE WITH KEYBOARD ARROW KEYS
function control(e)
{
    if(timerID != null)
    {
        previousKeyPressTime=keyPressTime;
        let time=new Date();
        keyPressTime=time.getTime();

        if(e.keyCode == 37) // LEFT ARROW KEY
        {
            if(direction != 1)
            {
                previousDirection=direction;
                direction=-1;
            }
        }
        else if(e.keyCode == 38) // UP ARROW KEY
        {
            if(direction != width)
            {
                previousDirection=direction;
                direction=-width;
            }
        }
        else if(e.keyCode == 39) // RIGHT ARROW KEY
        {
            if(direction != -1)
            {
                previousDirection=direction;
                direction=1;
            }
        }
        else if(e.keyCode == 40) // DOWN ARROW KEY
        {
            if(direction != -width)
            {
                previousDirection=direction;
                direction=width;
            }
        }
    }
}

// GENERATING FOOD AT A RANDOM LOCATION
function generateFood()
{
    do {
        foodIndex=Math.floor(Math.random() * squares.length);
    } while(squares[foodIndex].classList.contains("snake") || squares[foodIndex].classList.contains("bonus-food-1") || squares[foodIndex].classList.contains("bonus-food-2"));

    squares[foodIndex].classList.add("food");

    if(foodIndex % 4 == 0 && bonusFoodIndex1 == -1)
    {
        do {
            bonusFoodIndex1=Math.floor(Math.random() * squares.length);
        } while(squares[bonusFoodIndex1].classList.contains("snake") || squares[bonusFoodIndex1].classList.contains("food") || squares[bonusFoodIndex1].classList.contains("bonus-food-1") || squares[bonusFoodIndex1].classList.contains("bonus-food-2"));

        squares[bonusFoodIndex1].classList.add("bonus-food-1");

        bonusFoodIndex1TimerID=setTimeout(() => {
            if(squares[bonusFoodIndex1].classList.contains("bonus-food-1"))
            {
                squares[bonusFoodIndex1].classList.remove("bonus-food-1");
                bonusFoodIndex1=-1;
            }
        }, 7000);
    }

    if(foodIndex % 5 == 0 && bonusFoodIndex2 == -1)
    {
        do {
            bonusFoodIndex2=Math.floor(Math.random() * squares.length);
        } while(squares[bonusFoodIndex2].classList.contains("snake") || squares[bonusFoodIndex2].classList.contains("food") || squares[bonusFoodIndex2].classList.contains("bonus-food-1") || squares[bonusFoodIndex2].classList.contains("bonus-food-2"));

        squares[bonusFoodIndex2].classList.add("bonus-food-2");

        bonusFoodIndex2TimerID=setTimeout(() => {
            if(squares[bonusFoodIndex2].classList.contains("bonus-food-2"))
            {
                squares[bonusFoodIndex2].classList.remove("bonus-food-2");
                bonusFoodIndex2=-1
            }
        }, 7000);
    }
}

// TO CHECK IF THE SNAKE COLLIDES WITH ANY WALLS OR WITH ITS OWN BODY
function checkCollision()
{
    if(snake[0] % width == (width - 1) && direction == 1) // COLLISION WITH RIGHT WALL
    {
        return true;
    }
    else if(snake[0] % width == 0 && direction == -1) // COLLISION WITH LEFT WALL
    {
        return true;
    }
    else if((snake[0] + direction) >= squares.length) // COLLISION WITH BOTTOM WALL
    {
        return true;
    }
    else if((snake[0] + direction) < 0) // COLLISION WITH TOP WALL
    {
        return true;
    }
    else if(squares[snake[0] + direction].classList.contains("snake")) // COLLISION WITH OWN BODY
    {
        if((snake[0] + direction) == snake[1]) // COLLISION WITH THE NECK OF THE SNAKE ALONG THE SAME LINE IS AVOIDED WHEN TRYING TO MAKE A FAST 180 DEGREE TURN
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    else
    {
        return false;
    }
}

// TO CHECK IF TWO KEY PRESSES ARE MADE WITHIN A SPECIFIC TIME INTERVAL OR NOT
function doubleKeyPresses()
{
    if((keyPressTime - previousKeyPressTime) < timeInterval)
    {
        let snakeTail=snake.pop();
        squares[snakeTail].classList.remove("snake");
        snake.unshift(snake[0] + previousDirection);

        // REMOVES THE BUG OF THE SNAKE TRYING TO PASS THROUGH THE TOP OR BOTTOM WALL THAT MAY HAPPEN FOR PRESSING TWO KEYS WITHIN A SPECIFIC TIME INTERVAL
        if(!(snake[0] < 0 || snake[0] >= squares.length))
        {
            squares[snake[0]].classList.add("snake");
        }
    }
}

// MOVING THE SNAKE
function snakeMovement()
{
    if(!checkCollision())
    {
        doubleKeyPresses();

        let snakeTail=snake.pop();
        squares[snakeTail].classList.remove("snake");
        snake.unshift(snake[0] + direction);

        // REMOVES THE BUG OF THE SNAKE TRYING TO PASS THROUGH THE TOP OR BOTTOM WALL THAT MAY HAPPEN FOR PRESSING TWO KEYS WITHIN A SPECIFIC TIME INTERVAL
        if(!(snake[0] < 0 || snake[0] >= squares.length))
        {
            squares[snake[0]].classList.add("snake");
        }
        else
        {
            gameOver();
            return;
        }


        // REMOVES THE BUG OF THE SNAKE TYING TO PASS THROUGH THE LEFT OR RIGHT WALL THAT MAY HAPPEN FOR PRESSING TWO KEYS WITHIN A SPECIFIC TIME INTERVAL
        if(snake[0] % width == 0 && snake[1] % width == 0 && snake[2] % width == (width - 1))
        {
            squares[snake[0]].classList.remove("snake");
            squares[snake[1]].classList.remove("snake");
            gameOver();
        }
        else if(snake[0] % width == (width - 1) && snake[1] % width == (width - 1) && snake[2] % width == 0)
        {
            squares[snake[0]].classList.remove("snake");
            squares[snake[1]].classList.remove("snake");
            gameOver();
        }


        if(squares[snake[1]].classList.contains("food")) // WHEN THE SNAKE EATS NORMAL FOOD
        {
            squares[snake[1]].classList.remove("food");
            snake.push(snakeTail);
            squares[snakeTail].classList.add("snake");

            score+=4;
            displayScore.innerHTML=score;
            generateFood();

            clearInterval(timerID);
            timerID=null;
            timeInterval=Math.floor(timeInterval * speedFactor);
            timerID=setInterval(snakeMovement, timeInterval);
        }
        else if(squares[snake[1]].classList.contains("bonus-food-1")) // WHEN THE SNAKE EATS BONUS FOOD 1
        {
            squares[snake[1]].classList.remove("bonus-food-1");
            bonusFoodIndex1=-1;
            tempBonusFoodIndex1=-1; // THIS VARIABLE IS NEEDED AFTER RESUMING THE GAME
            clearTimeout(bonusFoodIndex1TimerID);
            // THE LENGTH OF THE SNAKE WILL GET REDUCED BY 4
            let removedPart=0;
            if(snake.length >= 6)
            {
                for(let i=0; i<4; i++)
                {
                    removedPart=snake.pop();
                    squares[removedPart].classList.remove("snake");
                }
            }

            score+=16;
            displayScore.innerHTML=score;
        }
        else if(squares[snake[1]].classList.contains("bonus-food-2")) // WHEN THE SNAKE EATS BONUS FOOD 2
        {
            squares[snake[1]].classList.remove("bonus-food-2");
            bonusFoodIndex2=-1;
            tempBonusFoodIndex2=-1; // THIS VARIABLE IS NEEDED AFTER RESUMING THE GAME
            clearTimeout(bonusFoodIndex2TimerID);
            snake.push(snakeTail);
            squares[snakeTail].classList.add("snake");

            score+=32;
            displayScore.innerHTML=score;

            clearInterval(timerID);
            timerID=null;
            // THE SPEED OF THE SNAKE WILL BE DECREASED BY 3 TIMES OF SPEEDFACTOR
            timeInterval=Math.floor(timeInterval / speedFactor);
            timeInterval=Math.floor(timeInterval / speedFactor);
            timeInterval=Math.floor(timeInterval / speedFactor);
            timerID=setInterval(snakeMovement, timeInterval);
        }

        keyPressTime=99999;
        previousKeyPressTime=0;
    }
    else
    {
        gameOver();
    }
}

// GAME OVER
function gameOver()
{
    isGameOver=true;
    clearInterval(timerID);
    timerID=null;
    clearTimeout(bonusFoodIndex1TimerID);
    clearTimeout(bonusFoodIndex2TimerID);
    bonusFoodIndex1TimerID=null;
    bonusFoodIndex2TimerID=null;

    if(tempTimer1 != null)
    {
        clearTimeout(tempTimer1);
        tempTimer1=null;
    }
    if(tempTimer2 != null)
    {
        clearTimeout(tempTimer2);
        tempTimer2;
    }

    displayScore.innerHTML+=" Game Over !!!";

    highScore=getHighScoreFromCookie();
    if(score > highScore) // SAVING THE NEW HIGH SCORE IN JAVASCRIPT COOKIE
    {
        setHighScoreInCookie("snakeHighScoreGame2", score, 90);
        displayHighScore.innerHTML=score;
        displayHighScoreView.style.color="#FFF6EB";
        setTimeout(() => {
            displayHighScoreView.style.color="";
        }, 3000);
    }
}

// EVENTS

document.addEventListener("keyup", control);

startOrPauseBtn.addEventListener("click", () => {
    if(timerID != null)
    {
        clearInterval(timerID);
        timerID=null;

        if(tempTimer1 != null)
        {
            clearTimeout(tempTimer1);
            tempTimer1=null;
        }
        if(tempTimer2 != null)
        {
            clearTimeout(tempTimer2);
            tempTimer2;
        }

        tempBonusFoodIndex1=bonusFoodIndex1;
        tempBonusFoodIndex2=bonusFoodIndex2;

        clearTimeout(bonusFoodIndex1TimerID);
        clearTimeout(bonusFoodIndex2TimerID);
        bonusFoodIndex1TimerID=null;
        bonusFoodIndex2TimerID=null;
    }
    else
    {
        if(isGameOver)
        {
            newGame();
            isGameOver=false;
        }
        else
        {
            tempTimer1=setTimeout(() => {
                if(tempBonusFoodIndex1 != -1)
                {
                    if(squares[tempBonusFoodIndex1].classList.contains("bonus-food-1"))
                    {
                        squares[tempBonusFoodIndex1].classList.remove("bonus-food-1");
                        bonusFoodIndex1=-1;
                        tempBonusFoodIndex1=-1;
                        tempTimer1=null;
                    }
                }
            }, 7000);

            tempTimer2=setTimeout(() => {
                if(tempBonusFoodIndex2 != -1)
                {
                    if(squares[tempBonusFoodIndex2].classList.contains("bonus-food-2"))
                    {
                        squares[tempBonusFoodIndex2].classList.remove("bonus-food-2");
                        bonusFoodIndex2=-1;
                        tempBonusFoodIndex2=-1;
                        tempTimer2=null;
                    }
                }
            }, 7000);
        }
        timerID=setInterval(snakeMovement, timeInterval);
    }
});

leftBtn.addEventListener("click", () => {
    if(timerID != null)
    {
        previousKeyPressTime=keyPressTime;
        let time=new Date();
        keyPressTime=time.getTime();

        if(direction != 1)
        {
            previousDirection=direction;
            direction=-1;
        }
    }
});

upBtn.addEventListener("click", () => {
    if(timerID != null)
    {
        previousKeyPressTime=keyPressTime;
        let time=new Date();
        keyPressTime=time.getTime();

        if(direction != width)
        {
            previousDirection=direction;
            direction=-width;
        }
    }
});

rightBtn.addEventListener("click", () => {
    if(timerID != null)
    {
        previousKeyPressTime=keyPressTime;
        let time=new Date();
        keyPressTime=time.getTime();

        if(direction != -1)
        {
            previousDirection=direction;
            direction=1;
        }
    }
});

downBtn.addEventListener("click", () => {
    if(timerID != null)
    {
        previousKeyPressTime=keyPressTime;
        let time=new Date();
        keyPressTime=time.getTime();

        if(direction != -width)
        {
            previousDirection=direction;
            direction=width;
        }
    }
});

infoBtn.addEventListener("click", () => {
    alert(
        "Brown Berry -\n" +
        "Points: 4, Speed: Increases by 1, Length: Increases by 1.\n" +
        "Blue Berry -\n" +
        "Points: 16, Length: Decreases by 4, Time: 7 Seconds.\n" +
        "Violet Berry -\n" +
        "Points: 32, Speed: Decreases by 3, Length: Increases by 1, Time: 7 Seconds."
    );
});

// FUNCTIONS FOR MANAGING HIGH SCORE WITH JAVASCRIPT COOKIES

function displayHighScoreOnScreen()
{
    displayHighScore.innerHTML=getHighScoreFromCookie();
}

function setHighScoreInCookie(cookieName, cookieValue, days)
{
    let d=new Date();
    d.setTime(d.getTime() + (days * 24 * 3600 * 1000));
    let expires="expires=" + d.toUTCString();
    let cookieString=cookieName + "=" + cookieValue + ";" + expires + ";path=/;";
    document.cookie=cookieString;
}

function getHighScoreFromCookie()
{
    let highScoreFromCookie=0;
    if(document.cookie != null && document.cookie != "")
    {
        let retrievedCookie=document.cookie;
        let cookieArr=retrievedCookie.split("; ");
        for(let i=0; i<cookieArr.length; i++)
        {
            let part=cookieArr[i].split("=");
            if(part[0] == "snakeHighScoreGame2")
            {
                highScoreFromCookie=part[1];
                break;
            }
        }
    }
    return highScoreFromCookie;
}
