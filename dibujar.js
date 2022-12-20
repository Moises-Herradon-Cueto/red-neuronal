function dibujar_red(red) {
    let container = document.getElementById("preview");
    container.innerHTML = '';
    document.querySelectorAll(".leader-line").forEach((node) => node.remove());
    for (let fila in red.neuronas) {
        let neuronas = dibujar_neuronas(red.neuronas[fila], red.sesgos[fila]);
        container.appendChild(neuronas);
    }
    for (let fila in red.neuronas) {
        let pesos;
        if (fila > 0) {
            dibujar_pesos(red.pesos[fila - 1], fila - 1);
        }
    }
}

function dibujar_neuronas(neuronas, sesgos) {
    let container = document.createElement('div');
    container.classList.add('neuronas');
    for (let i in neuronas) {
        let neurona = document.createElement('div');
        neurona.classList.add('neurona');
        neurona.innerHTML = `<p>${neuronas[i].toPrecision(3)}</p>
<p>${sesgos[i].toPrecision(3)}</p>`;
        container.appendChild(neurona);
    }
    return container;
}

function dibujar_pesos(pesos, fila) {
    let container = document.createElement('div');
    container.classList.add('pesos');
    let fila_vieja = document.querySelectorAll(".neuronas")[fila];
    let fila_nueva = document.querySelectorAll(".neuronas")[fila + 1];
    for (let i in pesos) {
        let end = fila_nueva.children[i];
        for (let j in pesos[i]) {
            let start = fila_vieja.children[j];
            let color = gradiente(pesos[i][j]);
            new LeaderLine(
                start, end, {
                color,
                size: 2,
                path: 'magnet',
                startSocket: 'right',
                endSocket: 'left',
                middleLabel: pesos[i][j].toPrecision(2),
            }
            );
        }
    }
}

function gradiente(x) {
    let red = 127 * x + 127;
    let blue = 255 - red;
    let alpha = Math.abs(x * x);
    return `rgb(${red}, 0, ${blue}, ${alpha})`
}
