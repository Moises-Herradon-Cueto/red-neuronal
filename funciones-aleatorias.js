
// Una matriz m x n
function matriz_aleatoria(n, m) {
    return Array(m).fill().map(() => Array(n).fill().map(() => aleatorio_entre(-1, 1)));
}

function aleatorio_entre(min, max) {
    return Math.random() * (max - min) + min;
}