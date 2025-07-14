// renderer.js
console.log("renderer loaded");
document.getElementById('btn-settings')
  .addEventListener('click', () => {
    window.appAPI.openSettings();
  });

(async () => {
  const out = document.getElementById('output');

  try {
    // Example query: fetch now() from MySQL
    const rows = await window.db.query('SHOW TABLES');
    out.textContent = JSON.stringify(rows, null, 2);
  } catch (err) {
    out.textContent = 'Error:\n' + err.message;
  }
})();

