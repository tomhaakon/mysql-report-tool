// renderer.js
console.log("renderer loaded");
console.log("renderer loaded");

// 1) Wire up the Settings button
document.getElementById('btn-settings')
  .addEventListener('click', () => {
    window.appAPI.openSettings();
  });

// 2) Grab references to UI elements
const tableSelect    = document.getElementById('tableSelect');
const tableContainer = document.getElementById('tableContainer');

// 3) Fetch & populate the list of tables
async function loadTables() {
  try {
    const rows = await window.db.query('SHOW TABLES');
    if (!rows.length) {
      tableSelect.innerHTML = '<option>No tables found</option>';
      return;
    }
    // The column name is dynamic, e.g. "Tables_in_mydb"
    const tableKey = Object.keys(rows[0])[0];
    tableSelect.innerHTML = rows
      .map(r => `<option value="${r[tableKey]}">${r[tableKey]}</option>`)
      .join('');
    // When the user picks a table, load its rows
    tableSelect.addEventListener('change', () => {
      loadRows(tableSelect.value);
    });
    // Auto‐load the first table
    loadRows(rows[0][tableKey]);
  } catch (err) {
    tableContainer.innerHTML = `<div class="alert alert-danger">Error loading tables:<br>${err.message}</div>`;
  }
}

// 4) Fetch & render all rows of a given table
async function loadRows(table) {
  try {
    const rows = await window.db.query(`SELECT * FROM \`${table}\``);
    renderTable(rows);
  } catch (err) {
    tableContainer.innerHTML = `<div class="alert alert-danger">Error loading rows from <strong>${table}</strong>:<br>${err.message}</div>`;
  }
}

// 5) Turn an array of row‐objects into an HTML table
function renderTable(rows) {
  if (!rows.length) {
    tableContainer.innerHTML = '<p>No rows in this table.</p>';
    return;
  }
  const cols = Object.keys(rows[0]);
  let html = '<table class="table table-bordered table-striped">';
  // Header
  html += '<thead><tr>' + cols.map(c => `<th>${c}</th>`).join('') + '</tr></thead>';
  // Body
  html += '<tbody>';
  html += rows
    .map(row => '<tr>' + cols.map(c => `<td>${row[c]===null?'NULL':row[c]}</td>`).join('') + '</tr>')
    .join('');
  html += '</tbody></table>';

  tableContainer.innerHTML = html;
}

// 6) Initialize once DOM is ready
document.addEventListener('DOMContentLoaded', loadTables);

