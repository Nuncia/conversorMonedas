const input = document.getElementById('inputMonedas');
const boton = document.getElementById('boton');
const selectPadre = document.getElementById('select');
// const graficoDOM = document.getElementById('grafico');
const texto = document.getElementById('texto');
const totalConvertido = document.getElementById('monedaConvertida');
const montoMoneda = 0;
let listaMonedas = [];
let arregloFechas = [];

// Obteniendo datos desde la API
const obtenerDatosMonedas = async () => {
    try {
        const endPoint =  'https://mindicador.cl/api/';
        const res = await fetch(endPoint);
        const data = await res.json();
        for(let moneda in data){
            if (data[moneda].codigo && data[moneda].nombre && data[moneda].valor) {
                if(data[moneda].codigo === 'euro' || data[moneda].codigo === 'dolar' || data[moneda].codigo === 'bitcoin'){
                    const identificador = data[moneda].codigo;
                    const nombreMoneda = data[moneda].nombre;
                    const valorMoneda = data[moneda].valor;
                    listaMonedas.push(
                        {
                            identificador: identificador,
                            nombre: nombreMoneda,
                            valor: valorMoneda
                        }
                    )
                }
            }
        }
        return listaMonedas
    } catch (error) {
        totalConvertido.textContent = `<h2>Algo salio mal: ${error.message}</h2>`
    }
};

// Obteniendo indices mensuales por moneda
const obtenerIndicesMensuales = async (identificadorMoneda) => {
    try{
        const endPointMoneda = `https://mindicador.cl/api/${identificadorMoneda}`;
        const res = await fetch(endPointMoneda);
        const data = await res.json();
        ultimosDiezDias = data.serie.slice(-10);
        ultimosDiezDias.forEach((elem) => {
            arregloFechas.push(
                {
                    fecha: elem.fecha,
                    valor: elem.valor
                }
            );
        })
        return arregloFechas;
    }catch(e){
        totalConvertido.textContent = `<h2>Algo salio mal: ${e.message}</h2>`
    }
}

const cargarDatos = async () => {
 const listadoModedas = await obtenerDatosMonedas();
   html = '';
   listaMonedas.forEach(moneda => {
    html += `<option value="${moneda.identificador}">${moneda.nombre}</option>`
   }); 
   selectPadre.innerHTML = html;
}

const convertirMoneda = async () =>{
   const codigoMoneda = selectPadre.value;
   const montoMoneda = input.value;
   texto.textContent = 0;
   let totalMonto = 0
   const indicesMensuales = await obtenerIndicesMensuales(codigoMoneda);
   const listadoMonedas = await obtenerDatosMonedas();
   const listado = listadoMonedas.forEach((moneda) => {
        if(moneda.identificador === codigoMoneda){
            texto.textContent = Number(montoMoneda)/Number(moneda.valor);
        }
   })
   const config = prepararConfiguracionGrafico(indicesMensuales);
}

const prepararConfiguracionGrafico = (indicesMensuales) => {
    let fechasMoneda = [];
    let valoresMoneda = [];
    const tipoGrafico = 'line';
    const titulo = 'Valores 10 últimos días';
    const colorLinea = 'red';
    const opciones = { year: 'numeric', month: 'numeric', day: 'numeric' };
    let fecha = '';
    indicesMensuales.forEach(element => {
     fecha = new Date(element.fecha);
     fechasMoneda.push(fecha.toLocaleDateString(undefined,opciones));       
    })
    
    indicesMensuales.forEach((elemento) => {
        valoresMoneda.push(elemento.valor);
    })

    const config = {
        type: tipoGrafico,
        data: {
            labels: fechasMoneda.reverse(),
            datasets: [
                {
                    label: titulo,
                    backgroundColor: colorLinea,
                    data: valoresMoneda.reverse()
                }
            ]
        }
    }
    renderGrafica(config);
}

const renderGrafica = async (config) => {
    console.log(config)
    const graficoDOM = document.getElementById('grafico');
    // graficoDOM.innerHTML = '';
    new Chart(graficoDOM,config)
}

boton.addEventListener('click', () => convertirMoneda());
cargarDatos();

