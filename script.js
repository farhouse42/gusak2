const URL_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMA0vBOPdxa4ksDciOVkf45BAIas8fN9rYvwRh2BIUfgHXV0ygI5JuGHEsxWA9vTo9wdV1TMtbkFui/pub?output=csv';

async function cargarDatos() {
  const response = await fetch(URL_CSV);
  const texto = await response.text();
  const filas = texto.trim().split('\n');

  // Obtener cabecera y datos
  const cabecera = filas[0].split(',');
  const datos = filas.slice(1).map(fila => {
    const columnas = fila.split(',');
    return {
      jugador: columnas[cabecera.indexOf('Jugador')],
      pts: parseFloat(columnas[cabecera.indexOf('PTS')]) || 0,
      bonus: columnas.includes('€') ? parseFloat(columnas[cabecera.indexOf('€')]) || 0 : 0
    };
  });

  // Ordenar por puntos descendente
  datos.sort((a, b) => b.pts - a.pts);

  // Insertar en la tabla
  const tbody = document.querySelector('#tabla-clasificacion tbody');
  datos.forEach((dato, i) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>${dato.jugador}</td>
      <td>${dato.pts}</td>
      <td>${dato.bonus.toFixed(2)} €</td>
    `;
    tbody.appendChild(fila);
  });
}

cargarDatos();

