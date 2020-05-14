import React, { Component } from 'react'
import Variables from "./config";

export class NewGame extends Component {

    indexes = [];
    wordSearch = [];
    worker = null;
    timercount = 0;
    state = {
        ballsFinished: false,
        increasePoint: "+10",
        showPoint: false,
        winStatus: 0
    }

    componentDidMount(){
        this.worker = new Worker("countdown_worker.js")
        this.GenerateBalls();
    }

    GenerateBalls() {
        let word = Variables.word
        let count = this.GetMostCharacterCount(word);
        this.wordSearch = word.split("")
        let alphabets = [];
        for(let x = 0; x < count; x++){
            alphabets = alphabets.concat(this.GetAlphabets())
        }
        alphabets.push("+25")
        alphabets.push("+150")
        alphabets.push("+50")
        alphabets.push("+75")

        for(let x = 0; x <= 10; x++){
            alphabets.push("+1")
        }

        for(let x = 0; x <= 5; x++){
            alphabets.push("+7")
        }

        for(let x = 0; x <= 3; x++){
            alphabets.push("+15")
        }

        for(let x = 0; x < 8; x++){
            alphabets.push("-2")
        }

        alphabets.push("-75")
        alphabets.push("-100")
        alphabets.push("-120")

        let container = document.getElementById("ball-container")
        let index = 1;
        alphabets.forEach((alphabet) => {
            var ball = this.CreateBall(alphabet, index)
            container.appendChild(ball)
            if(index >= Variables.maxnoOfballsthrowable){
                index = 0;
            }
            index++;
        });

        this.ThrowBallsToScreen(6)
    }

    ThrowBallsToScreen(noOfBalls) {
        let w = window.innerWidth;
        let leftDiff = Math.floor(w/Variables.maxnoOfballsthrowable);
        let left = (w % leftDiff)/2;
        
        var container = document.getElementById("ball-container")
        var balls = container.querySelectorAll(".not-active");
        this.indexes = [];
        noOfBalls = (balls.length > noOfBalls) ? noOfBalls : balls.length;
        for(let x = 0; x < noOfBalls; x++){
            var index = Math.floor(Math.random()*balls.length);
            if(this.indexes.includes(index)){
                if((x+1) >= balls.length){
                    console.log(this.indexes, index)
                    continue;
                }
                x--;
                continue;
            }
            var ball = balls[index];
            this.indexes.push(index);

            ball.style.left = left + "px";
            left = left + leftDiff;

            let minSpeed = 2
            let speed = (Math.floor(Math.random()*minSpeed)) + minSpeed;
            
            ball.classList.remove("not-active")
            ball.classList.add("active")
            ball.setAttribute("data-timer", speed);
            ball.setAttribute("id", "ball-"+Math.random());

            this.timercount +=1;
        }
        this.MoveBallstoBottom()
    }
    
    MoveBallstoBottom() {
        var mthis = this;
        var activeBalls = document.querySelectorAll(".active");
        Array.prototype.forEach.call(activeBalls, function(ball) {
            var speed = ball.getAttribute("data-timer")
            var ball_id = ball.getAttribute("id")
            ball.classList.remove("active")
            var top = parseInt(ball.getAttribute("data-top"));

            let h = window.innerHeight+50;
            mthis.worker.postMessage({id: ball_id, speed: speed, top: top, window: h});
            mthis.worker.onmessage = function(event){
                var data = event.data;
                var ball = document.getElementById(data.id);
                if(ball === null){
                    return;
                }
                ball.style.top = data.top+"px" 
                ball.setAttribute("data-top", data.top)
                if (data.top > h) {
                    mthis.timercount -=1;
                    ball.remove()
                }

                if(mthis.timercount === 0){
                    if(Variables.totalPoints > Variables.targetPoint){
                        mthis.YouWon();
                    }else{
                        mthis.YouLost();
                    }
                }

                if(mthis.timercount < 5){
                    mthis.ThrowBallsToScreen(6);
                }
            };
        });
    }

    YouWon() {
        this.setState({
            winStatus: 1
        })

        fetch(`${Variables.apiBase}set.php?point=${Variables.totalPoints}`, 
        {mode: 'cors'})
          .then(results => {
            //return results.json();
          }).then(data => {
          })
    }

    YouLost() {
        this.setState({
            winStatus: -1
        })
    }

    GetMostCharacterCount(word){
        let count = 1;
        let charArr = word.split('')
        charArr.forEach((char) => {
            let xcount = word.split(char).length-1
            if(xcount > count){
                count = xcount;
            }
        });
        return count;
    }

    CreateBall(alphabet, index) {
        var att = document.createAttribute("data-top");
        att.value = (-120 * index);

        var ball = document.createElement("DIV");
        ball.addEventListener("touchend", (ev) => {
            let target = ev.target
            let alphabet = target.innerText.trim()
            let position = this.wordSearch.indexOf(alphabet)
            
            if((position < 0 && isNaN(alphabet)) || 
                    (!isNaN(alphabet) && parseInt(alphabet) < 0)) {
                //make ball red
                ball.classList.add("red-ball");
            }

            if(!isNaN(alphabet)){
                if(target.tagName === "SPAN"){
                    if(!target.parentElement.classList.contains("hide")){
                        this.IncreasePoint(alphabet, ball);
                    }
                    if(parseInt(alphabet) > 0){
                        target.parentElement.classList.add("hide");
                    }
                }else{
                    if(!target.classList.contains("hide")){
                        this.IncreasePoint(alphabet, ball);
                    }
                    if(parseInt(alphabet) > 0){
                        target.classList.add("hide");
                    }
                }
            }
            else if(position > -1){
                this.wordSearch.splice(position, 1);

                if(target.tagName === "SPAN"){
                    if(!target.parentElement.classList.contains("hide")){
                        this.IncreasePoint(Variables.pointPerCharacter, ball);
                    }
                    target.parentElement.classList.add("hide");
                }else{
                    if(!target.classList.contains("hide")){
                        this.IncreasePoint(Variables.pointPerCharacter, ball);
                    }
                    target.classList.add("hide");
                }
            }else{
                this.IncreasePoint(Variables.pointPerFailedCharacter, ball);
            }
        })
        ball.classList.add("ball");
        ball.classList.add("not-active");
        ball.innerHTML = "<span>" + alphabet + "</span>";

        ball.setAttributeNode(att);
        return ball;
    }

    GunShot(){
        if(!Variables.shotSound.paused){
            Variables.shotSound.pause();
            Variables.shotSound.currentTime = 0;
        }
        Variables.shotSound.play();
    }

    FailShot(){
        if(!Variables.failSound.paused){
            Variables.failSound.pause();
            Variables.failSound.currentTime = 0;
        }
        Variables.failSound.play();
    }

    IncreasePoint(point, ball){
        this.setState({
            increasePoint: point,
            showPoint: true,
        })
        let ppoint = parseInt(point);
        
        if(ball.classList.contains("red-ball")){
            this.FailShot()
        }else{
            this.GunShot()
        }
        
        Variables.totalPoints += ppoint;

        if(Variables.totalPoints > Variables.targetPoint && this.wordSearch.length === 0){
            this.YouWon();
        }

        setTimeout(() => {
            this.HidePointFlasher()
        }, 1000)
    }

    GetAlphabets() {
        var alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        var ctr = alphabets.length, temp, index;
        while (ctr > 0) {
            index = Math.floor(Math.random() * ctr);
            ctr--;
            temp = alphabets[ctr];
            alphabets[ctr] = alphabets[index];
            alphabets[index] = temp;
        }
        return alphabets;
    }

    HidePointFlasher(){
        this.setState({
            showPoint: false,
        })
    }

    tryAgain() {
        window.location.reload()
    }

    render() {
        return (
            <div className='sky'>
                <div className='stars'></div>
            <div id="ball-container">
                <div className="p10 text30 clearfix">
                    <div className="left points-bar">Points: {Variables.totalPoints}</div>
                    <div className="right points-bar">Target: {Variables.targetPoint}</div>
                    <div className={(this.state.showPoint) ? "point-bar fadein" : "point-bar fadeout"} >
                        <span className="text-30">{this.state.increasePoint}</span>
                    </div>

                    {this.state.winStatus === 1 && 
                    <>
                        <h3 className="mt100 text-center">Hurray! You surpassed the highest points</h3>
                        <div className="pt20 text-center"><span onClick={this.tryAgain} className="button">Play Again</span></div>
                    </>
                    }

                    {this.state.winStatus === -1 && 
                    <>
                        <h3 className="text-center mt100">Game Over</h3>
                        <div className="pt20 text-center"><span onClick={this.tryAgain} className="button">Play Again</span></div>
                    </>
                    }
                </div>
            </div>
            </div>
        )
    }
}

export default NewGame
