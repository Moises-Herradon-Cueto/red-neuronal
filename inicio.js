let red_final;
window.onload = () => {
    redes = crear_redes({ numeros_de_neuronas: [2, 3, 1], activacion: reLu, velocidad_de_aprendizaje: 0.5 }, 200);

    red_final = n_generaciones(redes, ejemplos_xor, 1000);

}
