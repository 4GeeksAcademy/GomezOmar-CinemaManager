// Crea una matriz de asientos con todas las posiciones libres (0).
function asientos(filas: number, columnas: number): number[][] {
  return Array.from({ length: filas }, () => Array(columnas).fill(0));
}

// Convierte la matriz numérica de asientos a caracteres: 'L' para libre, 'X' para ocupado.
function mapearAsientos(sala: number[][]): string[][] {
  return sala.map((fila) => fila.map((asiento) => (asiento === 0 ? "L" : "X")));
}

// Intenta reservar un asiento (marcarlo como ocupado) en la posición dada.
// Devuelve un mensaje de éxito o de error según el caso.
function reservarAsiento(sala: number[][], fila: number, columna: number): string {
  const filaIndice = fila - 1;
  const columnaIndice = columna - 1;

  const filaValida = filaIndice >= 0 && filaIndice < sala.length;
  const columnaValida =
    sala.length > 0 && columnaIndice >= 0 && columnaIndice < sala[0].length;

  if (!filaValida || !columnaValida) {
    return `Posicion invalida: fila ${fila}, columna ${columna}.`;
  }

  if (sala[filaIndice][columnaIndice] === 1) {
    return `El asiento F${fila} C${columna} ya esta ocupado.`;
  }

  sala[filaIndice][columnaIndice] = 1;
  return `Asiento reservado: F${fila} C${columna}.`;
}

// Cuenta cuántos asientos están ocupados y cuántos libres en la sala.
// Devuelve un string con el resumen.
function contarAsientos(sala: number[][]): string {
  let ocupados = 0;
  let libres = 0;

  sala.forEach((fila) => {
    fila.forEach((asiento) => {
      if (asiento === 1) {
        ocupados++;
      } else {
        libres++;
      }
    });
  });

  return `Ocupados: ${ocupados}, Libres: ${libres}`;
}

// Tipo que representa la posición de un par de asientos contiguos libres.
interface ParAsientosContiguos {
  fila: number;
  columna1: number;
  columna2: number;
}

// Busca el primer par de asientos libres y contiguos en la misma fila.
// Si lo encuentra, retorna sus posiciones; si no, retorna null.
function buscarAsientosContiguos(sala: number[][]): ParAsientosContiguos | null {
  for (let fila = 0; fila < sala.length; fila++) {
    for (let columna = 0; columna < sala[fila].length - 1; columna++) {
      const asientoActual = sala[fila][columna];
      const asientoSiguiente = sala[fila][columna + 1];

      if (asientoActual === 0 && asientoSiguiente === 0) {
        return {
          fila: fila + 1,
          columna1: columna + 1,
          columna2: columna + 2,
        };
      }
    }
  }

  return null;
}

// Imprime la sala de cine en formato de cuadrícula con encabezados de filas y columnas.
function imprimirSala(sala: number[][]): void {
  const salaMapeada = mapearAsientos(sala);

  const encabezadoColumnas = salaMapeada[0]
    .map((_, indiceColumna) => String(indiceColumna + 1).padStart(2, " "))
    .join(" ");

  console.log("Sala de cine:\n");
  
  console.log(`    ${encabezadoColumnas}`);

  salaMapeada.forEach((fila, indiceFila) => {
    const numeroFila = String(indiceFila + 1).padStart(2, " ");
    console.log(`F${numeroFila}  ${fila.join("  ")}`);
  });
}




// --- Lógica Frontend para la interfaz interactiva ---
const filas = 8;
const columnas = 10;
let salaCine = asientos(filas, columnas);




const grid = document.getElementById("cine-grid");
const mensaje = document.getElementById("mensaje");
const btnBuscar = document.getElementById("buscar-contiguos");
const conteoAsientos = document.getElementById("conteo-asientos");






function renderizarSala(sala: number[][], parContiguo: {fila: number, columna1: number, columna2: number} | null = null) {
  if (!grid) return;
  grid.innerHTML = "";
  for (let f = 0; f < filas; f++) {
    const tr = document.createElement("tr");
    // Número de fila
    const th = document.createElement("th");
    th.className = "w-10 h-10 text-center align-middle text-slate-700 font-semibold";
    th.textContent = String(f + 1);
    tr.appendChild(th);
    for (let c = 0; c < columnas; c++) {
      const td = document.createElement("td");
      td.className = "p-0";
      const btn = document.createElement("button");
      btn.className =
        "asiento-btn w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-200 " +
        (sala[f][c] === 0
          ? "bg-green-400 border-green-600 hover:bg-green-500"
          : "bg-red-400 border-red-600 hover:bg-red-500 text-white");

      // Resaltar si es parte del par contiguo encontrado
      if (
        parContiguo &&
        parContiguo.fila - 1 === f &&
        (parContiguo.columna1 - 1 === c || parContiguo.columna2 - 1 === c)
      ) {
        btn.className += " ring-4 ring-yellow-400 z-10";
      }

      btn.textContent = sala[f][c] === 0 ? "L" : "X";
      btn.title = `Fila ${f + 1}, Columna ${c + 1}`;
      btn.setAttribute("data-fila", String(f));
      btn.setAttribute("data-columna", String(c));
      btn.addEventListener("click", () => {
        sala[f][c] = sala[f][c] === 0 ? 1 : 0;
        renderizarSala(sala);
        if (mensaje) mensaje.textContent = "";
      });
      td.appendChild(btn);
      tr.appendChild(td);
    }
    grid.appendChild(tr);
  }
  // Actualizar conteo de asientos
  if (conteoAsientos) conteoAsientos.textContent = contarAsientos(sala);
}

if (grid) renderizarSala(salaCine);

if (btnBuscar) {
  btnBuscar.onclick = () => {
    const par = buscarAsientosContiguos(salaCine);
    renderizarSala(salaCine, par);
    if (mensaje) {
      if (par) {
        mensaje.textContent = `¡Primer par libre encontrado en Fila ${par.fila}, Columnas ${par.columna1} y ${par.columna2}!`;
      } else {
        mensaje.textContent = "No hay dos asientos contiguos libres disponibles.";
      }
    }
  };
}
