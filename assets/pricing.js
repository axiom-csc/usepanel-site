// Shows how many founding spots are left, read from the Panel Cloud database. If the request fails the line stays hidden: the page never guesses a number.
(function () {
  var el = document.getElementById('founding-left');
  if (!el || !window.fetch) return;
  fetch('https://app.usepanel.dev/api/public/pricing', { credentials: 'omit', headers: { accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (d) {
      var f = d && d.founding;
      if (!f || !f.enabled || typeof f.remaining !== 'number' || typeof f.cap !== 'number') return;
      el.textContent = f.remaining > 0 ? f.remaining + ' of ' + f.cap + ' founding spots left.' : 'All ' + f.cap + ' founding spots are taken.';
      el.hidden = false;
    })
    .catch(function () {});
})();
