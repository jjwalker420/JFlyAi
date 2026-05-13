import { NextResponse, type NextRequest } from 'next/server';

// Gate /proposals/* behind a single shared password.
// Password lives in PROPOSAL_PASSWORD env var (set in Vercel project settings).
// Auth flow: form POST → cookie set → all /proposals/* requests check cookie.

export const config = {
  matcher: ['/proposals/:path*'],
};

const COOKIE_NAME = 'jfly-proposal-auth';

function unauthorizedHtml(error?: string) {
  const errBlock = error
    ? `<p style="color:#d9933a;margin:0 0 1rem;font-size:14px;letter-spacing:0.06em;">${error}</p>`
    : '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex,nofollow">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>JFly.Ai · Private Proposal</title>
  <style>
    html,body{margin:0;height:100%;background:#0e0c0a;color:#f2ebdd;font-family:'Manrope',system-ui,sans-serif;}
    .wrap{min-height:100%;display:flex;align-items:center;justify-content:center;padding:2rem;}
    .card{max-width:380px;width:100%;background:rgba(242,235,221,0.04);border:1px solid rgba(242,235,221,0.14);border-radius:10px;padding:2.25rem;}
    h1{font-family:'Fraunces',Georgia,serif;font-weight:500;font-size:1.5rem;margin:0 0 0.5rem;letter-spacing:-0.01em;}
    p.sub{color:rgba(242,235,221,0.65);font-size:14px;margin:0 0 1.5rem;line-height:1.5;}
    label{display:block;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(242,235,221,0.7);margin-bottom:0.5rem;}
    input{width:100%;box-sizing:border-box;padding:0.75rem 1rem;background:rgba(0,0,0,0.3);border:1px solid rgba(242,235,221,0.2);border-radius:6px;color:#f2ebdd;font-size:1rem;font-family:inherit;outline:none;}
    input:focus{border-color:#d9933a;}
    button{margin-top:1rem;width:100%;padding:0.85rem;background:#d9933a;color:#0e0c0a;border:0;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;font-weight:600;cursor:pointer;}
    button:hover{background:#e3a559;}
    .brand{font-family:'Fraunces',Georgia,serif;font-size:1.1rem;color:#f2ebdd;margin-bottom:1.5rem;letter-spacing:-0.01em;}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="brand">JFly.Ai</div>
      <h1>Private Proposal</h1>
      <p class="sub">This link is shared by invitation only. Enter the password to view.</p>
      ${errBlock}
      <form method="post" action="">
        <label for="password">Password</label>
        <input id="password" name="password" type="password" autofocus required>
        <button type="submit">Unlock</button>
      </form>
    </div>
  </div>
</body>
</html>`;
}

export async function proxy(req: NextRequest) {
  const expected = process.env.PROPOSAL_PASSWORD;
  if (!expected) {
    // No password configured — fail closed
    return new NextResponse('Proposal access is not configured.', { status: 503 });
  }

  // POST: form submission — check password, set cookie, redirect to same path
  if (req.method === 'POST') {
    const form = await req.formData();
    const submitted = String(form.get('password') || '');
    if (submitted === expected) {
      const res = NextResponse.redirect(new URL(req.nextUrl.pathname, req.url), 303);
      res.cookies.set(COOKIE_NAME, expected, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/proposals',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return res;
    }
    return new NextResponse(unauthorizedHtml('Incorrect password.'), {
      status: 401,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  // GET: check cookie
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (cookie === expected) {
    const res = NextResponse.next();
    res.headers.set('x-robots-tag', 'noindex, nofollow');
    return res;
  }

  return new NextResponse(unauthorizedHtml(), {
    status: 401,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
