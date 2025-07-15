document.getElementById('btn-close').addEventListener('click', () => {
    window.close();
    console.log("close-btn clicke");
});
(async () => {
  const form     = document.getElementById('cfgForm');
  const errorDiv = document.getElementById('errorMsg');

  // Load existing values
  const cfg = await window.settings.getAll();
  Object.entries(cfg).forEach(([k,v]) => {
    if (form[k]) form[k].value = v;
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    errorDiv.classList.add('d-none');  // hide old errors

    const data = {
      host:     form.host.value,
      user:     form.user.value,
      password: form.password.value,
      database: form.database.value,
    };

    try {
      // This will now *test* the connection too
      await window.settings.setAll(data);

      // Success! Close settings
      window.close();
    } catch (err) {
      // Show the error message
      errorDiv.textContent = err.message;
      errorDiv.classList.remove('d-none');
    }
  });

  document.getElementById('btn-close')
    .addEventListener('click', () => window.close());
})();

