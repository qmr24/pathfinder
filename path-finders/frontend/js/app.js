// Path Finders Header & Footer Navigation Injector
const isSubfolder = window.location.pathname.includes('/student/') || window.location.pathname.includes('/admin/');
const prefix = isSubfolder ? '../' : '';

const headerHtml = `
<nav class="navbar">
  <div class="container nav-inner">
    <a class="brand" href="${prefix}index.html">PATH <span>FINDERS</span></a>
    <div class="nav-links">
      <a href="${prefix}index.html">Home</a>
      <a href="${prefix}about.html">About</a>
      <a href="${prefix}resources.html">Resources</a>
      <a href="${prefix}contact.html">Contact</a>
    </div>
    <div class="nav-actions">
      <a class="btn btn-secondary" href="${prefix}login.html">Login</a>
      <a class="btn btn-primary" href="${prefix}signup.html">Sign Up</a>
    </div>
  </div>
</nav>
`;

const footerHtml = `
<footer class="footer">
  <div class="container footer-grid">
    <div>
      <h2>PATH FINDERS</h2>
      <p>Your journey to Commerce A/L success starts here.</p>
    </div>
    <div>
      <h3>Navigate</h3>
      <p>
        <a href="${prefix}about.html">About</a><br>
        <a href="${prefix}resources.html">Resources</a><br>
        <a href="${prefix}contact.html">Contact</a>
      </p>
    </div>
    <div>
      <h3>Account</h3>
      <p>
        <a href="${prefix}login.html">Student Login</a><br>
        <a href="${prefix}signup.html">Student Sign Up</a>
      </p>
    </div>
  </div>
</footer>
`;

document.addEventListener('DOMContentLoaded', () => {
  const headerEl = document.getElementById('header');
  if (headerEl) headerEl.innerHTML = headerHtml;

  const footerEl = document.getElementById('footer');
  if (footerEl) footerEl.innerHTML = footerHtml;
});
