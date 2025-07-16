const URL_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMA0vBOPdxa4ksDciOVkf45BAIas8fN9rYvwRh2BIUfgHXV0ygI5JuGHEsxWA9vTo9wdV1TMtbkFui/pub?output=csv';

async function cargarDatos() {
  const response = await fetch(URL_CSV);
  const texto = await response.text();
  const filas = texto.trim().split('\n');
  const cabecera = filas[0].split(',');

  // Detectar columnas
  const idxJugador = cabecera.indexOf('Jugador');
  const idxPTS = cabecera.indexOf('PTS');
  const idxBonus = cabecera.indexOf('€');
  const idxJornadas = cabecera
    .map((nombre, i) => nombre.match(/^J\d+$/) ? i : null)
    .filter(i => i !== null);

  // Crear cabecera dinámica
  const thead = document.querySelector('#tabla-clasificacion thead');
  const trCabecera = document.createElement('tr');
  trCabecera.innerHTML = `
    <th>Posición</th>
    <th>Jugador</th>
    <th>PTS</th>
    ${idxJornadas.map(i => `<th>${cabecera[i]}</th>`).join('')}
    <th>€</th>
  `;
  thead.innerHTML = '';
  thead.appendChild(trCabecera);

  // Procesar datos
  const datos = filas.slice(1).map(fila => {
    const columnas = fila.split(',');
    return {
      jugador: columnas[idxJugador] || '',
      pts: parseFl
