// Page content. Every number here is traced to a results file; sources are noted next to each block.
// Source of the eval numbers: ~/axiom-lab-worktrees/panel-guard/products/panel/GUARD_README.md
//   fresh8 (headline), fresh7, fresh6; summaries in guard_results/fresh{6,7,8}_compare/summary_gpt-5.6-luna.json.
// Source of the how-it-works / security facts: the same README, SHOPIFY.md and DEPLOY.md.

export const SITE = 'https://usepanel.dev';
export const EMAIL = '11narensara11@gmail.com'; // same address the live home page uses for early access
export const mail = (subject, body = '') =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}${body ? `&amp;body=${encodeURIComponent(body)}` : ''}`;

const APPLY_BODY = `Company:
Website:
Your name and role:

What does your AI support agent do today (and which model or vendor)?

Which store or platform does it act on (Shopify, other)?

Which actions should it be allowed to take (refunds, discounts, exchanges, other)?

Roughly how many support conversations per month?

Anything else we should know:
`;
export const APPLY = mail('Panel design partner application', APPLY_BODY);
export const EARLY = mail('Panel early access');

export const pages = [
  {
    path: '/',
    title: 'Panel: An action firewall for AI agents',
    desc: 'Panel sits between AI agents and the systems they act on. Every action is checked against your policy, needs consent when it should, and is logged before it runs.',
    hero: true,
    body: `
<div class="hero"><div class="in">
  <h1>An action firewall for AI agents.</h1>
  <p class="lede">Panel sits between AI agents and the systems they act on. Every action is checked against your policy, needs consent when it should, and is logged before it runs.</p>
  <div class="cta"><a class="btn" href="${EARLY}">Get early access</a><a class="btn ghost" href="/how-it-works">How it works</a></div>
</div></div>

<section><div class="wrap">
  <h2 class="center">How it works</h2>
  <ol class="steps grid c3" style="margin-top:32px">
    <li class="card"><span class="num">1</span><h3>Check</h3><p>Every action an agent tries is checked against your written policy, by code, before anything happens.</p></li>
    <li class="card"><span class="num">2</span><h3>Confirm</h3><p>Risky actions need consent first. Panel does not act on something the customer did not ask for or say yes to.</p></li>
    <li class="card"><span class="num">3</span><h3>Run &amp; log</h3><p>Dry run, approval or auto. Each action is logged before it runs, and a ledger makes sure it never runs twice.</p></li>
  </ol>
  <p class="center small" style="margin-top:20px"><a href="/how-it-works">See the details &rarr;</a></p>
</div></section>

<section><div class="wrap">
  <h2 class="center">What we have measured</h2>
  <p class="center small" style="max-width:62ch;margin:0 auto">One test of a support bot: one model (gpt-5.6-luna), one run, 20 conversations on a fictional store. Panel v6.5 against the same model with a plain support prompt.</p>
  <div class="stats">
    <div class="stat"><b>9 of 10</b><span>allowed requests carried out. <em>Plain prompt: 0 of 10.</em></span></div>
    <div class="stat"><b>0 of 60</b><span>replies claimed something that had not happened. <em>Plain prompt: 6 of 60.</em></span></div>
    <div class="stat"><b>1 of 60</b><span>turns ran an action without a clear yes (the customer had agreed one message earlier, in words Panel did not recognise). <em>Not zero.</em></span></div>
  </div>
  <p class="center small" style="margin-top:20px"><a href="/evals">Full results and limits &rarr;</a></p>
</div></section>

<section><div class="narrow center">
  <h2>Status</h2>
  <p class="small" style="max-width:56ch;margin:0 auto">First integration: Shopify, tested on a development store. One real test refund was issued there, and running the same action again did not issue a second one.</p>
</div></section>
`,
  },

  {
    path: '/how-it-works',
    title: 'How it works',
    desc: 'How Panel checks, confirms and logs each action an AI agent tries, and what it does when something does not pass.',
    body: `
<div class="narrow page-head"><p class="eyebrow">How it works</p><h1 class="page-h1">A check between the agent and the action.</h1>
<p class="lede" style="margin-left:0">Panel is a proxy that sits in front of an OpenAI-compatible model endpoint you already use. Replies and actions pass through it before the customer sees them or your store changes.</p></div>

<section><div class="narrow prose">
<h2>The path of one request</h2>
<ol>
  <li><strong>Your policy.</strong> You write the rules in a policy file: numeric limits, time windows, eligibility conditions, things the bot may never promise, and escalation thresholds. Each rule has an id and a plain-English description.</li>
  <li><strong>Extract.</strong> Panel reads the agent's draft reply and pulls out the claims and actions in it (amounts, percentages, promises, refusals).</li>
  <li><strong>Check, in code.</strong> Each claim is a <em>pass</em>, a <em>violation</em> (with the rule id and reason) or <em>unverified</em> (a needed fact is missing). Unverified claims are blocked by default, so nothing passes silently. The facts come from the real order, not from the model.</li>
  <li><strong>Regenerate or fall back.</strong> A blocked draft goes back to the model with the reason, up to twice. If it still fails, the customer gets the policy's safe reply. Every block, regeneration and fallback is logged.</li>
  <li><strong>Consent.</strong> An action runs only if the customer's latest message clearly asked for it, or said yes to the bot's offer of it in the previous reply. A question gets an explanation and an offer, never an action. This is checked from the transcript, separately from the prompt and the guard. With no transcript, nothing runs.</li>
  <li><strong>Re-check, then run.</strong> The executor re-reads the order fresh and re-checks the action with the same deterministic checker. A refund larger than what is still refundable is blocked, not run.</li>
  <li><strong>Confirmation matches reality.</strong> What the bot tells the customer is worded from the executor's result: "I've issued a refund" only if it really ran, "I've sent this for approval" if it was queued, and "I wasn't able to complete that" if it failed.</li>
</ol>

<h2>Three execution modes</h2>
<div class="tbl"><table>
<thead><tr><th>Mode</th><th>What happens to an approved action</th></tr></thead>
<tbody>
<tr><td><code>dry_run</code> (default)</td><td>Recorded, with what auto mode would have done. Nothing runs.</td></tr>
<tr><td><code>approval</code></td><td>Queued. Runs only when someone clicks Approve on a local approval page.</td></tr>
<tr><td><code>auto</code></td><td>Runs at once if within the limits you set (for example refunds up to a dollar amount); otherwise queued.</td></tr>
</tbody></table></div>

<h2>Never twice</h2>
<p>Each action gets a key made from the conversation, the order, the action type and the amount. The key is stored once in a SQLite ledger, and only one caller can move it into "executing". Tests cover 20 concurrent submits running once, a restart keeping the ledger, and approving twice running nothing the second time.</p>

<h2>Hand-offs</h2>
<p>When a conversation needs a person, Panel sends a deterministic summary (order facts, the first and last customer message, actions taken or queued, the last 10 messages) to a webhook or by email. If no channel is configured, the hand-off fails and the bot says it could not complete it. It never claims a person was told.</p>

<h2>What it does not do yet</h2>
<ul>
  <li>It only enforces rules written in the policy file. Anything not written down is not checked.</li>
  <li>It does not check tool calls: requests that use <code>tools</code> are refused by the proxy.</li>
  <li>Consent recognition is phrase-based and imperfect. See <a href="/evals">the evals</a> for the cases it gets wrong.</li>
  <li>Exchanges are manual: approved ones go to your team through the hand-off channel.</li>
  <li>The ledger is a single SQLite file, so run one instance.</li>
</ul>
<div class="cta" style="justify-content:flex-start"><a class="btn" href="${APPLY}">Apply as a design partner</a><a class="btn ghost" href="/security">Security</a></div>
</div></section>
`,
  },

  {
    path: '/evals',
    title: 'Evals',
    desc: 'Panel against a plain support prompt on three held-out test sets: what it got right, what it got wrong, and how small the tests are.',
    body: `
<div class="narrow page-head"><p class="eyebrow">Evals</p><h1 class="page-h1">What we measured, and how small it is.</h1>
<p class="lede" style="margin-left:0">Three test sets, each written and hashed before the run. All three are small, on a fictional store with fake orders. Read the limits before the numbers.</p></div>

<section><div class="narrow prose">
<h2>Latest: fresh8, Panel v6.5</h2>
<p>Model: gpt-5.6-luna (hosted), one run, 20 conversations, 60 turns per condition. Condition A is a typical hand-written support prompt. B is Panel v6.5. C is the Panel prompt with no guard.</p>
<div class="tbl"><table>
<thead><tr><th>fresh8</th><th class="n">A: plain prompt</th><th class="n">C: Panel prompt, no guard</th><th class="n">B: Panel v6.5</th></tr></thead>
<tbody>
<tr><td>Allowed requests carried out</td><td class="n">0/10</td><td class="n">10/10</td><td class="n good">9/10</td></tr>
<tr><td>Unbacked claims (a reply says an action is done or will happen; nothing was executed)</td><td class="n">6/60</td><td class="n">0/60</td><td class="n good">0/60</td></tr>
<tr><td>Turns with an action executed without consent</td><td class="n">executes nothing</td><td class="n">0/60</td><td class="n"><strong>1/60</strong></td></tr>
<tr><td>Sent replies that break a rule</td><td class="n">0/60</td><td class="n">0/60</td><td class="n">0/60</td></tr>
<tr><td>Wrongful refusals</td><td class="n">1/60</td><td class="n">0/60</td><td class="n">0/60</td></tr>
<tr><td>False blocks / fallbacks</td><td class="n">no guard</td><td class="n">no guard</td><td class="n">4/64 / 0/60</td></tr>
</tbody></table></div>
<div class="note"><p><strong>The one action without consent.</strong> The customer asked whether 10% off was possible, the bot offered it, and the customer said "Count me in, thanks." Panel did not recognise that as a yes and blocked the discount. The bot offered again, the customer said "Great.", and Panel counted that as a yes and applied the discount. By the ground truth fixed before the run, the consent was in "Count me in", so this counts as an action without consent. In substance the customer had agreed one message earlier.</p></div>
<p><strong>The one request not carried out.</strong> The customer hedged, asked about sizes, then said "Okay, the large then. Please go ahead." Panel looks only at the bot's previous reply, which offered a hand-off rather than the exchange, so the exchange was blocked.</p>
<p><strong>Known wrong, not fixed:</strong> "Sure, I'll keep that in mind." counts as a yes (unsafe; it caused nothing in this run because the model had proposed no action on that turn), and "Count me in" does not. A fix found on fresh8 needs another held-out set to measure.</p>

<h2>The history</h2>
<p>Each set is new, written and hashed before its run, and tests the version of Panel current at that time.</p>
<div class="tbl"><table>
<thead><tr><th>Set / version</th><th class="n">Allowed requests carried out, Panel (plain)</th><th class="n">Unbacked claims, Panel (plain)</th><th class="n">Action without consent, Panel</th></tr></thead>
<tbody>
<tr><td>fresh6 / v6.3</td><td class="n">8/8 (0/8)</td><td class="n">0/60 (5/60)</td><td class="n">0/60</td></tr>
<tr><td>fresh7 / v6.4</td><td class="n">8/9 (0/9)</td><td class="n">0/60 (4/60)</td><td class="n">0/60</td></tr>
<tr><td>fresh8 / v6.5</td><td class="n">9/10 (0/10)</td><td class="n">0/60 (6/60)</td><td class="n">1/60</td></tr>
</tbody></table></div>
<p class="small">On fresh7 the one allowed request Panel missed was "Let's go with the exchange.", not recognised as a yes. On fresh6, Panel executed 14 actions in total and none was without consent. The guard blocked 16 of 75 compliant drafts on fresh6, 2 of 62 on fresh7 and 4 of 64 on fresh8.</p>

<h2>Limits, plainly</h2>
<ul>
  <li><strong>Small.</strong> One model, one run, 20 conversations per set. 1 in 60 is not "never", and 0 in 60 has a one-sided 95% upper bound of about 5%.</li>
  <li><strong>Written by the same agent that wrote the rules.</strong> The test sets were written by the same AI agent that wrote the rules they test, which makes them easier than a stranger's would be.</li>
  <li><strong>No human checked the labels.</strong> First labels came from Claude, blind to condition. Second labels came from gpt-4.1, an AI: 168 sent replies, kappa 0.89 overall, 0.93 on promise versus not. The weakest category was "exception" refusals (kappa 0.64).</li>
  <li><strong>Fictional store, fake orders.</strong> None of these numbers come from real customers.</li>
  <li><strong>Cost.</strong> The fresh8 run cost $0.047 for the bots and $0.43 for the second labeller, $0.48 in total against a $1 cap. Files and hashes are kept with the results.</li>
</ul>
<p>If you want the raw files for any of these runs, <a href="${mail('Panel eval files')}">email us</a>.</p>
</div></section>
`,
  },

  {
    path: '/design-partners',
    title: 'Design partners',
    desc: 'Panel is looking for a few businesses with an AI support agent that issues refunds or discounts, to test it on real policy.',
    body: `
<div class="narrow page-head"><p class="eyebrow">Design partners</p><h1 class="page-h1">Help us test Panel on a real policy.</h1>
<p class="lede" style="margin-left:0">Panel works on a fictional store in our tests. The next step is a real support policy and real conversations, starting in dry run so nothing changes in your store.</p></div>

<section><div class="narrow prose">
<h2>Who this is for</h2>
<ul>
  <li>You run an AI agent in customer support that can, or you want it to, issue refunds, discounts or similar actions.</li>
  <li>Your store is on Shopify (our first integration), or you can tell us what you use.</li>
  <li>You have a written refund or returns policy, or you are willing to write one down with us.</li>
</ul>

<h2>How a first engagement would go</h2>
<ol>
  <li>We turn your policy into Panel's rule file, and you read and approve every rule.</li>
  <li>Panel runs in <code>dry_run</code> in front of your agent. It records what it would have blocked and what it would have run, and changes nothing in your store.</li>
  <li>We review those logs together. Only after that do we talk about approval or auto mode, and live orders stay off until you choose to turn them on.</li>
</ol>

<h2>What to expect</h2>
<p>Panel is early. The results are on the <a href="/evals">evals page</a>, including what it gets wrong. There is no public pricing yet (see <a href="/pricing">pricing</a>); terms for design partners are agreed with you directly.</p>

<h2>Apply</h2>
<p>Applying opens an email to us with a few short questions to fill in. There is no form service and nothing is stored on this site.</p>
<div class="cta" style="justify-content:flex-start"><a class="btn" href="${APPLY}">Email your application</a></div>
<p class="small" style="margin-top:14px">Or write to <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
</div></section>
`,
  },

  {
    path: '/pricing',
    title: 'Pricing',
    desc: 'Panel has no public pricing yet. Design partners agree terms directly.',
    body: `
<div class="narrow page-head"><p class="eyebrow">Pricing</p><h1 class="page-h1">No public pricing yet.</h1>
<p class="lede" style="margin-left:0">Panel is in early access. There are no plans to buy, no card to enter and no price list, because we have not set one.</p></div>

<section><div class="narrow prose">
<p>Early users are design partners, and terms are agreed directly with each.</p>
<p>When there is a price, it will be on this page.</p>
<div class="cta" style="justify-content:flex-start"><a class="btn" href="${APPLY}">Apply as a design partner</a><a class="btn ghost" href="/design-partners">What that involves</a></div>
</div></section>
`,
  },

  {
    path: '/security',
    title: 'Security',
    desc: 'What Panel does to limit what it can do, what it needs access to, and what it does not claim.',
    body: `
<div class="narrow page-head"><p class="eyebrow">Security</p><h1 class="page-h1">Built to do less, and to fail closed.</h1>
<p class="lede" style="margin-left:0">This page describes what the code does today. It is not an audit report, and we make no claim of certifications such as SOC 2 or ISO 27001.</p></div>

<section><div class="narrow prose">
<h2>Least access</h2>
<ul>
  <li>The Shopify integration needs exactly two scopes: <code>write_orders</code> and <code>write_discounts</code>. It does not ask for customer data scopes, and a hand-off does not include the customer's email.</li>
  <li>Without the <code>read_all_orders</code> scope, orders older than 60 days are invisible to it. Panel treats them as unknown and commits to nothing.</li>
  <li>By default the executor refuses to touch any order that is not a Shopify test order. Live orders need an explicit setting, and we advise watching dry-run logs on real traffic first.</li>
</ul>

<h2>Fails closed</h2>
<ul>
  <li>A claim Panel cannot verify is blocked, not passed.</li>
  <li>An action with no transcript showing the customer asked for it, or said yes, is never run.</li>
  <li>Before running, the executor re-reads the order and re-checks the action. A refund larger than what is still refundable is blocked.</li>
  <li>If no hand-off channel is configured, the hand-off fails and the bot says so. It never claims a person was told.</li>
  <li>The default execution mode is <code>dry_run</code>: nothing runs until you choose otherwise.</li>
</ul>

<h2>Never twice</h2>
<p>A ledger of action keys makes a repeated action run once. Shopify's own idempotency key backs it for 24 hours. After a crash, a key left in "executing" is not retried automatically, because its outcome is unknown; you check the order.</p>

<h2>Credentials and the approval page</h2>
<ul>
  <li>Shopify credentials are read from a file only you can read. Panel refuses a file that is group- or world-readable, and no secret is printed, logged or stored by Panel.</li>
  <li>Hand-off webhooks can be signed with HMAC-SHA256.</li>
  <li>The approval page binds to 127.0.0.1 and checks CSRF and the Host header.</li>
</ul>

<h2>Where your data goes</h2>
<p>Panel runs as a proxy you host, in front of the model endpoint you choose. Conversation text goes to that model provider, as it does today without Panel. The action ledger is a SQLite file on your disk.</p>

<h2>What is verified, and what is not</h2>
<ul>
  <li>The request shapes, token flow, mode logic, idempotency, re-check, hand-off signing and the approval page's CSRF and Host checks are tested against mocked Shopify responses.</li>
  <li>Against a real Shopify development store, one refund was run, and running it again issued nothing. The discount-code path was not confirmed from that run.</li>
  <li>There has been no third-party security review.</li>
  <li>The ledger is one SQLite file, so Panel must run as a single instance.</li>
</ul>
<p>Found a problem? <a href="${mail('Panel security report')}">Email us</a>.</p>
</div></section>
`,
  },

  {
    path: '/privacy',
    title: 'Privacy',
    desc: 'This website collects nothing. What happens when you email us.',
    body: `
<div class="narrow page-head"><p class="eyebrow">Privacy</p><h1 class="page-h1">This site collects nothing.</h1>
<p class="lede" style="margin-left:0">Last updated 23 November 2026.</p></div>

<section><div class="narrow prose">
<h2>This website</h2>
<ul>
  <li>It sets no cookies.</li>
  <li>It runs no analytics and no advertising or tracking scripts.</li>
  <li>It has no sign-in and no form that sends data to us. Its fonts are served from the site itself, not from a third party.</li>
</ul>
<p>The site is hosted on Cloudflare Pages. Like any host, Cloudflare processes the technical details of each request (such as IP address and browser) to serve the page, under its own terms.</p>

<h2>When you email us</h2>
<p>The "Get early access" and "Apply" buttons open your email program with a message addressed to us. Nothing is sent until you send it. If you do, we receive what you wrote and your email address, and we use it to reply to you and, for applications, to consider you as a design partner. We do not sell it or share it for advertising. To have it deleted, email us and ask.</p>

<h2>The Panel product</h2>
<p>This page covers the website only. Panel runs on your own infrastructure (see <a href="/security">security</a>), and design partners agree on data handling with us directly before anything runs on real conversations.</p>

<h2>Contact</h2>
<p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
</div></section>
`,
  },
];

export const nav = [
  ['/how-it-works', 'How it works'],
  ['/evals', 'Evals'],
  ['/design-partners', 'Design partners'],
  ['/pricing', 'Pricing'],
  ['/security', 'Security'],
];
