const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const cw = canvas.width;
const ch = canvas.height;

const arenaSetup = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,cw,ch);
    ctx.strokeStyle="white"
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(cw/2, 0);
    ctx.lineTo(cw/2, ch);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cw/2,ch/2, 60, 0, Math.PI*2);
    ctx.stroke();
}

class Ball {

    constructor(x,y,xs,ys){
        this.x = x;
        this.y = y;
        this.xSpeed = xs;
        this.ySpeed = ys;
        this.r = 6;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.x,this.y,6,0,Math.PI*2);
        ctx.fill();
    }

    move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }
    
    wallCollision() {
        if((this.y-this.r <= 0) || (this.y+this.r >=ch)){
            this.ySpeed *= (-1);
        }
    }
    leftPaddleCollision(px,py) {
        if((this.x-this.r <= px+10) && (this.y>=py && this.y<=py+80)){
            this.xSpeed *= (-1);
        }
    }

    rightPaddleCollision(px,py) {
        if((this.x+this.r >= px) && (this.y>=py && this.y<=py+80)){
            this.xSpeed *= (-1);
        }
    }
}

class Paddle {

    constructor(x,y,keyUp,keyDown) {
        this.x = x;
        this.y = y
        this.keyDown = false;
        this.keyUp = false;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(this.x,this.y, 10, 80);
    }

    press(){
        
    }
    move(){
        if(this.keyDown && this.y+80<ch){
            this.y +=2;
        }

        if(this.keyUp && this.y>0){
            this.y -=2;
        }
    }
}

document.addEventListener("keydown", event => {
    if(event.key === "ArrowUp"){
        leftPaddle.keyUp=true;
    }

    if(event.key === "ArrowDown"){
        leftPaddle.keyDown=true;
    }

    if(event.key === "w"){
        rightPaddle.keyUp=true;
    }

    if(event.key === "s"){
        rightPaddle.keyDown=true;
    }

})

document.addEventListener("keyup", event => {
    if(event.key === "ArrowUp"){
        leftPaddle.keyUp=false;
    }

    if(event.key === "ArrowDown"){
        leftPaddle.keyDown=false;
    }

    if(event.key === "w"){
        rightPaddle.keyUp=false;
    }

    if(event.key === "s"){
        rightPaddle.keyDown=false;
    }
})

const randomBallxSpeed = Math.pow(2*Math.cos(Math.random()*Math.PI),2)*Math.pow(-1, Math.ceil(Math.random()*2));
const randomBallySpeed = 2*(1-randomBallxSpeed);
const leftPaddle = new Paddle(4,ch/2-40,"UP","DOWN")
const rightPaddle = new Paddle(cw-14,ch/2-40,"UP","DOWN");
const ball = new Ball(cw/2,ch/2, randomBallxSpeed,randomBallySpeed);
let leftScore = 0;
let rightScore = 0;

const checkScore = (object) => {
    if (object.x<0){
        rightScore +=1;
        object.x=cw/2
        object.y=ch/2
        object.xSpeed = Math.pow(2*Math.cos(Math.random()*Math.PI),2)*Math.pow(-1, Math.ceil(Math.random()*2));
        object.ySpeed = 2*(1-randomBallxSpeed);
    }
    if (object.x>cw){
        leftScore +=1
        object.x=cw/2
        object.y=ch/2
        object.xSpeed = Math.pow(2*Math.cos(Math.random()*Math.PI),2)*Math.pow(-1, Math.ceil(Math.random()*2));
        object.ySpeed = 2*(1-randomBallxSpeed);
    }
}

const checkWinner = (left,right) => {
    if(left===10){
        alert("Wygrał gracz I")
    }
    if(right===10){
        alert("Wygrał gracz II")
    }
}


const displayScore = (a,b) => {
    document.getElementById("scoreDisplay").innerHTML=`${a}:${b}`;
}

const gameLoop = () => {
    arenaSetup(); // dlaczego należy to wywołać tutaj?
    displayScore(leftScore,rightScore);
    checkScore(ball)
    ball.draw();
    ball.move();
    ball.wallCollision();
    leftPaddle.draw();
    rightPaddle.draw();
    leftPaddle.move();
    rightPaddle.move();
    ball.leftPaddleCollision(leftPaddle.x,leftPaddle.y)
    ball.rightPaddleCollision(rightPaddle.x,rightPaddle.y)
    checkWinner(leftScore,rightScore);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);