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
var profileColors//Colores del perfil
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
            fichas_MATRIX[col][ren]=new Ficha(i+cx, j+cy,index,col,ren);//Aqui lo cambie las variables por que de alguna manera,
            index ++;                                                   //Generaba la matriz de lado xd 
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
    for(var i=0; i<fichas_MATRIX.length; i++){
        for(var j=0; j<fichas_MATRIX[i].length; j++){
            ficha = fichas_MATRIX[i][j];
            // Si se encuentra dentro del rango permitido
            if( (x>=ficha.x) && (x<ficha.x+cx) && (y>=ficha.y) && (y<ficha.y+cy) ){
                 if(ficha.valor == ""){
                    if (turn) {//Jugador 1
                        turn = false;
                        xColor=cJ1.value;
                        
                        columnCheck(ficha,cJ1.value);
                        gameCheck(ficha);
                        break;
                    }else{// turno false Jugador 2
                        turn = true;
                        xColor=cJ2.value;
                        columnCheck(ficha,cJ2.value);
                        gameCheck(ficha);
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
    
    if (fichaPress.ren==7){
        fichaPress.pinta("O",xColor);
        fichaPress.color=xColor;
    }else{
        let fichaAbajo = fichas_MATRIX[fichaPress.ren+1][fichaPress.col];
        if(fichaAbajo.valor!=""){
                fichaPress.pinta("O",xColor);
                fichaPress.color = xColor;
            }else{
                columnCheck(fichaAbajo);
            }

        }
}

function gameCheck(fichaPress){
    let ganador=0;
    let cont=0;
    //horizontal
    let i = fichaPress.col-3;
    if(i<0)i=0;
    let j = fichaPress.col+3;
    if(j>=columnas)j=columnas-1;
    while(i<j && !ganador){
        if(fichas_MATRIX[fichaPress.ren][i].color==xColor && fichas_MATRIX[fichaPress.ren][i].color!="black"){
            cont++;
            console.log("Si");
             console.log(fichas_MATRIX[fichaPress.ren][i].color + "" + xColor +" SI" + fichaPress.color);
        }
        else{
            cont=0;
            console.log(fichas_MATRIX[fichaPress.ren][i].color + "" + xColor +" NO" + fichaPress.color);
        }
        if (cont>=4){
            ganador=1;
            console.log("GANA");
        }
        i++;
    }
    return ganador;


}

function changeProfileElements(){
    cJ1=document.getElementById("colorJ1")//Obtenemos ColorPickers
    cJ2=document.getElementById("colorJ2")  

    tJ1=document.getElementById("tJ1");//Obtenemos las labels para saber a quien le toca
    tJ2=document.getElementById("tJ2");

    sJ1=document.getElementById("PJ1");//Obtenemos las labels de las puntaciones
    sJ2=document.getElementById("PJ2");

    nJ1=document.getElementById("nJ1");
    nJ2=document.getElementById("nJ2");

    profileColors=document.getElementsByClassName("profileColor")

    nJ1.innerHTML=localStorage.getItem("nJ1");//Asignamos nombres
    nJ2.innerHTML=localStorage.getItem("nJ2");
    
    cJ1.value=localStorage.getItem("cJ1");
    cJ2.value=localStorage.getItem("cJ2");
    
    cJ1.style.visibility="hidden";
    cJ2.style.visibility="hidden";
    
    profileColors[0].classList.add("conectaCircleProfile");
    profileColors[0].style.color=cJ1.value;
    profileColors[1].classList.add("conectaCircleProfile");
    profileColors[1].style.color=cJ2.value;
}


iniciar();