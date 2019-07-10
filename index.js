// ====== CONFIGURAÇÃO E VARIÁVEIS DO CANVAS
const CANVAS_WIDTH = document.documentElement.clientWidth - document.documentElement.clientWidth % 20;
const CANVAS_HEIGHT = document.documentElement.clientHeight - document.documentElement.clientHeight % 20;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.setAttribute('width', CANVAS_WIDTH);
canvas.setAttribute('height', CANVAS_HEIGHT);
canvas.style.border = "1px solid black";
canvas.style.backgroundColor = "rgba(255,0,0,0.5)";
// =======================================

// ====== VARIÁVEIS GLOBAIS
let tamanho = 2;
let cobra = [{x: CANVAS_WIDTH/2 - (CANVAS_WIDTH/2 % 20), y: CANVAS_HEIGHT/2 - (CANVAS_HEIGHT/2 % 20)}];
let dX = 20;
let dY = 0;
let movendoDir = true;
let movendoEsq = false;
let movendoCima = false;
let movendoBaixo = false;
let limiteCima = false;
let limiteBaixo = false;
let limiteDir = false;
let limiteEsq = false;
let isGameOver = false;
let randomX = Math.ceil((Math.random()*CANVAS_WIDTH));
let randomY = Math.ceil((Math.random()*CANVAS_HEIGHT));
let comidaX = randomX - randomX % 20;
let comidaY = randomY - randomY % 20;
let pontuacao = 0;
let velocidade = 200;
// ===========================

// ====== ELEMENTOS DO HTML
const game_over = document.getElementById('game-over');
const botaoSim = document.getElementById('sim');
const botaoNao = document.getElementById('nao');





// ==========================

// ====== EVENT LISTENERS
botaoSim.addEventListener('click', () => {
    reset();
    game_over.style.display = 'none';
});

botaoNao.addEventListener('click', () => {
    limparTela();
    game_over.style.display = 'none';
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign='center'; // Todos os textos estão centralizados por causa dessa bagaça aqui
    const textoPerdedor = 'VOÇE PERDEL, OTARIL\nPONTUAÇÃO: ' + pontuacao;
    fillTextMultiLine(ctx, textoPerdedor, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
});


// ========================

// ====== EVENT LISTENER PARA TECLAS
window.addEventListener('keydown', (e) => {
    if(e.code === "ArrowUp" && !movendoBaixo){
        dX = 0;
        dY = -20;
        movendoCima = true;
        movendoDir = false;
        movendoEsq = false;
        movendoBaixo = false;
    }
    if(e.code === "ArrowDown" && !movendoCima){
        dX = 0;
        dY = 20;
        movendoCima = false;
        movendoDir = false;
        movendoEsq = false;
        movendoBaixo = true;
    }
    if(e.code === "ArrowRight" && !movendoEsq){
        dX = 20;
        dY = 0;
        movendoDir= true;
        movendoCima = false;
        movendoEsq = false;
        movendoBaixo = false;
    }
    if(e.code === "ArrowLeft" && !movendoDir){
        dX = -20;
        dY = 0;
        movendoEsq= true;
        movendoCima = false;
        movendoDir = false;
        movendoBaixo = false;
    }
});
// ==========================

//====== EXECUÇÃO DO JOGO
ctx.fillStyle = "rgba(255,0,0,0.5)";
ctx.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
setarPontuacao();
criarCobra();
desenharCobra();
mover();

let gameloop = '';

if (gameloop) {
    velocidade = 200;
    clearInterval(gameloop);
}

gameloop = setInterval(gameLoop,velocidade);

//========================

//========== FUNÇÕES
function gameLoop() {
    if(!isGameOver){
        if(colisaoCobra()) {
            isGameOver = true;
            gameOver();
            return;
        }
        mover();
        gerarComida();
    }
}


function fillTextMultiLine(ctx, text, x, y) {
    var lineHeight = ctx.measureText("M").width * 2;
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; ++i) {
      ctx.fillText(lines[i], x, y);
      y += lineHeight;
    }
  }

function checarLimite(){

    if(cobra[0].y <= 0){
        if(movendoCima === true) {
            limiteCima = true;
            movendoCima = false;
            return false;
        }
        else {
            return true;
        }
    }
    if(cobra[0].y >= CANVAS_HEIGHT-20){
        if(movendoBaixo === true) {
            limiteBaixo = true;
            movendoBaixo = false;
            return false;
        }
        else {
            return true;
        }
        
    }
    if(cobra[0].x <= 0){
        if(movendoEsq === true) {
            limiteEsq = true;
            movendoEsq = false;
            return false;
        }
        else {
            return true;
        }
        
    }
    if(cobra[0].x >= CANVAS_WIDTH-20){
        if(movendoDir === true) {
            limiteDir = true;
            movendoDir = false;
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}

function colisaoCobra() {
    let dx = 0;
    let dy = 0;
    let contador = 0;
    if(contador < 1) {
        if(movendoCima){
            dx = 0;
            dy = -20;
        }
        if(movendoBaixo){
            dx = 0;
            dy = 20;
        }
        if(movendoDir){
            dx = 20;
            dy = 0;
        }
        if(movendoEsq){
            dx = -20;
            dy = 0;
        }
        contador ++
    }
    const result = cobra.filter((parte, i) => {
        if(i+1 <= cobra.length-1){
            return cobra[0].x === cobra[i+1].x && cobra[0].y === cobra[i+1].y;
        }
    });

    if(result.length !== 0) {
        return true;
    }
    else {
        return false;
    }
}

function gameOver(){
    const game_over = document.getElementById('game-over');
    game_over.style.display = 'block';
    game_over.style.top = CANVAS_HEIGHT/2+'px';
    game_over.style.left = CANVAS_WIDTH/2+'px';
}

function reset(){
    dX = 20;
    dY = 0;
    movendoEsq= false;
    movendoCima = false;
    movendoDir = true;
    movendoBaixo = false;
    isGameOver = false;
    limparTela();
    cobra = [{x: CANVAS_WIDTH/2 - (CANVAS_WIDTH/2 % 20), y: CANVAS_HEIGHT/2 - (CANVAS_HEIGHT/2 % 20)}];
    criarCobra();
    desenharCobra();
    const randomX = Math.trunc((Math.random()*CANVAS_WIDTH));
    const randomY = Math.trunc((Math.random()*CANVAS_HEIGHT));
    comidaX = randomX - randomX % 20;
    comidaY = randomY - randomY % 20;
    desenharComida();
    pontuacao = 0;
    setarPontuacao();

    if (gameloop) {
        velocidade = 200;
        clearInterval(gameloop);
    }

    gameloop = setInterval(gameLoop,velocidade);
}

function desenharCobra() {
    cobra.forEach((parte) => {
        ctx.strokeStyle='black';
        ctx.fillStyle = 'green';
        ctx.fillRect(parte.x, parte.y, 20, 20);
        ctx.strokeRect(parte.x, parte.y, 20, 20)
    });
}

function setarPontuacao() {
    const textoPontos = document.querySelector('#pontuacao p');
    textoPontos.textContent = "Pontos: " + pontuacao;
}

function criarCobra() {
    for(let i = 0; i<tamanho-1 ;i++) {
        const novaParte = {x: cobra[0].x - (20 * (i+1)), y: cobra[0].y};
        cobra.push(novaParte);
    }
}

function limparTela(){
    ctx.fillStyle="white";
    ctx.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
}

function mover() {
    
        if(checarLimite()){
            cobra.unshift({x:cobra[0].x+dX, y:cobra[0].y+dY});
            cobra.pop();    
            limparTela();
            desenharCobra();
    }
    else {
        isGameOver = true;
        gameOver();
    }
}

function colisaoComidaCobra(){
    return cobra[0].x === comidaX && cobra[0].y === comidaY;
}

function desenharComida(){
    ctx.strokeStyle='yellow';
    ctx.fillStyle='red';
    ctx.fillRect(comidaX,comidaY,20,20);    
    ctx.strokeRect(comidaX,comidaY,20,20);    
}

function atualizarPontos() {
    pontuacao += 1;
}

function gerarComida() {
    if(colisaoComidaCobra()) {
        if(velocidade > 10) {
            velocidade = velocidade - 10;    
        }
        
        clearInterval(gameloop);
        gameloop = setInterval(gameLoop, velocidade);

        const randomX = Math.trunc((Math.random()*CANVAS_WIDTH));
        const randomY = Math.trunc((Math.random()*CANVAS_HEIGHT));
        comidaX = randomX - randomX % 20;
        comidaY = randomY - randomY % 20;

        cobra.push({x:cobra[cobra.length-1].x, y:cobra[cobra.length-1].y});
        desenharCobra();
        atualizarPontos();
        setarPontuacao();
    }
    desenharComida();
}
// =========================f