class Red {
    constructor({ numeros_de_neuronas, activacion, activacion_derivada, velocidad_de_aprendizaje }) {
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
        this.activacion_derivada = activacion_derivada;
    }

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

    error({ input, output }, dibujar) {
        let calculado = this.feedforward(input, dibujar);
        let error = 0;
        for (let i in output) {
            error += (output[i] - calculado[i]) ** 2;
        }
        return error;
    }

    errores_suma(datos) {
        let error_total = 0;
        for (let dato of datos) {
            error_total += this.error(dato, false);
        }
        return error_total;
    }

    cambio_aleatorio() {
        let red_nueva = copiar(this);
        for (let matriz of red_nueva.pesos) {
            for (let fila of matriz) {
                for (let j in fila) {
                    fila[j] += aleatorio_entre(-this.velocidad_de_aprendizaje, this.velocidad_de_aprendizaje);
                }
            }
        }
        for (let fila of red_nueva.sesgos) {
            for (let i in fila) {
                fila[i] += aleatorio_entre(-this.velocidad_de_aprendizaje, this.velocidad_de_aprendizaje);
            }
        }
        return red_nueva;
    }
}

// Una matriz m x n
function matriz_aleatoria(n, m) {
    return Array(m).fill().map(() => Array(n).fill().map(() => aleatorio_entre(-1, 1)));
}

function aleatorio_entre(min, max) {
    return Math.random() * (max - min) + min;
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

const ejemplos_xor = [
    { input: [0, 0], output: [0] },
    { input: [1, 0], output: [1] },
    { input: [0, 1], output: [1] },
    { input: [1, 1], output: [0] },
]