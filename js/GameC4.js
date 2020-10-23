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

/**
 * 
 * Configuracion del Juego
 * 
 */
// Arreglos del juego
var fichas_array;
var conectaMatrix ;

// Constantes de la matriz
const SIZE_MATRIX_X = columnas;
const SIZE_MATRIX_Y = filas;
const TOTAL_SIZE    = SIZE_MATRIX_X * SIZE_MATRIX_Y;
const SIZE_FICHA    = 30;

// Fichas
var fichas_X    = 0;
var fichas_O    = 0;

var tiradas, gameOver;

/**
 * Funcion que inicia todo 
 */
function iniciar(){
    // Pinta el tablero
    pintaTablero();

    // Inicializa la matriz
    iniciaMatriz();
    return false;
}

/**
 * Funcion encargada de pintar el tablero
 */
function pintaTablero(){
    // Optiene el canvas
    canvas        = document.getElementById(TABLERO_NAME);

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
 * @param {*} w width
 * @param {*} h height
 * @param {*} i indice
 * @param {*} ren renglon
 * @param {*} col Columna
 */
function Ficha(x,y,w,h,i,ren,col){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.i = i;
    this.ren = ren;
    this.col = col;
    this.peso = 0;
    this.valor = "";
    this.pinta = pintaFicha;
}

/**
 * Pinta una Ficha dado un valor String
 * pintaFicha ("o");
 * @param {*} valor String
 */
function pintaFicha(valor){
    this.valor = valor;
    ctx.font = "bold 100px Arial";
    ctx.fillStyle = colorGato;
    ctx.fillText(valor,this.x+30,this.y+100,this.w,this.h);
}

/**
 * Funcion que inicia la matriz del juego
 */
function iniciaMatriz(){
	// Se crea la matriz
    for(let i=0; i<TOTAL_SIZE; i++) {
        for(let i=0; i<SIZE_MATRIX_X; i++){
            for(let j=0; j<SIZE_MATRIX_Y; j++){
                fichas_array.push(new Ficha(200, 20,SIZE_FICHA,SIZE_FICHA,i,0,0));
            }
        }
        
    }
    return true;
}


/**
 * Convierte las coordenadas relativas del canvas al tablero
 * @param {*} xx 
 * @param {*} yy 
 */
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
    var x = pos.x;
    var y = pos.y;
    var ficha;
    for(var i=0; i<fichas_array.length; i++){
        ficha = fichas_array[i];
        if( (x>ficha.x) && (x<ficha.x+ficha.w) && (y>ficha.y) && (y<ficha.y+ficha.h) ){
            if(ficha.valor == ""){
                tiradas++;
                break;
            }
        }
    }
    if(i<fichas_array.length){
        if(ficha.valor == ""){
            ficha.pinta("X");
            verifica(false);
            if(!gameOver){
                console.log("String String puto");
            }
        }
    }else{
        canvas.addEventListener("click",selecciona,false);
    }
}

function ObtenerCoords(event){
    var x = new Number();
    var y = new Number();

    if (event.x != undefined && event.y != undefined){
        x = event.x;
        y = event.y;
    }else{// Firefox
        x = event.clientX + document.body.scrollLeft +
        document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop +
        document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    return {
        x,y
    }
}

tamC=1;

function tache(){
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px+100,py+100);
    ctx.stroke();
}

function circulo(){
    ctx.beginPath();
    ctx.arc((px*tamC)+(tamC*.5),(py*tamC)+(tamC*.5),tamC*.4,0,2*Math.PI);
    ctx.stroke();
}
            

function posicion(){
    var pos = ObtenerCoords(event);
    pos.x -= 350;
    pos.y -= 150;
    px = Math.trunc(pos.x/tamC);
    py = Math.trunc(pos.y/tamC);
    tache();
    circulo();
}

iniciar();