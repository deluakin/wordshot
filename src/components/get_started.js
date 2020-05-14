import React, { Component } from 'react'
import Variables from "./config";

export class GetStarted extends Component {

    state = {
        showHelp: false,
        isReady: true,
    }

    worker = null;
    timercount = 0;

    componentDidMount(){
        Variables.shotSound = new Audio();
        Variables.shotSound.src = "shoot.mp3";

        Variables.failSound = new Audio();
        Variables.failSound.src = "shoot2.mp3";

        this.worker = new Worker("countdown_worker.js")
        
        this.GenerateBalls();
    }

    componentWillUnmount(){
        this.worker.terminate()
        this.worker = undefined;
    }

    ThrowBallsToScreen(noOfBalls) {
        let w = window.innerWidth;
        let leftDiff = Math.floor(w/Variables.maxnoOfballsthrowable);
        let left = (w % leftDiff)/2;
        
        var container = document.getElementById("ball-container")
        var balls = container.getElementsByClassName("not-active");
        this.indexes = [];
        noOfBalls = (balls.length > noOfBalls) ? noOfBalls : balls.length-1;
        for(let x = 0; x < noOfBalls; x++){
            var index = Math.floor(Math.random()*balls.length);
            if(this.indexes.includes(index)){
                if((x+1) >= balls.length){
                    return;
                }
                x--;
                continue;
            }
            var ball = balls[index];
            this.indexes.push(index);

            ball.style.left = left + "px";
            left = left + leftDiff;

            let minSpeed = 3
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

            let h = window.innerHeight;
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
                    mthis.ResetBall(ball)
                }

                if(mthis.timercount < 4){
                    mthis.ThrowBallsToScreen(8);
                }
            };
        });
    }

    GenerateBalls() {
        let alphabets = this.GetAlphabets()
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

        this.ThrowBallsToScreen(8)
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

    CreateBall(alphabet, index) {
        var att = document.createAttribute("data-top");
        att.value = (-120 * index);

        var att2 = document.createAttribute("data-old-top");
        att2.value = (-120 * index);

        var ball = document.createElement("DIV");
        ball.classList.add("ball");
        ball.classList.add("opac-half");
        ball.classList.add("not-active");
        ball.innerHTML = "<span>" + alphabet + "</span>";

        ball.setAttributeNode(att);
        ball.setAttributeNode(att2);
        return ball;
    }

    ResetBall(ball) {
        ball.classList.add("not-active");
        ball.setAttribute("data-top", ball.getAttribute("data-old-top"))
        ball.style.top = ball.getAttribute("data-old-top")+"px"; 
    }
    
    beginGame = (e) => {
        this.props.onChange(2);
    }

    showHelp = (e) => {
        this.setState({
            showHelp: true
        })
    }

    GoBack = (e) => {
        this.setState({
            showHelp: false
        })
    }

    render() {
        return (
            <>
            { this.state.isReady && 
            <div className="sky">
            <div className='stars'>
            <div id="ball-container">
                <div className="aligner">
                    <div className="aligner-item">
                        <div className="text-center">
                            <img alt="BrainWave - Word Shot" src="logo.png" className="logo" />
                        </div>

                        {!this.state.showHelp && 
                        <>
                        <p className="mt50 text20 text-center">
                            Tap to shoot the letters in the word <br/><b>{Variables.word}</b>. <br/>
                        </p>
                        <p className="p10 text20 text-center">
                            <b>Tip:</b> Note the frequency of letters
                        </p>
                        <p className="p10 text20 text-center">
                            Current High Score <b>{Variables.targetPoint}</b>
                        </p>
                        <div className="mb20 mt50 text-center"><span onClick={this.beginGame} className="button">Play</span></div>
                        <div className="pt20 text-center hide"><span onClick={this.showHelp} className="button">Help</span></div>
                        </>
                        }

                        {this.state.showHelp && 
                        <>
                            <div className="note">Rack up points by tapping or clicking on balls with letters in the word of the day. Also, take note of the number of times each letter appears in the word. Tapping on a wrong letter will reduce your point. Don't forget to look out for bonus point balls. </div>
                            <div className="pt20 text-center"><span onClick={this.GoBack} className="button">Back</span></div>
                        </>
                        }

                    </div>
                </div>
            </div>
                </div>
                </div>
                }
                </>
        )
    }
}

export default GetStarted
