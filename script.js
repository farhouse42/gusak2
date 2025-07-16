const URL_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMA0vBOPdxa4ksDciOVkf45BAIas8fN9rYvwRh2BIUfgHXV0ygI5JuGHEsxWA9vTo9wdV1TMtbkFui/pub?output=csv';

async function cargarDatos() {
  const response = await fetch(URL_CSV);
  const texto = await response.text();
  const filas = texto.trim().split('\n');
  const cabecera = filas[0].split(',');

  const idxJugador = cabecera.indexOf('Jugador');
  const idxPTS = cabecera.indexOf('PTS');

  // Detectar jornadas J1...J19
  const idxJornadas = cabecera
    .map((nombre, i) => nombre.match(/^J\d+$/) ? i : null)
    .filter(i => i !== null);

  // CABECERA dinámica
  const thead = document.querySelector('#tabla-clasificacion thead');
  const trCabecera = document.createElement('tr');
  trCabecera.innerHTML = `
    <th>#</th>
    <th>Jugador</th>
    <th>PTS</th>
    ${idxJornadas.map(i => `<th>${cabecera[i]}</th>`).join('')}
  `;
  thead.innerHTML = '';
  thead.appendChild(trCabecera);

  // PROCESAR datos
  const datos = filas.slice(1).map(fila => {
    const columnas = fila.split(',');
    return {
      jugador: columnas[idxJugador] || '',
      pts: parseFloat(columnas[idxPTS]) || 0,
      jornadas: idxJornadas.map(i => columnas[i] || '')
    };
  });

  // ORDENAR por puntos descendente
  datos.sort((a, b) => b.pts - a.pts);

  // MOSTRAR datos
  const tbody = document.querySelector('#tabla-clasificacion tbody');
  tbody.innerHTML = '';
  datos.forEach((dato, i) => {
    const fila = document.createElement('tr');

    // TOP 2 y BOTTOM 2
    if (i < 2) {
      fila.classList.add('top-pos');
    } else if (i >= datos.length - 2) {
      fila.classList.add('bottom-pos');
    }

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
