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
const SIZE_MATRIX_X     = columnas;
const SIZE_MATRIX_Y     = filas;
const SIZE_FICHA_width  = xDif;
const SIZE_FICHA_height = yDif;

/* turn */
var turn    = true; // Turno
var fichas_MATRIX = [];
/**
 * Funcion que inicia todo 
 */
function iniciar(){
    
    for(let i=0;i<8;i++) fichas_MATRIX[i]=new Array(8);

    // Pinta el tablero
    pintaTablero();

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
}

/**
 * Pinta una Ficha dado un valor String
 * pintaFicha ("o");
 * @param {*} valor String
 */
function pintaFicha(valor, color){
    this.valor      = valor;
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
            fichas_MATRIX[ren][col]=new Ficha(i+cx, j+cy,index,col,ren);
            //console.log("ficha "+(index+1)+" X = "+(i+cx)+" Y = "+(j+cy));
            //(new Ficha(i+cx, j+cy,index,ren,col)).pinta("O");
            index ++;
            col++;
                
        }
        col = 0;

        ren++;
        
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
    var x   = pos.x;
    var y   = pos.y;
    console.log("Clic X = "+x+" Y = "+y);
    let cx = xDif; // centro de las x
    let cy = yDif; // Centro de las y
    var ficha;

    // Para Cada Ficha
    for(var i=0; i<fichas_MATRIX.length; i++){
        for(var j=0; j<fichas_MATRIX[i].length; j++){
            ficha = fichas_MATRIX[i][j];
            // Si se encuentra dentro del rango permitido
            if( (x>=ficha.x) && (x<ficha.x+cx) && (y>=ficha.y) && (y<ficha.y+cy) ){
                 if(ficha.valor == ""){
                    if (turn) {
                        turn = false;
                        ficha.pinta("O","blue");
                        console.log(ficha.ren + "," + ficha.col)
                        break;
                    }else{// turno false jugador 2
                        turn = true;
                        ficha.pinta("X","black");
                        console.log(ficha.ren + "," + ficha.col)
                        break;
                    }
                    
                }
            }
        }
    }

    canvas.addEventListener("click",selecciona,false);
}

/**
 * Busca la ficha y la retorna 
 * @param {*} ren Renglon
 * @param {*} col Columna
 */
function buscarFicha(ren,col){
    for(var i=0; i<fichas_array.length; i++){
        ficha = fichas_array[i];
        if(ficha.ren == ren && ficha.col == col){
            break;
        }
    }
    return ficha;
}

iniciar();