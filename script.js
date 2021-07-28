const precioPieza = 10;
const pagoEmbalador = 100;
const tiempoEntreLlegadas = 2;

const elemTablaUnEmbalador = document.getElementById('tablaUnEmbalador');
const elemTablaDosEmbaladores = document.getElementById('tablaDosEmbaladores');
const elemTablaResultadoFinales = document.getElementById('tablaResultados');



function obtenerMinutos() {
    let minutos = document.getElementById("selectorHoras").value;
    return minutos * 60;
}


function initButtons() {
    document.getElementById("btnResolver").addEventListener('click', () => {
        $('html, body').animate({
            scrollTop: $('section.scrolledSection').offset().top 
        }, 'slow');
        return false;
    });

    document.getElementById("btnSimular").addEventListener('click', () => {
        main();
    })
}

function crearRandoms(minutos) {
    let arrayRandoms = [];
    for(let i=0; i<4; i++) {
        let insert = [0.99];
        for(let j=0; j<minutos*2; j++) {
            let rnd = Math.random();
            insert.push(rnd);
        }
        arrayRandoms.push(insert);
    }
    return arrayRandoms;
}

function borrarRandoms(arr) {
    for(let i=0; i<arr.length; i++) {
        arr[i].splice(0,1);
    }
    return arr;
}


function actualizarReloj(tiempos) {
    let arr = [];
    for(let i=0; i<tiempos.length; i++) {
        if(!isNaN(tiempos[i])) {
            arr.push(tiempos[i]);
        }
    }
    let menor = Math.min.apply(null, arr);
    return menor;
}

function calcularTiempoPulido(random) {
    let res = Number((3 + random * (5-3)).toFixed(2));
    return res;
}

function calcularTiempoEmbalaje(random) {
    let res = Number(((-1.5) * Math.log(1 - random)).toFixed(2));
    return res;
}

function estaLibre(arrayObj) {
    for(let i=0; i<arrayObj.length; i++) {
        if(arrayObj[i].estado == 'libre') {
            return arrayObj[i];
        }
    }
}

function aumentarCola(obj) {
    if(obj.estado == 'libre') {
        obj.estado = 'ocupado';
    } else {
        obj.cola ++;
    }
    return obj;
}

function decrementarCola(obj) {
    if(obj.cola > 0) {
        obj.cola --;
    } else {
        obj.estado = 'libre';
    }
    return obj;
}


function verificarServidores(arrServidores) {
    for(let i=0; i<arrServidores.length; i++) {
        if(arrServidores[i] == estaLibre(arrServidores)) {
            aumentarCola(arrServidores[i]);
            return arrServidores[i];
        }
    }

    let max = 100;
    let index;
    for(let j=0; j<arrServidores.length; j++) {
        if(arrServidores[j].cola < max) {
            max = arrServidores[j].cola;
            index = j;
        }
    }
    aumentarCola(arrServidores[index]);
    return arrServidores[index];
}



function hayPiezaEsperandoPulido(arrPiezas, pulidor) {
    for(let i=0; i<arrPiezas.length; i++) {
        if(arrPiezas[i].estado == 'EP' && arrPiezas[i].colaPulidor == pulidor) return true;
    }
    return false;
}

function hayPiezaEsperandoEmbalaje(arrPiezas, embalador) {
    for(let i=0; i<arrPiezas.length; i++) {
        if(arrPiezas[i].estado == 'EE' && arrPiezas[i].colaEmbalador == embalador) return true;
    }
    return false;
}

function piezaEsperandoPulido(arrPiezas, pulidorLibre) {
    for(let i=0; i<arrPiezas.length; i++) {
        if(arrPiezas[i].estado == 'EP' && arrPiezas[i].colaPulidor == pulidorLibre) {
            arrPiezas[i].estado = 'SP';
            return arrPiezas;
        }
    }
    return arrPiezas;
}

function piezaFinalizoPulido(arrPiezas, pulidor) {
    for(let i=0; i<arrPiezas.length; i++) {
        if(arrPiezas[i].estado == 'SP' && arrPiezas[i].colaPulidor == pulidor) {
            arrPiezas[i].estado = 'EE';
            break;
        }
    }
    return arrPiezas;
}

function piezaEsperandoEmbalaje(arrPiezas, embaladorLibre) {
    for(let i=0; i<arrPiezas.length; i++) {
        if(arrPiezas[i].estado == 'EE' && arrPiezas[i].colaEmbalador == embaladorLibre) {
            arrPiezas[i].estado = 'SE';
            break;
        }
    }
    return arrPiezas;
}

function piezaFinalizoEmbalaje(arrPiezas, embalador) {
    for(let i=0; i<arrPiezas.length; i++) {
        if(arrPiezas[i].estado == 'SE' && arrPiezas[i].colaEmbalador == embalador) {
            arrPiezas[i].estado = '-';
            break;
        }
    }
    return arrPiezas;
}

function mostrarPiezas(arrPiezas) {
    for(let i=0; i<arrPiezas.length; i++) {
        console.log(`Pieza ${i+1}: ${arrPiezas[i].estado} ${arrPiezas[i].colaPulidor} ${arrPiezas[i].colaEmbalador}`);
    }
}


function cambiarDeEmbalador(arrPiezas) {
    for(let i=0; i<arrPiezas.length; i++) {
        if(arrPiezas[i].estado == 'EE') {
            arrPiezas[i].colaEmbalador = 'E2';
            break;
        }
    }
    return arrPiezas;
}


function cabeceraTablaUnEmbalador() {
    let cabecera = `<tr>
                        <th>Reloj</th>
                        <th>Tiempo llegadas</th>
                        <th>Proxima llegada</th>
                        <th>Tiempo Pulido 1</th>
                        <th>Fin Pulido 1</th>
                        <th>Tiempo Pulido 2</th>
                        <th>Fin Pulido 2</th>
                        <th>Tiempo Embalaje</th>
                        <th>Fin Embalaje</th>
                        <th>ESTADO PULIDOR 1</th>
                        <th>COLA PULIDOR 1</th>
                        <th>ESTADO PULIDOR 2</th>
                        <th>COLA PULIDOR2</th>
                        <th>ESTADO EMBALADOR</th>
                        <th>COLA EMBALADOR</th>
                        <th>Piezas Terminadas</th>
                        <th>Ganancia TOTAL</th>
                    </tr>`;

    return cabecera;
}


function cabeceraTablaDosEmbaladores() {
    let cabecera = `<tr>
                        <th>Reloj</th>
                        <th>Tiempo llegadas</th>
                        <th>Proxima llegada</th>
                        <th>Tiempo Pulido 1</th>
                        <th>Fin Pulido 1</th>
                        <th>Tiempo Pulido 2</th>
                        <th>Fin Pulido 2</th>
                        <th>Tiempo Embalaje 1</th>
                        <th>Fin Embalaje 1</th>
                        <th>Tiempo Embalaje 2</th>
                        <th>Fin Embalaje 2</th>
                        <th>ESTADO PULIDOR 1</th>
                        <th>COLA PULIDOR 1</th>
                        <th>ESTADO PULIDOR 2</th>
                        <th>COLA PULIDOR2</th>
                        <th>ESTADO EMBALADOR 1</th>
                        <th>COLA EMBALADOR 1</th>
                        <th>ESTADO EMBALADOR 2</th>
                        <th>COLA EMBALADOR 2</th>
                        <th>Piezas Terminadas</th>
                        <th>Ganancia TOTAL</th>
                    </tr>`

    return cabecera;
}


function cabeceraTablaResultadosFinales() {
    let cabecera = `<tr>
                        <th>Cantidad Embaladores</th>
                        <th>Piezas Terminadas</th>
                        <th>Ganancias de Piezas</th>
                        <th>Pago a Embaladores</th>
                        <th>GANANCIA TOTAL</th>
                    </tr>`;

    return cabecera;
}

function extraerResultadosFinales(tablaUnEmbalador, tablaDosEmbaladores) {
    let len1 = tablaUnEmbalador.length;
    let len2 = tablaDosEmbaladores.length;
    let tabla = [
                    [1, tablaUnEmbalador[len1-1][15], tablaUnEmbalador[len1-1][16], pagoEmbalador*1, tablaUnEmbalador[len1-1][16] - pagoEmbalador*1],
                    [2, tablaDosEmbaladores[len2-1][19], tablaDosEmbaladores[len2-1][20], pagoEmbalador*2, tablaDosEmbaladores[len2-1][20] - pagoEmbalador*2]
                ];

    return tabla;
}

function rellenarTabla(elem, cabecera, tabla) {
    elem.innerHTML = cabecera;
    for(let i=0; i<tabla.length; i++) {
        let cadena = `<tr>`;
        for(let j=0; j<tabla[i].length; j++) {
            if(i%2 == 0) {
                cadena += `<td>${tabla[i][j]}</td>`;
            } else {
                cadena += `<td class='filaImpar'>${tabla[i][j]}</td>`;
            }
        }
        cadena += `</tr>`;
        elem.innerHTML += cadena;
    }
    return elem;
}

function rellenarTablaResultadosFinales(elem, cabecera, tabla) {
    let arr = [tabla[tabla.length-2][4], tabla[tabla.length-1][4]];
    let mayor = Math.max.apply(null, arr);
    elem.innerHTML = cabecera;
    for(let i=0; i<tabla.length; i++) {
        let cadena = `<tr>`;
        for(let j=0; j<tabla[i].length; j++) {
            if(tabla[i][4] == mayor) {
                cadena += `<td class='mejorOpcion'>${tabla[i][j]}</td>`;
            } else {
                cadena += `<td>${tabla[i][j]}</td>`;
            }
        }
        cadena += `</tr>`;
        elem.innerHTML += cadena;
    }
    return elem;
}


class Pieza {
    constructor(estado, colaPulidor, colaEmbalador) {
        this.estado = estado;
        this.colaPulidor = colaPulidor;
        this.colaEmbalador = colaEmbalador;
    }
}

class Servidor {
    constructor(estado, cola) {
        this.estado = estado;
        this.cola = cola;
    }
}




function simularUnEmbalador(minutos, minutoDesde, minutoHasta) {
    let randoms = crearRandoms(minutos);
    let tablaTotal = [];
    let tablaParcial = [new Array(17).fill(0), new Array(17).fill(0)];
    let reloj = 0;
    let proximaLlegada = 0;
    let tiempoPulido1 = '-';
    let finPulido1 = '-';
    let tiempoPulido2 = '-';
    let finPulido2 = '-';
    let tiempoEmbalaje = '-';
    let finEmbalaje = '-';
    let estadoPulidor1 = 'libre';
    let colaPulidor1 = 0;
    let estadoPulidor2 = 'libre';
    let colaPulidor2 = 0;
    let estadoEmbalador = 'libre';
    let colaEmbalador = 0;
    let arrayTiempos = [proximaLlegada, finPulido1, finPulido2, finEmbalaje];
    
    let piezasTerminadas = 0;
    let gananciaAcumulada = 0;
    
    let pulidor1 = new Servidor(estadoPulidor1, colaPulidor1);
    let pulidor2 = new Servidor(estadoPulidor2, colaPulidor2);
    let embalador = new Servidor(estadoEmbalador, colaEmbalador);
    
    let arrayPiezas = [];
    let arrayPulidores = [pulidor1, pulidor2];
    let arrayEmbaladores = [embalador];
    
    while(reloj < minutos) {
        reloj = actualizarReloj(arrayTiempos);
        console.log(`RELOJ: ${reloj}`);
        
        
        if(reloj == 0) {
            proximaLlegada = Number((reloj + tiempoEntreLlegadas).toFixed(2));
        }
        
        if(reloj == proximaLlegada) { 
            proximaLlegada = Number((reloj + tiempoEntreLlegadas).toFixed(2));
            let pulidorModificado = verificarServidores(arrayPulidores);
            
            if(pulidorModificado == pulidor1) { 
                arrayPiezas.push(new Pieza('EP', 'P1', 'E1'));
            } else if(pulidorModificado == pulidor2) {
                arrayPiezas.push(new Pieza('EP', 'P2', 'E1'));
            }
            
            if(finPulido1 == '-' && hayPiezaEsperandoPulido(arrayPiezas, 'P1')) {
                arrayPiezas = piezaEsperandoPulido(arrayPiezas, 'P1');
                tiempoPulido1 = calcularTiempoPulido(randoms[0][0]);
                finPulido1 = Number((reloj + tiempoPulido1).toFixed(2));
                
            }
            if(finPulido2 == '-' && hayPiezaEsperandoPulido(arrayPiezas, 'P2')) {
                arrayPiezas = piezaEsperandoPulido(arrayPiezas, 'P2');
                tiempoPulido2 = calcularTiempoPulido(randoms[1][0]);
                finPulido2 = Number((reloj + tiempoPulido2).toFixed(2));
            }
            
            
        } 
        
        
        if(reloj == finPulido1) {
            decrementarCola(pulidor1);
            piezaFinalizoPulido(arrayPiezas, 'P1');
            verificarServidores(arrayEmbaladores);
            
            if(hayPiezaEsperandoPulido(arrayPiezas, 'P1')) {
                arrayPiezas = piezaEsperandoPulido(arrayPiezas, 'P1');
                tiempoPulido1 = calcularTiempoPulido(randoms[0][0]);
                finPulido1 = Number((reloj + tiempoPulido1).toFixed(2));
            } else {
                tiempoPulido1 = '-';
                finPulido1 = '-';
            }
            
            if(finEmbalaje == '-' && hayPiezaEsperandoEmbalaje(arrayPiezas, 'E1')) {
                arrayPiezas = piezaEsperandoEmbalaje(arrayPiezas, 'E1');
                tiempoEmbalaje = calcularTiempoEmbalaje(randoms[2][0]);
                finEmbalaje = Number((reloj + tiempoEmbalaje).toFixed(2));
            }
        }
        
        if(reloj == finPulido2) {
            decrementarCola(pulidor2);
            piezaFinalizoPulido(arrayPiezas, 'P2');
            verificarServidores(arrayEmbaladores);
            
            if(hayPiezaEsperandoPulido(arrayPiezas, 'P2')) {
                arrayPiezas = piezaEsperandoPulido(arrayPiezas, 'P2');
                tiempoPulido2 = calcularTiempoPulido(randoms[0][0]);
                finPulido2 = Number((reloj + tiempoPulido2).toFixed(2)); 
            } else {
                tiempoPulido2 = '-';
                finPulido2 = '-';
            }
            
            if(finEmbalaje == '-' && hayPiezaEsperandoEmbalaje(arrayPiezas, 'E1')) {
                arrayPiezas = piezaEsperandoEmbalaje(arrayPiezas, 'E1');
                tiempoEmbalaje = calcularTiempoEmbalaje(randoms[2][0]);
                finEmbalaje = Number((reloj + tiempoEmbalaje).toFixed(2));
            }
        }
        
        if(reloj == finEmbalaje) {
            decrementarCola(embalador);
            piezaFinalizoEmbalaje(arrayPiezas, 'E1');
            
            if(hayPiezaEsperandoEmbalaje(arrayPiezas, 'E1')) {
                arrayPiezas = piezaEsperandoEmbalaje(arrayPiezas, 'E1');
                tiempoEmbalaje = calcularTiempoEmbalaje(randoms[2][0]);
                finEmbalaje = Number((reloj + tiempoEmbalaje).toFixed(2));
            } else {
                tiempoEmbalaje = '-';
                finEmbalaje = '-';
            }
            
            piezasTerminadas++;
            gananciaAcumulada += precioPieza;
        }
        
        mostrarPiezas(arrayPiezas);
        // console.log(pulidor1);
        // console.log(pulidor2);
        // console.log(embalador);
        // console.log(randoms);
        
        randoms = borrarRandoms(randoms);
        
        arrayTiempos = [proximaLlegada, finPulido1, finPulido2, finEmbalaje];
        
        // console.log(proximaLlegada, finPulido1, finPulido2, finEmbalaje);
        console.log('-----------------------')
        let filaTabla = [reloj, tiempoEntreLlegadas, proximaLlegada, tiempoPulido1, finPulido1, tiempoPulido2, finPulido2, tiempoEmbalaje, finEmbalaje, pulidor1.estado, pulidor1.cola, pulidor2.estado, pulidor2.cola, embalador.estado, embalador.cola, piezasTerminadas, gananciaAcumulada];
        tablaParcial.splice(0, 1);
        tablaParcial.push(filaTabla);
        console.log(tablaParcial);
        
        if(reloj >= minutoDesde && reloj <= minutoHasta || reloj == minutos) {
            tablaTotal.push(filaTabla);
        }

    }
    console.log(`PIEZAS TERMINADAS: ${piezasTerminadas} / GANANCIA: ${gananciaAcumulada}`);
    return tablaTotal;
}



function simularDosEmbaladores(minutos, minutoDesde, minutoHasta) {
    let randoms = crearRandoms(minutos);
    let tablaTotal = [];
    let tablaParcial = [new Array(17).fill(0), new Array(17).fill(0)];
    let reloj = 0;
    let proximaLlegada = 0;
    let tiempoPulido1 = '-';
    let finPulido1 = '-';
    let tiempoPulido2 = '-';
    let finPulido2 = '-';
    let tiempoEmbalaje1 = '-';
    let finEmbalaje1 = '-';
    let tiempoEmbalaje2 = '-';
    let finEmbalaje2 = '-';
    let estadoPulidor1 = 'libre';
    let colaPulidor1 = 0;
    let estadoPulidor2 = 'libre';
    let colaPulidor2 = 0;
    let estadoEmbalador1 = 'libre';
    let colaEmbalador1 = 0;
    let estadoEmbalador2 = 'libre';
    let colaEmbalador2 = 0;
    let arrayTiempos = [proximaLlegada, finPulido1, finPulido2, finEmbalaje1, finEmbalaje2];
    
    let piezasTerminadas = 0;
    let gananciaAcumulada = 0;
    
    let pulidor1 = new Servidor(estadoPulidor1, colaPulidor1);
    let pulidor2 = new Servidor(estadoPulidor2, colaPulidor2);
    let embalador1 = new Servidor(estadoEmbalador1, colaEmbalador1);
    let embalador2 = new Servidor(estadoEmbalador2, colaEmbalador2);
    
    let arrayPiezas = [];
    let arrayPulidores = [pulidor1, pulidor2];
    let arrayEmbaladores = [embalador1, embalador2];
    
    while(reloj < minutos) {
        reloj = actualizarReloj(arrayTiempos);
        console.log(`RELOJ: ${reloj}`);
        
        
        if(reloj == 0) {
            proximaLlegada = Number((reloj + tiempoEntreLlegadas).toFixed(2));
        }
        
        if(reloj == proximaLlegada) { 
            proximaLlegada = Number((reloj + tiempoEntreLlegadas).toFixed(2));
            let pulidorModificado = verificarServidores(arrayPulidores);
            
            if(pulidorModificado == pulidor1) { 
                arrayPiezas.push(new Pieza('EP', 'P1', 'E1'));
            } else if(pulidorModificado == pulidor2) {
                arrayPiezas.push(new Pieza('EP', 'P2', 'E1'));
            }
            
            if(finPulido1 == '-' && hayPiezaEsperandoPulido(arrayPiezas, 'P1')) {
                arrayPiezas = piezaEsperandoPulido(arrayPiezas, 'P1');
                tiempoPulido1 = calcularTiempoPulido(randoms[0][0]);
                finPulido1 = Number((reloj + tiempoPulido1).toFixed(2));
                
            }
            if(finPulido2 == '-' && hayPiezaEsperandoPulido(arrayPiezas, 'P2')) {
                arrayPiezas = piezaEsperandoPulido(arrayPiezas, 'P2');
                tiempoPulido2 = calcularTiempoPulido(randoms[1][0]);
                finPulido2 = Number((reloj + tiempoPulido2).toFixed(2));
            }
            
        } 
        
        
        if(reloj == finPulido1) {
            decrementarCola(pulidor1);
            piezaFinalizoPulido(arrayPiezas, 'P1');
            let embaladorModificado = verificarServidores(arrayEmbaladores);
            
            if(hayPiezaEsperandoPulido(arrayPiezas, 'P1')) {
                arrayPiezas = piezaEsperandoPulido(arrayPiezas, 'P1');
                tiempoPulido1 = calcularTiempoPulido(randoms[0][0]);
                finPulido1 = Number((reloj + tiempoPulido1).toFixed(2));
            } else {
                tiempoPulido1 = '-';
                finPulido1 = '-';
            }

            // if(embaladorModificado == embalador1) {
            //     arrayPiezas = piezaEsperandoEmbalaje(arrayPiezas, 'E1');
            //     tiempoEmbalaje1 = calcularTiempoEmbalaje(randoms[2][0]);
            //     finEmbalaje1 = Number((reloj + tiempoEmbalaje1).toFixed(2));
            // } else {
            //     cambiarDeEmbalador(arrayPiezas);
            //     arrayPiezas = piezaEsperandoEmbalaje(arrayPiezas, 'E2');
            //     tiempoEmbalaje2 = calcularTiempoEmbalaje(randoms[3][0]);
            //     finEmbalaje2 = Number((reloj + tiempoEmbalaje2).toFixed(2));
            // }

            if(embaladorModificado != embalador1) {
                cambiarDeEmbalador(arrayPiezas);
            }
            
            if(finEmbalaje1 == '-' && hayPiezaEsperandoEmbalaje(arrayPiezas, 'E1')) {
                arrayPiezas = piezaEsperandoEmbalaje(arrayPiezas, 'E1');
                tiempoEmbalaje1 = calcularTiempoEmbalaje(randoms[2][0]);
                finEmbalaje1 = Number((reloj + tiempoEmbalaje1).toFixed(2));
            }
            if(finEmbalaje2 == '-' && hayPiezaEsperandoEmbalaje(arrayPiezas, 'E2')) {
                arrayPiezas = piezaEsperandoEmbalaje(arrayPiezas, 'E2');
                tiempoEmbalaje2 = calcularTiempoEmbalaje(randoms[3][0]);
                finEmbalaje2 = Number((reloj + tiempoEmbalaje2).toFixed(2));
            }
            
        }
        
        if(reloj == finPulido2) {
            decrementarCola(pulidor2);
            piezaFinalizoPulido(arrayPiezas, 'P2');
            let embaladorModificado = verificarServidores(arrayEmbaladores);
            
            if(hayPiezaEsperandoPulido(arrayPiezas, 'P2')) {
                arrayPiezas = piezaEsperandoPulido(arrayPiezas, 'P2');
                tiempoPulido2 = calcularTiempoPulido(randoms[0][0]);
                finPulido2 = Number((reloj + tiempoPulido2).toFixed(2)); 
            } else {
                tiempoPulido2 = '-';
                finPulido2 = '-';
            }

            // if(embaladorModificado == embalador1) {
            //     arrayPiezas = piezaEsperandoEmbalaje(arrayPiezas, 'E1');
            //     tiempoEmbalaje1 = calcularTiempoEmbalaje(randoms[2][0]);
            //     finEmbalaje1 = Number((reloj + tiempoEmbalaje1).toFixed(2));
            // } else {
            //     cambiarDeEmbalador(arrayPiezas);
            //     arrayPiezas = piezaEsperandoEmbalaje(arrayPiezas, 'E2');
            //     tiempoEmbalaje2 = calcularTiempoEmbalaje(randoms[3][0]);
            //     finEmbalaje2 = Number((reloj + tiempoEmbalaje2).toFixed(2));
            // }

            if(embaladorModificado != embalador1) {
                cambiarDeEmbalador(arrayPiezas);
            }
            
            if(finEmbalaje1 == '-' && hayPiezaEsperandoEmbalaje(arrayPiezas, 'E1')) {
                arrayPiezas = piezaEsperandoEmbalaje(arrayPiezas, 'E1');
                tiempoEmbalaje1 = calcularTiempoEmbalaje(randoms[2][0]);
                finEmbalaje1 = Number((reloj + tiempoEmbalaje1).toFixed(2));
            }
            if(finEmbalaje2 == '-' && hayPiezaEsperandoEmbalaje(arrayPiezas, 'E2')) {
                arrayPiezas = piezaEsperandoEmbalaje(arrayPiezas, 'E2');
                tiempoEmbalaje2 = calcularTiempoEmbalaje(randoms[3][0]);
                finEmbalaje2 = Number((reloj + tiempoEmbalaje2).toFixed(2));
            }
            
        }
        
        if(reloj == finEmbalaje1) {
            decrementarCola(embalador1);
            piezaFinalizoEmbalaje(arrayPiezas, 'E1');
            
            if(hayPiezaEsperandoEmbalaje(arrayPiezas, 'E1')) {
                arrayPiezas = piezaEsperandoEmbalaje(arrayPiezas, 'E1');
                tiempoEmbalaje1 = calcularTiempoEmbalaje(randoms[2][0]);
                finEmbalaje1 = Number((reloj + tiempoEmbalaje1).toFixed(2));
            } else {
                tiempoEmbalaje1 = '-';
                finEmbalaje1 = '-';
            }
            
            piezasTerminadas++;
            gananciaAcumulada += precioPieza;
        }

        if(reloj == finEmbalaje2) {
            decrementarCola(embalador2);
            piezaFinalizoEmbalaje(arrayPiezas, 'E2');
            
            if(hayPiezaEsperandoEmbalaje(arrayPiezas, 'E2')) {
                arrayPiezas = piezaEsperandoEmbalaje(arrayPiezas, 'E2');
                tiempoEmbalaje2 = calcularTiempoEmbalaje(randoms[3][0]);
                finEmbalaje2 = Number((reloj + tiempoEmbalaje2).toFixed(2));
            } else {
                tiempoEmbalaje2 = '-';
                finEmbalaje2 = '-';
            }
            
            piezasTerminadas++;
            gananciaAcumulada += precioPieza;
        }
        
        mostrarPiezas(arrayPiezas);
        // console.log(pulidor1);
        // console.log(pulidor2);
        // console.log(embalador1);
        // console.log(embalador2);
        
        randoms = borrarRandoms(randoms);
        
        arrayTiempos = [proximaLlegada, finPulido1, finPulido2, finEmbalaje1, finEmbalaje2];
        
        // console.log(proximaLlegada, finPulido1, finPulido2, finEmbalaje1, finEmbalaje2);
        console.log('-----------------------')
        let filaTabla = [reloj, tiempoEntreLlegadas, proximaLlegada, tiempoPulido1, finPulido1, tiempoPulido2, finPulido2, tiempoEmbalaje1, finEmbalaje1, tiempoEmbalaje2, finEmbalaje2, pulidor1.estado, pulidor1.cola, pulidor2.estado, pulidor2.cola, embalador1.estado, embalador1.cola, embalador2.estado, embalador2.cola, piezasTerminadas, gananciaAcumulada];
        tablaParcial.splice(0, 1);
        tablaParcial.push(filaTabla);
        console.log(tablaParcial);
        
        if(reloj >= minutoDesde && reloj <= minutoHasta || reloj == minutos) {
            tablaTotal.push(filaTabla);
        }

    }
    
    console.log(`PIEZAS TERMINADAS: ${piezasTerminadas} / GANANCIA: ${gananciaAcumulada}`);
    return tablaTotal;
}


function obtenerDesdeHasta() {
    let minutoDesde = Number(document.getElementById('mostrarDesde').value);
    let minutoHasta = Number(document.getElementById('mostrarHasta').value);

    return [minutoDesde, minutoHasta];
}

function main() {
    let minutos = obtenerMinutos();
    let minutoDesde = obtenerDesdeHasta()[0];
    let minutoHasta = obtenerDesdeHasta()[1];

    let tablaUnEmbalador = simularUnEmbalador(minutos, minutoDesde, minutoHasta);
    let cabecera1 = cabeceraTablaUnEmbalador();
    rellenarTabla(elemTablaUnEmbalador, cabecera1, tablaUnEmbalador);

    let tablaDosEmbaladores = simularDosEmbaladores(minutos, minutoDesde, minutoHasta);
    let cabecera2 = cabeceraTablaDosEmbaladores();
    rellenarTabla(elemTablaDosEmbaladores, cabecera2, tablaDosEmbaladores);

    let tablaResultadosFinales = extraerResultadosFinales(tablaUnEmbalador, tablaDosEmbaladores);
    let cabecera3 = cabeceraTablaResultadosFinales();
    console.log(tablaResultadosFinales);
    rellenarTablaResultadosFinales(elemTablaResultadoFinales, cabecera3, tablaResultadosFinales);

    document.getElementById('titulo-tabla1').style.display = 'block';
    document.getElementById('titulo-tabla2').style.display = 'block';
    document.getElementById('titulo-tabla3').style.display = 'block';
}

initButtons();