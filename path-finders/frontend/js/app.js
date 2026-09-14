// Path Finders Header & Footer Navigation Injector (Dynamic Auth State)
const SUPABASE_URL = 'https://ztgcchuceqcdcpzephww.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w';

const supabaseClient = typeof supabase !== 'undefined'
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const isSubfolder = window.location.pathname.includes('/student/') || window.location.pathname.includes('/admin/');
const prefix = isSubfolder ? '../' : '';

function renderNavbar(user = null, profile = null) {
  let navActionsHtml = `
    <a class="btn btn-secondary" href="${prefix}login.html">Login</a>
    <a class="btn btn-primary" href="${prefix}signup.html">Sign Up</a>
  `;

  if (user && profile) {
    const displayName = profile.full_name || user.email.split('@')[0];
    const isStudent = profile.role === 'student';
    const dashboardLink = isStudent ? `${prefix}student/dashboard.html` : `${prefix}admin/dashboard.html`;
    const profileLink = isStudent ? `${prefix}student/profile.html` : `${prefix}admin/dashboard.html`;

    navActionsHtml = `
      <a class="btn btn-secondary" href="${dashboardLink}" style="font-weight:700">📊 Dashboard</a>
      <a class="btn btn-secondary" href="${profileLink}" style="font-weight:700">👤 ${displayName}</a>
      <button onclick="logoutUser()" style="background:#ef4444;color:#ffffff;border:none;padding:8px 14px;border-radius:8px;font-weight:700;cursor:pointer;margin-left:6px;transition:opacity 0.2s">
        Logout
      </button>
    `;
  }

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
        ${navActionsHtml}
      </div>
    </div>
  </nav>
  `;

  const headerEl = document.getElementById('header');
  if (headerEl) headerEl.innerHTML = headerHtml;
}

function renderFooter() {
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

  const footerEl = document.getElementById('footer');
  if (footerEl) footerEl.innerHTML = footerHtml;
}

document.addEventListener('DOMContentLoaded', async () => {
  renderFooter();

  if (supabaseClient) {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session && session.user) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('full_name, role')
        .eq('id', session.user.id)
        .single();

      renderNavbar(session.user, profile || { full_name: session.user.email.split('@')[0], role: 'student' });
      return;
    }
  }

  renderNavbar();
});

async function logoutUser() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  window.location.href = `${prefix}login.html`;
}
window.logoutUser = logoutUser;

