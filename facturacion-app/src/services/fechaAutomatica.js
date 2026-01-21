export const generar_Years = (atras = 1 , adelante = 5) =>{
    const anioActual = new Date().getFullYear();
    const anios = [];
    for(let i = anioActual - atras; i <= anioActual + adelante ; i++){
        anios.push(i);
    }
    return anios;
}


