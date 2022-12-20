class Red {
    constructor({ numeros_de_neuronas, activacion, velocidad_de_aprendizaje }) {
        this.numeros_de_neuronas = numeros_de_neuronas;
        this.neuronas = [];
        this.pesos = [];
        this.velocidad_de_aprendizaje = velocidad_de_aprendizaje;
        for (let i in numeros_de_neuronas) {
            let numero = numeros_de_neuronas[i]
            // Para cada capa, añadimos una lista de tantas neuronas como nos hayan dicho
            // En la lista guardaremos la intensidad con la que se activan las neuronas
            this.neuronas.push(Array(numero).fill(0));
            if (i > 0) {
                // Añadimos una matriz que nos diga los pesos que conectan
                // la capa i-1 con la capa i
                this.pesos.push(matriz_aleatoria(numeros_de_neuronas[i - 1], numeros_de_neuronas[i]))
            }
        }
        this.activacion = activacion;
    }

    feedforward(inputs) {
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
                let valor = 0;
                for (let j in fila_vieja) {
                    valor += matriz[i][j] * fila_vieja[j];
                }
                fila_nueva[i] = this.activacion(valor);
            }
        }
        return this.neuronas[this.neuronas.length - 1];
    }
}

// Una matriz m x n
function matriz_aleatoria(n, m) {
    return Array(m).fill().map(() => Array(n).fill().map(() => aleatorio_entre(-1, 1)));
}

function aleatorio_entre(min, max) {
    return Math.random() * (max - min) + min;
}

red_ejemplo = new Red({ numeros_de_neuronas: [2, 2], activacion: (x) => x, velocidad_de_aprendizaje: 0.1 });
// red_ejemplo.pesos[0] = [[1, 0], [0, 1]];
red_ejemplo.feedforward([1, 2]);