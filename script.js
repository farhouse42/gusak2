const URL_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMA0vBOPdxa4ksDciOVkf45BAIas8fN9rYvwRh2BIUfgHXV0ygI5JuGHEsxWA9vTo9wdV1TMtbkFui/pub?output=csv';

async function cargarDatos() {
  const response = await fetch(URL_CSV);
  const texto = await response.text();
  const filas = texto.trim().split('\n');
  const cabecera = filas[0].split(',');

  // Índices clave
  const idxJugador = cabecera.indexOf('Jugador');
  const idxPTS = cabecera.indexOf('PTS');

  // Detectar jornadas tipo J1, J2, ..., J19
  const idxJornadas = cabecera
    .map((nombre, i) => nombre.match(/^J\d+$/) ? i : null)
    .filter(i => i !== null);

  // Crear cabecera de la tabla
  const thead = document.querySelector('#tabla-clasificacion thead');
  const trCabecera = document.createElement('tr');
  trCabecera.innerHTML = `
    <th>Posición</th>
    <th>Jugador</th>
    <th>PTS</th>
    ${idxJornadas.map(i => `<th>${cabecera[i]}</th>`).join('')}
  `;
  thead.innerHTML = '';
  thead.appendChild(trCabecera);

  // Procesar datos
  const datos = filas.slice(1).map(fila => {
    const columnas = fila.split(',');
    return {
      jugador: columnas[idxJugador] || '',
      pts: parseFloat(columnas[idxPTS]) || 0,
      jornadas: idxJornadas.map(i => columnas[i] || '')
    };
  });

  // Ordenar por puntos descendente
  datos.sort((a, b) => b.pts - a.pts);

  // Mostrar datos en la tabla
  const tbody = document.querySelector('#tabla-clasificacion tbody');
  tbody.innerHTML = '';
  datos.forEach((dato, i) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>${dato.jugador}</td>
      <td>${dato.pts}</td>
      ${dato.jornadas.map(p => `<td>${p || '-'}</td>`).join('')}
    `;
    tbody.appendChild(fila);
  });
}

cargarDatos();
