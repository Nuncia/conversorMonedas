const input = document.getElementById('inputMonedas');
const boton = document.getElementById('boton');
const selectPadre = document.getElementById('select');
const montoMoneda = 0;

// Obteniendo datos desde la API
const obteniendoDatosMonedas = async () => {
    const endPoint =  'https://mindicador.cl/api/';
    const res = await fetch(endPoint);
    const data = await res.json();
    return data;
}
// Cargando datos para el select
const cargarDatos = () => {
    let html = '';
    const monedas = obteniendoDatosMonedas();
    monedas.forEach(moneda => {
        // html += `<option value="${moneda.codigo}">${moneda.nombre}</option>`
         html += `<option value="1">Peso chileno</option>`
    })
    selectPadre.innerHTML = html;
}
// Preparando configuracion para la grafica
const preparandoConfiguracion = async (tipoCambio) => {
    const tipoGrafica = 'point';
    const colorLinea = 'red';
    const titulo = 'Monedas'

    const valores = monedas.map((moneda) => {
        return moneda.codigo
    });

    const config = {
        type: tipoGrafica,
        data: {
            labels: labels,
            datasets: [
                {
                    label: titulo,
                    backgroundColor: colorLinea,
                    data: valores
                }
            ]
        }
    }
}


const prueba = async () => {
    const datos = await obteniendoDatosMonedas();
    const config = await preparandoConfiguracion(datos);
    // cargarDatos();
}

const calculaTotal = () => {
    const valorTotal = input.value;

}

// boton.addEventListener('click', calculaTotal);

prueba();
