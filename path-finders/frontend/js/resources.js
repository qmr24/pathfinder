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

  try {
    const { data: resources, error } = await supabaseClient
      .from('resources')
      .select(`
        id,
        title,
        description,
        visibility,
        file_url,
        subjects (
          name,
          code
        ),
        resource_categories (
          name
        )
      `)
      .eq('archived', false);

    if (error || !resources || resources.length === 0) {
      targetEl.innerHTML = `
        <article class="card"><h3>📁 Accounting Notes</h3><p class="muted">Lecture Notes</p><a class="badge" href="#" onclick="alert('Sign in to download materials')">Download PDF</a></article>
        <article class="card"><h3>📁 Economics Past Papers</h3><p class="muted">Past Papers</p><a class="badge" href="#" onclick="alert('Sign in to download materials')">Download PDF</a></article>
        <article class="card"><h3>📁 ICT Model Paper 2026</h3><p class="muted">Model Papers</p><a class="badge" href="#" onclick="alert('Sign in to download materials')">Download PDF</a></article>
      `;
      return;
    }

    targetEl.innerHTML = resources.map(item => `
      <article class="card">
        <span class="badge" style="float:right">${item.resource_categories?.name || 'Document'}</span>
        <h3>📁 ${item.title}</h3>
        <p class="muted">${item.description || item.subjects?.name || 'Commerce Resource'}</p>
        <a class="btn btn-primary" href="${item.file_url || '#'}" target="_blank" style="margin-top:10px;display:inline-block">Download Resource PDF</a>
      </article>
    `).join('');
  } catch (err) {
    console.error('Resource error:', err);
  }
});
})();
