let red_final;
window.onload = () => {
    redes = crear_redes({ numeros_de_neuronas: [2, 3, 1], activacion: reLu, velocidad_de_aprendizaje: 3 }, 200);

    red_final = n_generaciones(redes, datos_xor, 1000);

    dibujar_red(red_final);
}
