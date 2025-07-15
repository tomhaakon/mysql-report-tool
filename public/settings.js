document.getElementById('btn-close').addEventListener('click', () => {
    window.close();
    console.log("close-btn clicke");
});
(async () => {
  console.log("settings.js loaded")
  const form = document.getElementById('cfgForm');
  // load existing:
  const cfg = await window.settings.getAll();
  Object.entries(cfg).forEach(([k,v]) => {
    if (form[k]) form[k].value = v;
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      host:     form.host.value,
      user:     form.user.value,
      password: form.password.value,
      database: form.database.value,
    };
    await window.settings.setAll(data);
    window.close();
    console.log("closing window");
//    alert('Saved! Close this window and use “Reload” to apply.');
  });
})();

