/**
 * Variables de configuracion
 */
/** 
 * 
 * Configuracion Canvas 
 * 
 */
var ctx, canvas;
const TABLERO_NAME = "conecta4Tablero";// Nombre del Canvas

// Color 
var colorGato   = "black";
var colorCanvas = "black";

// Tamaño del Canvas
var ancho       = 640;
var alto        = 480;

// Finlas y columnas del canvas
const columnas = 8;
const filas = 8;

// Variable que controla cada cuando se pinta una ralla
var xDif = (ancho/columnas)-0.6; // 79.4;
var yDif = (alto/filas)-0.6; // 59.4;

//Variables de objetos de jugador
var cJ1,cJ2;//Color
var tJ1,tJ2;//Turno
var sJ1,sJ2;//Score
var nJ1,nJ2;//Nombre
var profileColors;//Colores del perfil
/**
 * 
 * Configuracion del Juego
 * 
 */
// Arreglos del juego
var fichas_Matrix = [];
var scoreP1=0;
var scoreP2=0;

// Constantes de la matriz
const SIZE_MATRIX_X     = columnas;
const SIZE_MATRIX_Y     = filas;
const SIZE_FICHA_width  = xDif;
const SIZE_FICHA_height = yDif;

/* turn */
var turn    = true; // Turno

/**
 * Funcion que inicia todo 
 */
function iniciar(){
    let size;
    if (columnas > filas) {
        size = columnas;
    }else{
        size = filas;
    }

    /// Se crea la matriz de fichas
    for(let i=0; i<size ; i++){
        fichas_Matrix[i] = new Array(size);
    }

    // Pinta el tablero
    pintaTablero();
    changeProfileElements();
    // Inicializa la matriz
    iniciaMatriz();

    // se añade el evento eleccionar para dibujar
    canvas.addEventListener("click",selecciona,false);
    return false;
}

/**
 * Funcion encargada de pintar el tablero
 */
function pintaTablero(){
    // Optiene el canvas
    canvas= document.getElementById(TABLERO_NAME);

    // Pone ancho y alto del canvas
    canvas.width  = ancho;
    canvas.height = alto;

    ctx = canvas.getContext("2d");

    // Estilos de color
    ctx.fillStyle   = colorCanvas;
    ctx.strokeStyle = colorGato;

    // Grueso de linea
    ctx.lineWidth   = 5;

    // Dibuja las lineas verticales
    for(let distanceX=2; distanceX<=ancho; distanceX+=xDif){
    	ctx.beginPath();
	    ctx.moveTo(distanceX,0);
    	ctx.lineTo(distanceX,alto);
        ctx.stroke();
    }

    // Dibuja lineas horizontales
    for(let distanceY=2; distanceY<=alto ; distanceY+=yDif){
    	ctx.beginPath();
	    ctx.moveTo(0,distanceY);
    	ctx.lineTo(ancho,distanceY);
    	ctx.stroke();
    }
}

/**
 * Constructor de Ficha
 * @param {*} x Posicion X
 * @param {*} y Posicion Y
 * @param {*} i indice
 * @param {*} ren renglon
 * @param {*} col Columna
 */
function Ficha(x,y,i,ren,col){
    this.x = x;
    this.y = y;
    this.i = i;
    this.ren = ren;
    this.col = col;
    this.valor = "";
    this.pinta = pintaFicha;
    this.color = "black";
}

/**
 * Pinta una Ficha dado un valor String
 * pintaFicha ("o");
 * @param {*} valor String
 */
function pintaFicha(valor, color){
    this.valor      = valor;
    this.color      = color;
    ctx.font        = "bold 50px Shojumaru";
    ctx.fillStyle   = color;
    ctx.fillText(valor,this.x+15,this.y+45);
}

/**
 * Funcion que inicia la matriz del juego
 */
function iniciaMatriz(){
    let index = 0;
    let ren = 0;
    let col = 0;

    let cx = 0; // centro de las x
    let cy = 0; // Centro de las y

	// Se crea la matriz
    for(let i=2; i<ancho; i+=xDif+1){
        for(let j=2; j<alto; j+=yDif+1){
            fichas_Matrix[col][ren] = new Ficha(i+cx, j+cy,index,col,ren);
            fichas_Matrix[col][ren].valor="";
            index ++;                                         
            col++;
        }
        col = 0;

        ren++;
        
    }
    return true;
}

function ajusta(xx,yy){
    var posCanvas = canvas.getBoundingClientRect();
    var x = xx-posCanvas.left;
    var y = yy-posCanvas.top;
    return {x:x,y:y}
}

/**
 * Selector en elt ablero
 * @param {*} e 
 */
function selecciona(e){
    canvas.removeEventListener("click",selecciona,false);
    
    var pos = ajusta(e.clientX, e.clientY);
    var x   = pos.x;
    var y   = pos.y;
    console.log("Clic X = " + x + " Y = " + y);
    let cx = xDif; // centro de las x
    let cy = yDif; // Centro de las y
    var ficha;

    // Para Cada Ficha
    for(var i=0; i<fichas_Matrix.length; i++){
        for(var j=0; j<fichas_Matrix[i].length; j++){
            ficha = fichas_Matrix[i][j];
            // Si se encuentra dentro del rango permitido
            if( (x>=ficha.x) && (x<ficha.x+cx) && (y>=ficha.y) && (y<ficha.y+cy) ){
                 if(ficha.valor == ""){
                    if (turn) {//Jugador 1
                        turn = false;
                        xColor=cJ1.value;
                        
                        columnCheck(ficha,cJ1.value);
                        
                        break;
                    }else{// turno false Jugador 2
                        turn = true;
                        xColor=cJ2.value;
                        columnCheck(ficha,cJ2.value);
                        break;
                    }
                }
            }
        }
    }

    canvas.addEventListener("click",selecciona,false);
}

//ESTAS PASANDOLE LA QUE PRESIONAS
function columnCheck(fichaPress){
    if (fichaPress.ren == 7){
        fichaPress.pinta("O",xColor);
        fichaPress.color = xColor;
        gameCheck(fichaPress);
    }else{
        let fichaAbajo = fichas_Matrix[fichaPress.ren+1][fichaPress.col];
        if(fichaAbajo.valor != ""){
            fichaPress.pinta("O",xColor);
            fichaPress.color = xColor;
            gameCheck(fichaPress);
        }else{
            columnCheck(fichaAbajo);
        }
    }
}

function gameCheck(fichaPress){
    let winner=0;
   
    if(horizontalCheck(fichaPress) || verticalCheck(fichaPress) || leftDiagonalCheck(fichaPress) ||rightDiagonalCheck(fichaPress) ){
        if (turn) {
            alert("Ha ganado " + localStorage.getItem("nJ2"));
            limpia();
            scoreP2++;
            sJ2.innerHTML=scoreP2;
        }else{
            alert("Ha ganado " + localStorage.getItem("nJ1"));
            limpia();
            scoreP1++;
            sJ1.innerHTML=scoreP1;
        }
    }    
}

function limpia(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pintaTablero();
    iniciaMatriz();

}

function rightDiagonalCheck(fichaT){
    let ganador = 0;
    let cont = 0 ;
    let i=fichaT.ren+3;
    if (i>=filas) {
        i=filas-1;
    }
    let j=fichaT.col-3;
    if(j<0){
        j=0;
    }
    let n=fichaT.ren-3;
    if(n<0){
        n=0;
    }
    let m=fichaT.col+3;
    if(m>=columnas){
        m=columnas-1;
    }

    while(i>=n && j<=m && !ganador){

        if(fichas_Matrix[i][j].color==xColor && fichas_Matrix[i][j].color != "black"){
            cont++;

        }
        else{
            cont=0;
        }
        if (cont>=4){
            ganador=1;
        }
        i--;
        j++;
    }
    return ganador;


}

function leftDiagonalCheck(fichaT){
    let ganador = 0;
    let cont = 0 ;
    let i=fichaT.ren+3;
    if (i>=filas) {
        i=filas-1;
    }
    let j=fichaT.col+3;
    if(j>=columnas){
        j=columnas-1;
    }
    let n=fichaT.ren-3;
    if(n<0){
        n=0;
    }
    let m=fichaT.col-3;
    if(m<0){
        m=0;
    }

    while(i>=n && j>=m && !ganador){
        if(fichas_Matrix[i][j].color==xColor && fichas_Matrix[i][j].color != "black"){
            cont++;
        }
        else{
            cont=0;
        }
        if (cont>=4){
            ganador=1;
        }
        i--;
        j--;
    }
    return ganador;

}

function verticalCheck(fichaT){
    let ganador = 0;
    let cont = 0 ;
    let i=fichaT.ren+3;
    if (i>=filas) {
        i=filas-1;
    }
    while(i>=fichaT.ren && !ganador){
        if(fichas_Matrix[i][fichaT.col].color==xColor && fichas_Matrix[i][fichaT.col].color != "black"){
            cont++;
        }
        else{
            cont=0;
        }
        if (cont>=4){
            ganador=1;
        }
        i--;
    }
    return ganador;
}

function horizontalCheck(fichaT){
     //horizontal
    let ganador = 0;
    let cont = 0;
    let i = fichaT.col-3;//Nos movemos 3 espacios a la izquierda
    if(i < 0){
        i=0;
    }

    let j = fichaT.col+3;//No movemos 3 espacios a la derecha
    if(j >= columnas){
        j = columnas-1;
    }
    
    while(i<=j && !ganador){//Evaluamos la linea  horizontal desde i hasta j
        if(fichas_Matrix[fichaT.ren][i].color==xColor && fichas_Matrix[fichaT.ren][i].color!="black"){
            cont++;
        }
        else{
            cont=0;
        }
        if (cont>=4){
            ganador=1;
        }
        i++;
    }
    return ganador;
}

function changeProfileElements(){
    // Obtenemos ColorPickers
    // De Cada Jugador
    cJ1 = document.getElementById("colorJ1")
    cJ2 = document.getElementById("colorJ2")

    //Obtenemos las labels para saber a quien le toca
    tJ1 = document.getElementById("tJ1");
    tJ2 = document.getElementById("tJ2");

    //Obtenemos las labels de las puntaciones
    sJ1 = document.getElementById("PJ1");
    sJ2 = document.getElementById("PJ2");

    nJ1 = document.getElementById("nJ1");
    nJ2 = document.getElementById("nJ2");

    profileColors = document.getElementsByClassName("profileColor");
    buttons = document.getElementsByClassName("buttons");

    nJ1.innerHTML = localStorage.getItem("nJ1");//Asignamos nombres
    nJ2.innerHTML = localStorage.getItem("nJ2");
    
    cJ1.value = localStorage.getItem("cJ1");
    cJ2.value = localStorage.getItem("cJ2");
    
    cJ1.style.visibility = "hidden";
    cJ2.style.visibility = "hidden";
    
    profileColors[0].classList.add("conectaCircleProfile");
    profileColors[0].style.color=cJ1.value;
    profileColors[1].classList.add("conectaCircleProfile");
    profileColors[1].style.color=cJ2.value;

    buttons[0].onclick= function(){
        limpia();
        scoreP1=0;
        scoreP2=0;
        sJ2.innerHTML=scoreP2;
        sJ1.innerHTML=scoreP1;
    }

    buttons[1].onclick = function(){
        location.href='index.html';
    }
}


iniciar();