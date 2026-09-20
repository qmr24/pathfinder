// Learning Resource Library Controller
(() => {
const SUPABASE_URL = 'https://ztgcchuceqcdcpzephww.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w';

const supabaseClient = typeof supabase !== 'undefined'
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!supabaseClient) return;

  const targetEl = document.getElementById('library') || document.getElementById('publicResources');
  if (!targetEl) return;

  // Show loading state
  targetEl.innerHTML = `<p class="muted" style="text-align:center;padding:2rem;">Loading resources...</p>`;

  try {
    // BUG FIX: public resources page shows visibility='public' resources to all;
    // student library page (logged in) shows all non-archived resources
    const { data: { session } } = await supabaseClient.auth.getSession();
    const isLoggedIn = !!session?.user;

    let query = supabaseClient
      .from('resources')
      .select(`
        id,
        title,
        description,
        visibility,
        file_url,
        subjects ( name, code ),
        resource_categories ( name )
      `)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    // BUG FIX: public page only shows public resources; student library shows all accessible
    if (!isLoggedIn) {
      query = query.eq('visibility', 'public');
    }

    const { data: resources, error } = await query;

    if (error) {
      console.error('Resource fetch error:', error);
      targetEl.innerHTML = `<p style="color:#b91c1c;text-align:center;padding:2rem;">Failed to load resources. Please refresh the page.</p>`;
      return;
    }

    if (!resources || resources.length === 0) {
      // Show placeholder cards if no real data yet
      targetEl.innerHTML = `
        <article class="card"><h3>📁 Accounting Notes</h3><p class="muted">Lecture Notes</p><a class="badge" href="${isLoggedIn ? '#' : 'login.html'}" onclick="if(!${isLoggedIn})alert('Sign in to download materials')">Download PDF</a></article>
        <article class="card"><h3>📁 Economics Past Papers</h3><p class="muted">Past Papers</p><a class="badge" href="${isLoggedIn ? '#' : 'login.html'}" onclick="if(!${isLoggedIn})alert('Sign in to download materials')">Download PDF</a></article>
        <article class="card"><h3>📁 ICT Model Paper 2026</h3><p class="muted">Model Papers</p><a class="badge" href="${isLoggedIn ? '#' : 'login.html'}" onclick="if(!${isLoggedIn})alert('Sign in to download materials')">Download PDF</a></article>
      `;
      return;
    }

    targetEl.innerHTML = resources.map(item => `
      <article class="card">
        <span class="badge" style="float:right">${item.resource_categories?.name || 'Document'}</span>
        <h3>📁 ${item.title}</h3>
        <p class="muted">${item.description || item.subjects?.name || 'Commerce Resource'}</p>
        ${item.file_url
          ? `<a class="btn btn-primary" href="${item.file_url}" target="_blank" rel="noopener noreferrer" style="margin-top:10px;display:inline-block;">Download Resource ↗</a>`
          : `<button class="btn btn-primary" style="margin-top:10px;opacity:0.5;cursor:not-allowed;" disabled>Coming Soon</button>`
        }
      </article>
    `).join('');

  } catch (err) {
    console.error('Resource error:', err);
    targetEl.innerHTML = `<p style="color:#b91c1c;text-align:center;padding:2rem;">Unexpected error loading resources.</p>`;
  }
});
})();
