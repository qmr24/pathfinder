export const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';

export async function callGoogleScriptApi(action: string, payload: Record<string, any> = {}, method: 'GET' | 'POST' = 'POST') {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn("GOOGLE_SCRIPT_URL not configured yet. Operating in local mode.");
    return null;
  }

  try {
    if (method === 'GET') {
      const queryParams = new URLSearchParams({ action, ...payload }).toString();
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?${queryParams}`);
      return await res.json();
    } else {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload })
      });
      return await res.json();
    }
  } catch (error) {
    console.error("Google Apps Script API Error:", error);
    return { status: "error", message: "Failed to connect to Google Sheets server." };
  }
}
