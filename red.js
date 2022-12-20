
/**@typedef {Object} opcionesRed
 * @property {number[]} numeros_de_neuronas - Número de neuronas en cada capa
 * @property {Function} activacion - Función de activación de cada neurona, por
 * ejemplo ReLu o sigmoide
 * @property {number} velocidad_de_aprendizaje - Cómo de agresivamente varían los parámetros
 */

/**@typedef {Object} Datos
 * @property {number[]} input
 * @property {number[]} output
 */

/**
 * Una red neuronal
 */
class Red {
    /**
     * @param {opcionesRed} opciones - Opciones: número de neuronas,
     * velocidad de aprendizaje, función de activación.
     */
    constructor({ numeros_de_neuronas, activacion, velocidad_de_aprendizaje }) {
        this.numeros_de_neuronas = numeros_de_neuronas;
        this.neuronas = [];
        this.sesgos = [];
        this.pesos = [];
        this.velocidad_de_aprendizaje = velocidad_de_aprendizaje;
        for (let i in numeros_de_neuronas) {
            let numero = numeros_de_neuronas[i]
            // Para cada capa, añadimos una lista de tantas neuronas como nos hayan dicho
            // En la lista guardaremos la intensidad con la que se activan las neuronas
            this.neuronas.push(Array(numero).fill(0));
            this.sesgos.push(Array(numero).fill().map(() => aleatorio_entre(-1, 1)));
            if (i > 0) {
                // Añadimos una matriz que nos diga los pesos que conectan
                // la capa i-1 con la capa i
                this.pesos.push(matriz_aleatoria(numeros_de_neuronas[i - 1], numeros_de_neuronas[i]))
            }
        }
        this.activacion = activacion;
    }

    /**
     * 
     * @param {number[]} inputs - Entradas, tiene que tener la misma longitud
     * que la capa 0
     * @param {boolean} con_dibujo - Si se dibuja la red al final
     * @returns {number[]} - El resultado según la red neuronal
     */
    feedforward(inputs, con_dibujo) {
        if (inputs.length !== this.neuronas[0].length) {
            return `Se requieren ${this.neuronas[0].length} entradas, pero hay ${inputs.length}!`;
        }
        this.neuronas[0] = inputs;
        //Nos saltamos la última fila
        for (let fila = 0; fila < this.neuronas.length - 1; fila++) {

            //vamos a calcular fila_nueva^t = matriz * fila_vieja^t
            let fila_vieja = this.neuronas[fila];
            let fila_nueva = this.neuronas[fila + 1];
            let matriz = this.pesos[fila];

            for (let i in fila_nueva) {
                let valor = this.sesgos[fila + 1][i];
                for (let j in fila_vieja) {
                    valor += matriz[i][j] * fila_vieja[j];
                }
                fila_nueva[i] = this.activacion(valor);
            }
        }
        if (con_dibujo) {
            dibujar_red(this);
        }
        return this.neuronas[this.neuronas.length - 1];
    }

    /**
     * 
     * @param {Datos} param0 - Entrada, y la salida correcta
     * @param {boolean} dibujar - Si se dibuja
     * @returns {number} el error - la suma de distancias al cuadrado
     * con los valores deseados
     */
    error({ input, output }, dibujar) {
        let calculado = this.feedforward(input, dibujar);
        let error = 0;
        for (let i in output) {
            error += (output[i] - calculado[i]) ** 2;
        }
        return error;
    }

    /**
     * 
     * @param {Datos[]} datos - Entradas {input, output}
     * @returns {number} la suma de los errores
     */
    errores_suma(datos) {
        let error_total = 0;
        for (let dato of datos) {
            error_total += this.error(dato, false);
        }
        return error_total;
    }

    /**
     * 
     * @param {number} coeficiente - número que multiplica a la agresividad
     * del cambio
     * @returns {Red} - una red con cambios aleatorios en todos los parámetros
     */
    cambio_aleatorio(coeficiente) {
        let red_nueva = copiar(this);
        for (let matriz of red_nueva.pesos) {
            for (let fila of matriz) {
                for (let j in fila) {
                    fila[j] += aleatorio_entre(-this.velocidad_de_aprendizaje * coeficiente, this.velocidad_de_aprendizaje * coeficiente);
                }
            }
        }
        for (let fila of red_nueva.sesgos) {
            for (let i in fila) {
                fila[i] += aleatorio_entre(-coeficiente * this.velocidad_de_aprendizaje, coeficiente * this.velocidad_de_aprendizaje);
            }
        }
        return red_nueva;
    }
}

function copiar(red) {
    let nuevo = Object.assign(Object.create(Object.getPrototypeOf(red)), red);
    nuevo.activacion = red.activacion;
    nuevo.activacion_derivada = red.activacion_derivada;
    nuevo.neuronas = copiar_json(red.neuronas);
    nuevo.numeros_de_neuronas = copiar_json(red.numeros_de_neuronas);
    nuevo.pesos = copiar_json(red.pesos);
    nuevo.sesgos = copiar_json(red.sesgos);
    nuevo.velocidad_de_aprendizaje = red.velocidad_de_aprendizaje;
    return nuevo;
}

function copiar_json(x) {
    return JSON.parse(JSON.stringify(x));
}