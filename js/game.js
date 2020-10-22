/** Configuraciones */
var ctx, canvas;
var tiradas, gameOver;
var fichas_array;
var TABLERO_NAME = "conecta4Tablero"; // ID del canvas

// Anchos del tablero
var ancho       = 800;
var alto        = 480;

// Color del canvas
var colorGato   = "black";
var colorCanvas = "black";

// Renglones y columnas
var COLUMNAS    = 3;
var RENGLONES   = 3;

var fichas_X    = 0;
var fichas_O    = 0;

var largo       = 120;

/**
 * Funcion inciar el juego
 */
function iniciar(){
    canvas        = document.getElementById(TABLERO_NAME);
    canvas.width  = ancho;
    canvas.height = alto;
    if(canvas && canvas.getContext){
        ctx = canvas.getContext("2d");
        if(ctx){
            canvas.removeEventListener("click",iniciar,false);
            fichas_array = [];
            gameOver     = false;
            tiradas      = 0;

            //Pinta el tablero
            gato();
            mensaje("Jugador1");
            canvas.addEventListener("click",selecciona,false);
        }else{
            document.write("Tu navegador no soporta canvas");
        }
    }
}

/**
 * Crea el tablero de gato
 */
function gato(){
    ctx.fillStyle   = colorCanvas;
    ctx.strokeStyle = colorGato;
    ctx.lineWidth   = 20;

    /* Dibujar el # */
    ctx.beginPath();
    ctx.moveTo(330,20);
    ctx.lineTo(330,420);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(470,20);
    ctx.lineTo(470,420);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(200,150);
    ctx.lineTo(600,150);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(200,290);
    ctx.lineTo(600,290);
    ctx.stroke();

    /* Creacion de las cassillas para las fichas */
    fichas_array.push(new Ficha(200, 20,largo,largo,0,0,0));
    fichas_array.push(new Ficha(330, 20,largo,largo,1,0,1));
    fichas_array.push(new Ficha(470, 20,largo,largo,2,0,2));

    fichas_array.push(new Ficha(200,150,largo,largo,3,1,0));
    fichas_array.push(new Ficha(330,150,largo,largo,4,1,1));
    fichas_array.push(new Ficha(470,150,largo,largo,5,1,2));

    fichas_array.push(new Ficha(200,290,largo,largo,6,2,0));
    fichas_array.push(new Ficha(330,290,largo,largo,7,2,1));
    fichas_array.push(new Ficha(470,290,largo,largo,8,2,2));
}

/**
 * Constructor de Ficha
 * @param {*} x 
 * @param {*} y 
 * @param {*} w 
 * @param {*} h 
 * @param {*} i 
 * @param {*} ren 
 * @param {*} col 
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
 * Pinta Ficha
 * @param {*} valor 
 */
function pintaFicha(valor){
    this.valor=valor;
    ctx.font="bold 100px Arial";
    ctx.fillStyle=colorGato;
    ctx.fillText(valor,this.x+30,this.y+100,this.w,this.h);
}

/**
 * Escribe debajo de tablero un mensaje
 * @param {*} cadena 
 */
function mensaje(cadena){
    var lon = (canvas.width-(25*cadena.length))/2;
    ctx.strokeStyle = colorGato;
    ctx.clearRect(0,420,canvas.width,100);
    ctx.font = "bold 40px Courier";
    ctx.fillText(cadena,lon,470);
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
                mensaje("Jugador2");
                setTimeout(tiraMaquina,1000);
            }
        }
    }else{
        canvas.addEventListener("click",selecciona,false);
    }
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
 * Tiradas Maquina
 */
function tiraMaquina(){
    tiradas++;

    if(gameOver == false){
        verifica(true);
        //Busqueda por grafos
        var mejorJugada = 0;
        var posibilidades = [];
        for(var i=0; i<fichas_array.length; i++){
            ficha = fichas_array[i];
            if(ficha.peso > mejorJugada){
                mejorJugada = ficha.peso;
                posibilidades=[];
                posibilidades.push(i);

                //ii=i;
            }else if (ficha.peso == mejorJugada){
                posibilidades.push(i);
            }
        }

        elegir = Math.floor(Math.random()*(posibilidades.length-1));
        ii = posibilidades[elegir];
        ficha = fichas_array[ii];
        ficha.pinta("O");

        verifica(false);
        if(!gameOver){
            canvas.addEventListener("click",selecciona,false);
        }
    }
}

/**
 * Puntaje para mejor punto
 * Utilizando grafos con peso
 * @param {*} i 
 * @param {*} fichas_O 
 * @param {*} fichas_X 
 */
function pesoFicha(i,fichas_O,fichas_X){
    ficha = fichas_array[i];
    if(ficha.valor == ""){
        // Para ganar
        if(fichas_O==2 && fichas_X == 0){
            if(ficha.peso<10) ficha.peso = 10;
        }
        // Para no perder
        else if(fichas_O == 0 && fichas_X==2){
            if(ficha.peso< 6) ficha.peso = 6;
        }
        // Para intentar ganar
        else if (fichas_O == 1 && fichas_X == 0){
            if(ficha.peso< 3) ficha.peso = 3;
        // Para poner ficha sin importancia.
        }else{
            if(ficha.peso< 1) ficha.peso =1;
        }
    }else{
        ficha.peso =0;
    }
}

/**
 * Verificador del tablero
 * @param {*} calculaPeso 
 */
function verifica(calculaPeso){
    verificaRenglones(calculaPeso);
    verificaColumnas(calculaPeso);
    verificaDiagonal1(calculaPeso);
    verificaDiagonal2(calculaPeso);
}

/**
 * Comprueba los renglones
 * @param {*} calculaPeso 
 */
function verificaRenglones(calculaPeso){
    if(gameOver == false){
        for(i=0; i<RENGLONES; i++){
            fichas_X=0;
            fichas_O=0;
            for(j=0; j<COLUMNAS; j++){
                ficha = buscarFicha(i,j);
                fichas_X += (ficha.valor=="X"?1:0);
                fichas_O += (ficha.valor=="O"?1:0);
            }
            if(calculaPeso){
                for(j=0; j<COLUMNAS; j++){
                    ficha=buscarFicha(i,j);
                    pesoFicha(ficha.i,fichas_O,fichas_X);
                }
            }
            gameOver=verificaFin(fichas_O,fichas_X);
            if(gameOver) break;
        }
    }
}

/**
 * Comprovador en las columnas
 * @param {*} calculaPeso 
 */
function verificaColumnas(calculaPeso){
    if(gameOver == false){
        for(j=0; j<COLUMNAS; j++){
            fichas_X = 0;
            fichas_O = 0;
            for(i=0; i<RENGLONES; i++){
                ficha = buscarFicha(i,j);
                fichas_X += (ficha.valor=="X"?1:0);
                fichas_O += (ficha.valor=="O"?1:0);
            }
            if(calculaPeso){
                for(i=0; i<RENGLONES; i++){
                    ficha = buscarFicha(i,j);
                    pesoFicha(ficha.i,fichas_O,fichas_X);
                }
            }
            gameOver = verificaFin(fichas_O,fichas_X);
            if(gameOver) break;
        }
    }
}

/**
 * Comprovando diagonal
 * @param {*} calculaPeso 
 */
function verificaDiagonal1(calculaPeso){
    if(gameOver == false){
        fichas_X = 0;
        fichas_O = 0;
        for(var i=0; i<RENGLONES; i++){
            ficha = buscarFicha(i,i);
            fichas_X += (ficha.valor=="X"?1:0);
            fichas_O += (ficha.valor=="O"?1:0);
        }

        if(calculaPeso){
            for(i=0; i<RENGLONES; i++){
                ficha = buscarFicha(i,i);
                pesoFicha(ficha.i,fichas_O,fichas_X);
            }
        }
        gameOver=verificaFin(fichas_O,fichas_X);
    }
}

/**
 * Verificando riagonal izquierda
 * @param {*} calculaPeso 
 */
function verificaDiagonal2(calculaPeso){
    if(gameOver == false){
        fichas_X = 0;
        fichas_O = 0;
        j = 2;
        for(var i=0; i<RENGLONES; i++){
            ficha = buscarFicha(i,j);
            fichas_X += (ficha.valor=="X"?1:0);
            fichas_O += (ficha.valor=="O"?1:0);
            j--;
        }

        if(calculaPeso){
            j=2;
            for(i=0; i<RENGLONES; i++){
                ficha=buscarFicha(i,j);
                pesoFicha(ficha.i,fichas_O,fichas_X);
                j--;
            }
        }
        gameOver = verificaFin(fichas_O,fichas_X);
    }
}

/**
 * Busca la ficha y la retorna 
 * @param {*} ren 
 * @param {*} col 
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

/**
 * Verifica si acaba el juego
 * @param {*} O 
 * @param {*} X 
 */
function verificaFin(O,X){
    var fin = false;
    if(X == 3){
        fin = true;
        mensaje("!GANASTE!");
    }
    if(O == 3){
        fin = true;
        mensaje("¡Perdiste!");
    }

    if(!fin){
        if(tiradas<9){
            mensaje("Jugador1");
        }else{
            fin = true;
            mensaje("¡Empate!");
        }
    }

    if( fin ){
        canvas.addEventListener("click",iniciar,false);
    }
    return fin;
}