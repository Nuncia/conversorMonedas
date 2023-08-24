const input = document.getElementById('inputMonedas');
const boton = document.getElementById('boton');
const selectPadre = document.getElementById('select');
const texto = document.getElementById('texto');
const totalConvertido = document.getElementById('monedaConvertida');
const padreGrafico = document.querySelector('.padreGrafico');
const montoMoneda = 0;
let listaMonedas = [];
let arregloFechas = [];

// Obteniendo datos desde la API
const obtenerDatosMonedas = async () => {
    try {
        listaMonedas = []
        const endPoint =  'mindicador.json';
        const res = await fetch(endPoint);
        const data = await res.json();
        for(let moneda in data){
            if (data[moneda].codigo && data[moneda].nombre && data[moneda].valor) {
                if(data[moneda].codigo === 'euro' || data[moneda].codigo === 'dolar' || data[moneda].codigo === 'bitcoin'){
                    listaMonedas.push(
                        {
                            identificador: data[moneda].codigo,
                            nombre: data[moneda].nombre,
                            valor: data[moneda].valor
                        }
                    )
                }
            }
        }
        return listaMonedas
    } catch (error) {
        texto.textContent = `Error al obtener las monedas: ${error.message}.`
    }
};

// Obteniendo indices mensuales por moneda
const obtenerIndicesMensuales = async (identificadorMoneda) => {
    try{
        arregloFechas = [];
        const endPointMoneda = `https://mindicador.cl/api/${identificadorMoneda}`;
        const res = await fetch(endPointMoneda);
        const data = await res.json();
        ultimosDiezDias = data.serie.reverse().slice(-10);
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
        texto.textContent = `Error al obtener inices mensuales de ${identificadorMoneda}: ${e.message}.`
    }
};

const cargarDatos = async () => {
   try{
        const listadoModedas = await obtenerDatosMonedas();
        html = '';
        listaMonedas.forEach(moneda => {
        html += `<option value="${moneda.identificador}">${moneda.nombre}</option>`
        }); 
        selectPadre.innerHTML = html;
   }catch(e){
        texto.textContent = `Error al cargar monedas: ${e.message}.`
   }
};

const convertirMoneda = async () =>{
  try{
    const codigoMoneda = selectPadre.value;
    const montoMoneda = input.value;
    let totalMonto = 0
    if( montoMoneda !== ''){
        if(montoMoneda >0){
            const indicesMensuales = await obtenerIndicesMensuales(codigoMoneda);
            const listadoMonedas = await obtenerDatosMonedas();
            const listado = listadoMonedas.forEach((moneda) => {
            if(moneda.identificador === codigoMoneda){
                totalMonto = (Number(montoMoneda)/Number(moneda.valor)).toFixed(2);
                totalConvertido.textContent = `Resultado: ${totalMonto}`;
            }
            });
            const config = prepararConfiguracionGrafico(indicesMensuales);
        } else {
            alert('Ingrese valores mayores que cero.')
        }
    } else {
        alert('Faltan campos por llenar.');
    }
  }catch(e) {
    texto.textContent = `Ocurrio un error: ${e.message}.`
  }
};

const prepararConfiguracionGrafico = (indicesMensuales) => {
    try{
        let fechasMoneda = [];
        let valoresMoneda = [];
        let fecha = '';
        const opciones = { year: 'numeric', month: 'numeric', day: 'numeric' };
        indicesMensuales.forEach(element => {
            fecha = new Date(element.fecha);
            fechasMoneda.push(fecha.toLocaleDateString(undefined,opciones));
            valoresMoneda.push(element.valor);       
        })
        
        const config = {
            type: 'line',
            data: {
                labels: fechasMoneda,
                datasets: [
                    {
                        label: 'Valores Moneda',
                        backgroundColor: 'red',
                        data: valoresMoneda,
                        borderWidth: 3,
                    }
                ]
            }
        }
        renderGrafica(config);
    } catch(e) {
        texto.textContent = `Ha ocurrido un error: ${e.message}`
    }
};

const renderGrafica = (config) => {
    try{
        padreGrafico.style.visibility = 'visible';
        const graficoDOM = document.getElementById('grafico');
        if(graficoDOM.chart instanceof Chart){
            graficoDOM.chart.destroy();
        }
        graficoDOM.chart = new Chart(graficoDOM,config)
    } catch (e){
        texto.textContent = ('Error al renderizar la gráfica', e.message);
    }
};

boton.addEventListener('click', () => convertirMoneda());
cargarDatos();

