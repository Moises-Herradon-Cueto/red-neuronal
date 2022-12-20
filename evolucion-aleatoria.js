/**
 * @param {opcionesRed} opciones 
 * @param {number} numero 
 * @returns {Array} una lista con "numero" redes aleatorias
 * con las mismas opciones
 */
function crear_redes(opciones, numero) {
    return Array(numero).fill().map(() => new Red(opciones));
}

/**
 * 
 * @param {Red[]} redes 
 * @param {Datos[]} datos 
 * @returns {number[]} - El error de cada red en estos datos
 */
function puntuar_redes(redes, datos) {
    return redes.map((red) => red.errores_suma(datos));
}

/**
 * 
 * @param {Red[]} redes Una lista de redes
 * @param {Datos[]} datos 
 * @returns {Red[]} La mejor red con estos datos,
 * y se completa la lista con variaciones aleatorias de
 * esta red, hasta tener el mismo número
 */
function generacion(redes, datos) {
    let numero = redes.length;
    let errores = puntuar_redes(redes, datos);
    let mejor_error = Math.min(...errores);
    console.log(`Mejor error: ${mejor_error}`);
    let mejor_i = errores.indexOf(mejor_error);
    let mejor_red = redes[mejor_i];

    let generacion_nueva = [mejor_red];
    for (let i = 1; i < numero; i++) {
        generacion_nueva.push(mejor_red.cambio_aleatorio(mejor_error));
    }

    return generacion_nueva;
}

/**
 * 
 * @param {Red[]} redes 
 * @param {Datos[]} datos 
 * @param {number} repeticiones 
 * @returns {Red} La mejor red después de un número de
 * generaciones
 */
function n_generaciones(redes, datos, repeticiones) {
    for (let i = 0; i < repeticiones; i++) {
        redes = generacion(redes, datos);
    }
    dibujar_red(redes[0]);
    return redes[0];
}