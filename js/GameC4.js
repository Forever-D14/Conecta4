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
var conectaMatrix = [];

// Constantes de la matriz
const SIZE_MATRIX_X = columnas;
const SIZE_MATRIX_Y = filas;

// Fichas
var fichas_X    = 0;
var fichas_O    = 0;

var tiradas, gameOver;

/**
 * Funcion que inicia todo 
 */
function iniciar(){
    // Optiene el canvas
    canvas        = document.getElementById(TABLERO_NAME);

    // Pone ancho y alto del canvas
    canvas.width  = ancho;
    canvas.height = alto;

    ctx = canvas.getContext("2d");

    // Pinta el tablero
    pintaTablero();

    // Inicializa la matriz
    inicializaMatrix();
    return false;
}

/**
 * Funcion encargada de pintar el tablero
 */
function pintaTablero(){
    ctx.fillStyle   = colorCanvas;
    ctx.strokeStyle = colorGato;
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

function inicializaMatrix(){
	let movX = 0;
	let movY = 0;
	// Se crea la matriz
    for(let i=0; i<SIZE_MATRIX_X; i++) {
        conectaMatrix[i] = new Array(SIZE_MATRIX_Y);
    }

    // llena la matriz en 0s
	for(let i=0; i<SIZE_MATRIX_X; i++){
    	for(let j=0; j<SIZE_MATRIX_Y; j++){
    		conectaMatrix[i][j] = 0;
    	}
    }
    return true;
}

function ObtenerCoords(event){
    var x = new Number();
    var y = new Number();
    //     var canvas = document.getElementById("canvas_1");

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
    var pos=ObtenerCoords(event);
    pos.x-=350;
    pos.y-=150;
    px = Math.trunc(pos.x/tamC);
    py = Math.trunc(pos.y/tamC);
    tache();
    circulo();
}

iniciar();