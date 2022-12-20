function crear_redes(opciones, numero) {
    return Array(numero).fill().map(() => new Red(opciones));
}

function puntuar_redes(redes, datos) {
    return redes.map((red) => red.errores_suma(datos));
}

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

function n_generaciones(redes, datos, repeticiones) {
    for (let i = 0; i < repeticiones; i++) {
        redes = generacion(redes, datos);
    }
    dibujar_red(redes[0]);
    return redes[0];
}