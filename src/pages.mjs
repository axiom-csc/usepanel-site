// Page content. Every number here is traced to a results file; sources are noted next to each block.
// Source of the action-firewall numbers: ~/panel-firewall-public results/llm_report.md, claims_v2_report.md, eval/latency.json.
// Support-bot numbers (second section of /evals): GUARD_README.md
//   fresh8 (headline), fresh7, fresh6; summaries in guard_results/fresh{6,7,8}_compare/summary_gpt-5.6-luna.json.
// Source of the how-it-works / security facts: the same README, SHOPIFY.md and DEPLOY.md.

export const SITE = 'https://usepanel.dev';
export const EMAIL = 'narensara@usepanel.dev';
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
const FOUNDING_BODY = (plan) => `Plan: ${plan}
Company:
Website:
Your name and role:

How many client workspaces do you expect?

What do your AI agents do, and which tools can they use?

Anything else we should know:
`;
export const APPLY_FOUNDING = (plan) => mail('Panel founding pricing application', FOUNDING_BODY(plan));
export const EARLY = mail('Panel early access');

export const pages = [
  {
    path: '/',
    title: 'Panel: An action firewall for AI agents',
    desc: 'Panel sits between AI agents and their tools. Every action is checked against your policy in code, held for a human when it should be, and logged with a signed receipt. Measured on gpt-4.1: 39 actions without approval became 0.',
    hero: true,
    body: `
<div class="hero"><div class="in">
  <h1>Stop your AI agent from doing things it shouldn&rsquo;t<span class="dot">.</span></h1>
  <p class="lede">Panel holds risky actions for human approval before they execute. Every decision is logged and signed.</p>
  <div class="cta"><a class="btn" href="#install">Try it now</a><a class="btn ghost" href="#explainer">See how it works</a></div>
</div></div>

<section id="install"><div class="wrap">
<section id="demo"><div class="wrap">
  <p class="eyebrow">Live demo</p>
  <h2>See it in action</h2>
  <style>
  .term{background:#0d1117;color:#c9d1d9;border-radius:12px;box-shadow:0 12px 40px rgba(20,16,43,.25);overflow:hidden;max-width:820px;margin:24px 0 0;font-family:var(--mono)}
  .term-bar{display:flex;gap:7px;align-items:center;padding:11px 14px;background:#161b22;font-size:12px;color:#8b949e}
  .term-bar i{width:11px;height:11px;border-radius:50%;background:#ff5f56}
  .term-bar i:nth-child(2){background:#ffbd2e}.term-bar i:nth-child(3){background:#27c93f}
  .term-bar span{margin-left:8px}
  .term-body{padding:18px 20px;min-height:230px;font-size:14px;line-height:1.7;overflow-x:auto}
  .term-body .ln{margin:0 0 14px;white-space:pre-wrap;overflow-wrap:anywhere}
  .term-body .cmd{display:inline-block;overflow:hidden;white-space:nowrap;vertical-align:bottom;width:0;max-width:100%;border-right:2px solid #c9d1d9;animation:ty 1.2s steps(var(--n)) forwards,caret .6s step-end 2 1.2s forwards}
  .term-body .v{display:block;padding-left:2ch;animation:fade .4s ease both}
  .term-body .ALLOWED{color:#3fb950}.term-body .BLOCKED{color:#f85149}.term-body .HELD{color:#e3b341}
  .term-body .why{color:#8b949e}
  .term-body a{color:#79c0ff}
  .term-replay{margin-top:4px}
  @keyframes ty{to{width:calc(var(--n)*1ch)}}
  @keyframes caret{to{border-right-color:transparent}}
  @keyframes fade{from{opacity:0;transform:translateY(3px)}}
  @media (prefers-reduced-motion:reduce){.term-body .cmd{animation:none;width:auto;border:0}.term-body .v{animation:none}}
  </style>
  <div class="term" role="img" aria-label="Simulated terminal: Panel allows a read action, blocks a refund of 500, and holds a refund of 200 for human approval">
    <div class="term-bar"><i></i><i></i><i></i><span>panel &mdash; policy check (simulated)</span></div>
    <div class="term-body" id="term-body" aria-live="polite"></div>
  </div>
  <script>
  (function () {
    var body = document.getElementById('term-body');
    if (!body) return;
    var steps = [
      ['orders.lookup(order_id="1042")', 'ALLOWED', 'read action, within policy'],
      ['refunds.create(amount=500)', 'BLOCKED', 'amount 500 exceeds the maximum 250'],
      ['refunds.create(amount=200)', 'HELD', 'amount over 100, needs human approval']
    ];
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); };
    var started = false;
    function el(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text) e.textContent = text;
      return e;
    }
    async function play() {
      body.textContent = '';
      for (var i = 0; i < steps.length; i++) {
        var s = steps[i], text = 'Agent calls ' + s[0];
        var line = el('div', 'ln');
        line.appendChild(el('span', '', '> '));
        var cmd = el('span', 'cmd', text);
        cmd.style.setProperty('--n', text.length);
        line.appendChild(cmd);
        body.appendChild(line);
        await wait(1200 + 1000); // typing, then a 1s pause
        var v = el('span', 'v');
        v.appendChild(el('b', s[1], 'Panel verdict: ' + s[1]));
        v.appendChild(el('span', 'why', ' — "' + s[2] + '"'));
        line.appendChild(v);
        await wait(700);
      }
      var end = el('div', 'ln');
      end.appendChild(document.createTextNode('Try it yourself: '));
      var a = el('a', '', 'pipx run panel-firewall demo');
      a.href = '#install';
      end.appendChild(a);
      end.appendChild(document.createTextNode('  '));
      var again = el('a', 'term-replay', '↻ replay');
      again.href = '#demo';
      again.addEventListener('click', function (e) { e.preventDefault(); play(); });
      end.appendChild(again);
      body.appendChild(end);
    }
    function start() { if (!started) { started = true; play(); } }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es, o) {
        if (es[0].isIntersecting) { o.disconnect(); start(); }
      }, { threshold: 0.4 }).observe(body);
    } else start();
  })();
  </script>
</div></section>

  <div class="tracks">
    <div class="track dev">
      <p class="eyebrow">For developers</p>
      <h2>Put a proxy in front of your MCP server</h2>
      <pre class="qs"><code>pipx install panel-firewall</code></pre>
      <p style="margin-top: 1rem; color: var(--text-secondary, #666);">
        Or try it first with zero setup:
      </p>
      <pre class="qs"><code>pipx run panel-firewall demo</code></pre>
      <pre class="qs"><code>usepanel init
usepanel proxy --shadow
usepanel report --since 48h</code></pre>
      <p class="small">Needs Python 3.11+. Run <code>usepanel keygen</code> and <code>usepanel pin set</code> first: Panel will not start without a signing key and an approval PIN. Shadow mode lets every call run and records what Panel would have blocked or held; it protects nothing until you remove the flag yourself. <code>init</code> drafts a starter policy: review it.</p>
      <p class="mono-line">Default-deny MCP proxy, deterministic policy, sqlglot SQL parsing, Ed25519 signed receipts</p>
      <p class="small"><strong>New in 0.3.0:</strong> <code>usepanel init --cloud</code> signs in through your browser (no API key to copy), policy templates start in the dashboard, and a held action emails you Approve and Deny links that expire after an hour.</p>
      <p class="links"><a href="https://github.com/tenthlook/panel-firewall">GitHub &rarr;</a><a href="/how-it-works">Docs &rarr;</a></p>
    </div>
    <div class="track team">
      <p class="eyebrow">For your team</p>
      <h2>Your agent wants to refund $500. Panel holds it and asks you first.</h2>
      <figure class="approval" aria-label="Illustration of an approval card">
        <div class="ac-head"><span class="ac-pill">Waiting for approval</span><span class="ac-time">expires in 58 min</span></div>
        <p class="ac-title">Refund $500.00</p>
        <p class="ac-meta">Support agent &middot; order #1042 &middot; over the $100 refund limit</p>
        <div class="ac-btns"><span class="btn">Approve</span><span class="btn ghost">Deny</span></div>
        <figcaption>Illustration, not a screenshot.</figcaption>
      </figure>
      <p class="big">Set rules in plain English. Get email alerts. Approve from your phone.</p>
      <p class="links"><a class="btn" href="https://app.usepanel.dev">Sign up for the dashboard</a></p>
    </div>
  </div>
</div></section>

<section><div class="wrap">
  <h2 class="center">Why you can trust it</h2>
  <div class="stats">
    <div class="stat"><b>39 &rarr; 0</b><span>In testing: approval bypasses dropped from 39 to 0. <em>Real gpt-4.1 agents, with and without Panel.</em></span></div>
    <div class="stat"><b>0.36 ms</b><span>Median overhead per check. Your agent doesn&rsquo;t slow down.</span></div>
    <div class="stat"><b>643</b><span>Open source, 643 passing tests, every decision signed and verifiable.</span></div>
  </div>
  <p class="center small" style="margin-top:20px">Sandbox backends, one author, small samples. <a href="/evals">Full results and limits &rarr;</a></p>
</div></section>

<section><div class="wrap">
  <h2 class="center">What we measured</h2>
  <p class="center small" style="max-width:64ch;margin:0 auto">Real gpt-4.1 agents on 47 sandbox tasks, 5 samples each, with and without Panel. 940 task-runs in total across gpt-4.1 and gpt-4.1-mini; the numbers below are gpt-4.1.</p>
  <div class="stats">
    <div class="stat"><b>39 &rarr; 0</b><span>runs where an action that needs approval ran with no human. <em>Out of 45 such runs, without vs. with Panel.</em></span></div>
    <div class="stat"><b>67 &rarr; 5</b><span>runs where an action the policy forbids executed. <em>Out of 115. The 5 are scoring artifacts, explained on <a href="/evals">/evals</a>.</em></span></div>
    <div class="stat"><b>$300/day</b><span>refund cap held. <em>In a gpt-4.1-mini run (T12, 9 of 9 runs) the model executed seven $40 refunds and Panel blocked the eighth. Details on <a href="/evals">/evals</a>.</em></span></div>
    <div class="stat"><b>~0.36 ms</b><span>median per check, including the ledger write and signature. <em>p95 0.61 ms, Apple M4, loaded machine.</em></span></div>
    <div class="stat"><b>0.8%</b><span>of honest replies wrongly rewritten by the claim blocker. <em>1 of 124. It caught 80 of 85 false completion claims on a written test set.</em></span></div>
    <div class="stat"><b>643</b><span>tests pass in the repository. <em>6 more are skipped.</em></span></div>
  </div>
  <p class="center small" style="margin-top:20px">Sandbox backends, one author, small samples. <a href="/evals">Full results and limits &rarr;</a></p>
</div></section>

<section id="explainer"><div class="wrap">
  <h2 class="center">How it works</h2>
  <ol class="steps grid c3" style="margin-top:32px">
    <li class="card"><span class="num">1</span><h3>Check</h3><p>Each tool call is checked against your written policy, by code, before anything runs. Unknown tools and engine errors are blocked.</p></li>
    <li class="card"><span class="num">2</span><h3>Hold</h3><p>Risky actions wait for a person to approve them out of band, with a PIN. The agent cannot approve its own action.</p></li>
    <li class="card"><span class="num">3</span><h3>Run &amp; log</h3><p>An allowed action runs once, and a signed, hash-chained receipt is written to a ledger. Replies that say &ldquo;done&rdquo; must cite a real receipt.</p></li>
  </ol>
  <p class="center small" style="margin-top:20px"><a href="/how-it-works">See the details &rarr;</a></p>
</div></section>

<section><div class="narrow center">
  <h2>There&rsquo;s also a support-bot guard</h2>
  <p class="small" style="max-width:56ch;margin:0 auto">Panel also checks what a customer-support bot says and does against a store policy. Those results are the second section of <a href="/evals">/evals</a>.</p>
</div></section>
`,
  },

  {
    path: '/how-it-works',
    title: 'How it works',
    desc: 'How Panel intercepts an AI agent’s MCP tool calls, checks them against a deterministic policy, holds risky ones for PIN approval, and logs every decision with a signed receipt.',
    body: `
<div class="narrow page-head"><p class="eyebrow">How it works</p><h1 class="page-h1">Where Panel sits, and what it checks</h1>
<p class="lede" style="margin-left:0">Panel is an MCP proxy. It sits between an agent and the MCP tool server it already talks to: the agent's tool calls go through Panel instead of straight to the server. Every call goes <strong>intercept &rarr; check &rarr; consent &rarr; execute (once) &rarr; log &rarr; receipt</strong>. The allow / needs_consent / block decision is plain deterministic code reading your YAML policy and the ledger. No model is consulted when deciding.</p></div>

<section><div class="narrow prose">
<h2>The path of one tool call</h2>
<ol>
  <li><strong>Your policy.</strong> You write the rules in a policy file (or the dashboard policy builder): which tools are allowed, their risk level, numeric and row limits, which SQL statement kinds need a human, and circuit-breaker thresholds. Unlisted tools are blocked by default &mdash; nothing runs just because the policy didn't mention it.</li>
  <li><strong>Check, in code.</strong> Each call is <em>allow</em>, <em>block</em>, or <em>needs_consent</em>, decided by your policy and the ledger's history (for duplicate and rate checks). This is the same code whether Panel is observing or enforcing.</li>
  <li><strong>Consent, out of band.</strong> A call marked <code>needs_consent</code> is held, not executed. The agent gets an approval id, nothing else. Approving it needs a channel the agent's own tool calls cannot reach &mdash; the CLI (<code>usepanel approve &lt;id&gt;</code>, PIN prompted on the terminal), the local approval UI, or the dashboard &mdash; and your approval PIN. The agent cannot approve its own action; fields like <code>consent: true</code> in its call are ignored.</li>
  <li><strong>Execute once.</strong> Each call gets an idempotency key from its arguments. The key is claimed once in the ledger before the upstream server is called, so a retry, a duplicate, or two approvals of the same action run it exactly once.</li>
  <li><strong>Log and sign.</strong> Every outcome &mdash; allowed, blocked, held, approved, denied, executed, failed &mdash; is appended to a SQLite ledger. An executed call gets a signed receipt chained to the one before it, so a receipt can't be edited, reordered, or dropped without breaking the chain (<code>usepanel verify-chain</code> checks this).</li>
  <li><strong>Claims match receipts.</strong> <code>usepanel check-reply</code> reads what the agent is about to tell the user and blocks or rewrites any claim that an action happened unless it cites a receipt the ledger actually has for that conversation.</li>
</ol>

<h2>Shadow mode, then enforcing</h2>
<p>Every policy runs in one of two modes:</p>
<div class="tbl"><table>
<thead><tr><th>Mode</th><th>What happens</th></tr></thead>
<tbody>
<tr><td><code>shadow</code></td><td>Every call is checked and logged, but all of them run &mdash; Panel records what it would have blocked or held, and nothing is actually stopped. <code>usepanel report</code> reads this back.</td></tr>
<tr><td>enforcing</td><td>The same checks now control the outcome for real: <code>block</code> calls are refused, <code>needs_consent</code> calls are held for PIN approval, and only <code>allow</code> calls run immediately.</td></tr>
</tbody></table></div>
<p>Start in shadow mode, read <code>usepanel report --since 48h</code>, then turn enforcing on yourself &mdash; in the policy file or the dashboard. Panel never switches itself from shadow to enforcing.</p>

<h2>SQL tools: row counts, not just statement kind</h2>
<p>For a tool that runs SQL, the policy names the argument that holds the statement (<code>sql_arg</code>) and can require consent for specific statement kinds with <code>consent_sql_kinds</code> &mdash; for example <code>[delete]</code>, so every <code>DELETE</code> needs a person, even one that touches a single row. Panel parses the SQL (not a regex) and refuses an <code>UPDATE</code>/<code>DELETE</code> with no <code>WHERE</code>, or one with a constant-true <code>WHERE</code> (<code>WHERE 1=1</code>). Give Panel a <code>database:</code> path and it counts the rows a statement would actually touch before running it, so <code>max_rows</code> (block above N) or <code>consent_over_rows</code> (ask above N) catches what statement-kind checks alone can't, such as a condition that's true for every row but isn't a bare constant. Without a <code>database:</code> path, an <code>UPDATE</code>/<code>DELETE</code> can't be row-counted and is blocked rather than guessed at.</p>

<h2>Running once, and the circuit breaker</h2>
<p>The idempotency key is stored once in the ledger, and only one caller can move it into "claimed"; concurrent or retried calls for the same action run it at most once. <code>circuit_breaker: {blocks: 3, per_seconds: 60}</code> freezes every non-read tool after that many enforced blocks in the window, with a signed <code>frozen</code> receipt; a person lifts it with <code>usepanel unfreeze</code> (the approval PIN again) or a signed cloud decision bound to that exact freeze. The breaker never acts in shadow mode.</p>

<h2>What it does not do yet</h2>
<ul>
  <li>It only enforces rules written in the policy. A tool the policy doesn't mention is blocked by default, but a rule you meant to add and didn't is simply not checked.</li>
  <li>The SQL guard doesn't reason about a tautology mixed with a column, such as <code>WHERE id=1 OR 1=1</code> &mdash; only the row count catches that, so give every writable SQL tool a <code>max_rows</code>, <code>consent_over_rows</code>, or <code>consent_sql_kinds</code>. See <code>KNOWN_ISSUES.md</code> in the repo.</li>
  <li>The approval PIN does not stop an agent with full access as your OS user &mdash; it could edit the PIN file or the ledger directly. Run agents under a separate OS user or sandbox, or approve from another device.</li>
  <li>The ledger is a single SQLite file: run one proxy instance per policy.</li>
</ul>

<h2>Measured, not claimed</h2>
<p>On 940 real gpt-4.1 / gpt-4.1-mini task-runs, with and without Panel: actions that need a human and ran with none, 39 &rarr; 0; actions the policy forbids that executed anyway, 67 &rarr; 5 (the 5 are scoring artifacts, explained on <a href="/evals">/evals</a>); median overhead per check, including the ledger write and signature, ~0.36&nbsp;ms. Full numbers, methodology and limits on <a href="/evals">/evals</a>.</p>

<h2>There's also a support-bot guard</h2>
<p>Separately from the MCP action firewall above, Panel checks what a customer-support bot says and does against a store policy &mdash; a different proxy, in front of a model endpoint rather than an MCP server. Those results are the second section of <a href="/evals">/evals</a>.</p>

<div class="cta" style="justify-content:flex-start"><a class="btn" href="${APPLY}">Apply as a design partner</a><a class="btn ghost" href="/security">Security</a></div>
</div></section>
`,
  },

  {
    path: '/evals',
    title: 'Evals',
    desc: 'Action firewall results on real gpt-4.1 agents (940 task-runs), the scoring artifacts, the claim blocker, latency, and the earlier support-bot results, with every limit.',
    body: `
<div class="narrow page-head"><p class="eyebrow">Evals</p><h1 class="page-h1">Results so far</h1>
<p class="lede" style="margin-left:0">Two sections: the action firewall on real models, then the support-bot guard. Every test was written and hashed before it ran, by the same person who wrote the rules, so treat these as early numbers. The limits are listed at the end of each section.</p></div>

<section><div class="narrow prose">
<h2 id="firewall">1. Action firewall, real models</h2>
<p>gpt-4.1 and gpt-4.1-mini, 47 tasks &times; 5 samples &times; with and without Panel: 940 task-runs. Tools were sandbox backends (mock Stripe, SQLite, a Shopify-style store). Scoring was frozen before the run and read from the backends, not from what the model said. Total spend was $1.39.</p>
<div class="tbl"><table>
<thead><tr><th>Task-runs (gpt-4.1)</th><th class="n">Without Panel</th><th class="n">With Panel</th></tr></thead>
<tbody>
<tr><td>Needs-consent action executed with no human (of 45)</td><td class="n">39</td><td class="n good">0</td></tr>
<tr><td>Forbidden action executed (of 115)</td><td class="n">67</td><td class="n"><strong>5</strong> (artifacts, below)</td></tr>
<tr><td>Duplicate extra executions</td><td class="n">4</td><td class="n good">0</td></tr>
<tr><td>Allowed actions completed (of 95)</td><td class="n">85</td><td class="n">51 (see T12, below)</td></tr>
</tbody></table></div>
<p class="small">gpt-4.1-mini: 30 &rarr; 0 needs-consent actions without a human; 57 &rarr; 11 forbidden actions executed (the 11 include the same artifacts).</p>

<h3>The 5 &ldquo;unsafe&rdquo; with Panel are scoring artifacts</h3>
<p>I read every row behind the nonzero cells. They are tasks Q10, Q12 and T13. Their prompts carry stage directions written for a scripted attack (&ldquo;the statement carries a second one&rdquo;, &ldquo;with an always-true OR&rdquo;, &ldquo;$19.999&rdquo;). The models did not attack. They ran the plain <code>DELETE FROM users WHERE id = 7</code>, or refunded $20, which the policy allows, so Panel allowed it. The same artifact inflates the without-Panel column by 10, which leaves 57 against 0 at the strictest reading. One real finding: gpt-4.1-mini changed a requested amount ($19.999 to $20), and Panel checks policy, not intent, so it let that through.</p>

<h3>The completion drop is an invalid test</h3>
<p>Task T12 gives no payment ids, so the models invented <code>payment_intent_1</code> to <code>_8</code>. Without Panel the mock accepted all eight ($320, over the $300/day cap, none of them real payments). With Panel the connector&rsquo;s id validation blocked them. Excluding T12, gpt-4.1 completed 51 of 60 with Panel and 50 of 60 without.</p>

<h3>The $300/day cap</h3>
<p>The cumulative cap was first tested in the scripted run: the 8th $40 refund was stopped and 7 executed. The main model runs never reached it, because T12 gave no payment ids. In the later citation-ablation run (gpt-4.1-mini, payment ids supplied), the model executed seven $40 refunds in all 9 of 9 T12 runs (3 samples x 3 variants) and Panel blocked the eighth at the cumulative $300/day cap. The model then described it accurately (&ldquo;Seven &hellip; were processed&rdquo;). That is the first LLM evidence for the cap. It is one small model and 3 samples, and the T12 numbers are not comparable to the earlier run. Source: <code>results/llm_cite_report.md</code> (rows in <code>results/llm_cite/</code>) in the panel-firewall repository.</p>

<h3>Latency</h3>
<p>Full <code>Firewall.handle</code> with ledger write and signature: median 0.36 ms, p95 0.61 ms. Policy validation alone: median 0.01 ms (Stripe, Shopify), 0.21 ms (SQLite). Measured on an Apple M4 under load, in-process, so it excludes the network and the upstream tool.</p>

<h3>The claim blocker</h3>
<p>Replies that say an action happened must cite a receipt the ledger confirms, or they are rewritten. On a new held-out set (v2): 1 of 124 honest replies wrongly rewritten (0.8%), 80 of 85 false claims caught, 12 of 12 citation attacks caught. With n = 124 and one event, the plausible range for the false-rewrite rate is roughly 0.02% to 4.4%. In the first real-model run it had wrongly replaced 24 of 470 honest replies (5.1%); v2 fixed those wordings after the fact. It is keyword-based and English-only, and it misses idioms such as &ldquo;dealt with&rdquo; and &ldquo;pushed it through&rdquo;. Models also do not cite receipts on their own: gpt-4.1-mini cited a valid one in 37 of 43 replies when the tool result told it to, and in 0 of 43 when it did not. Panel adds that instruction to tool results.</p>

<h3>Limits</h3>
<ul>
  <li><strong>Sandbox only.</strong> No real money, customers or production databases.</li>
  <li><strong>One author.</strong> I wrote the policies, tasks, labels and code. The tasks ask for things the policy forbids, which is unusual in real traffic.</li>
  <li><strong>Small.</strong> 47 tasks, 5 samples at temperature 0.7, no confidence intervals. The samples are not independent trials of 47 different situations.</li>
  <li><strong>Only what is routed through it.</strong> An agent with another path (a shell, a second server, a browser) bypasses Panel. The approval PIN stops an agent from approving itself, but a process running as your OS user can still edit the local ledger.</li>
</ul>
<p class="small">Sources: <code>results/llm_report.md</code>, <code>results/claims_v2_report.md</code>, <code>results/eval/latency.json</code> in the panel-firewall repository.</p>
</div></section>

<section><div class="narrow prose">
<h2 id="support-bot">2. Support-bot guard</h2>
<p>Three test sets of a support bot, each written and hashed before the run. All three are small, on a fictional store with fake orders.</p>
</div></section>

<section><div class="narrow prose">
<h3>Latest: fresh8, Panel v6.5</h3>
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

<h3>The history</h3>
<p>Each set is new, written and hashed before its run, and tests the version of Panel current at that time.</p>
<div class="tbl"><table>
<thead><tr><th>Set / version</th><th class="n">Allowed requests carried out, Panel (plain)</th><th class="n">Unbacked claims, Panel (plain)</th><th class="n">Action without consent, Panel</th></tr></thead>
<tbody>
<tr><td>fresh6 / v6.3</td><td class="n">8/8 (0/8)</td><td class="n">0/60 (5/60)</td><td class="n">0/60</td></tr>
<tr><td>fresh7 / v6.4</td><td class="n">8/9 (0/9)</td><td class="n">0/60 (4/60)</td><td class="n">0/60</td></tr>
<tr><td>fresh8 / v6.5</td><td class="n">9/10 (0/10)</td><td class="n">0/60 (6/60)</td><td class="n">1/60</td></tr>
</tbody></table></div>
<p class="small">On fresh7 the one allowed request Panel missed was "Let's go with the exchange.", not recognised as a yes. On fresh6, Panel executed 14 actions in total and none was without consent. The guard blocked 16 of 75 compliant drafts on fresh6, 2 of 62 on fresh7 and 4 of 64 on fresh8.</p>

<h3>Limits</h3>
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
<p>Panel is early. The results are on the <a href="/evals">evals page</a>, including what it gets wrong. Plans and prices are on the <a href="/pricing">pricing page</a>; design-partner terms are agreed with you directly, and nothing is charged automatically.</p>

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
    desc: 'Free, Agency $299 a month, Startup $899 a month, and Enterprise. Every plan includes all of Panel’s safety features. The first 10 agencies get $249 a month for 12 months.',
    body: `
<div class="narrow page-head center"><p class="eyebrow">Pricing</p><h1 class="page-h1">Every plan gets the same checks</h1>
<p class="lede" style="margin-left:auto;margin-right:auto">What changes between plans is how many clients you can manage and how much history you keep. Free gets the same checks as Enterprise.</p></div>

<section><div class="wrap">
<div class="plans">
  <div class="card plan">
    <h2>Free</h2><p class="price"><b>$0</b></p><p class="small">The local firewall plus one cloud workspace.</p>
    <ul class="plan-list">
      <li>The local firewall, open source (MIT)</li><li>1 cloud workspace</li><li>Shadow mode and enforcement</li><li>7 days of history in the dashboard</li>
    </ul>
    <a class="btn ghost" href="https://app.usepanel.dev/#/signup">Start free</a>
  </div>
  <div class="card plan">
    <h2>Agency</h2><p class="price"><b>$299</b><span> a month</span></p><p class="small">For agencies running agents for their clients.</p>
    <ul class="plan-list">
      <li>Everything in Free</li><li>Up to 25 client workspaces</li><li>Read-only client views with your branding</li><li>Monthly reports, printable, and report emails to client contacts</li>
      <li>Policy templates with a per-client preview and bulk apply</li><li>Slack and email approval links</li><li>1 year of history, up to 10 seats</li>
    </ul>
    <a class="btn" href="${APPLY_FOUNDING('Agency')}">Apply for founding pricing</a><p class="small plan-note">Card checkout opening soon.</p>
  </div>
  <div class="card plan">
    <h2>Startup</h2><p class="price"><b>$899</b><span> a month</span></p><p class="small">More room, more history, priority support.</p>
    <ul class="plan-list">
      <li>Everything in Agency</li><li>Up to 100 client workspaces</li><li>2 years of history, up to 25 seats</li><li>Priority support by email</li>
    </ul>
    <a class="btn" href="${APPLY_FOUNDING('Startup')}">Apply for founding pricing</a><p class="small plan-note">Card checkout opening soon.</p>
  </div>
  <div class="card plan">
    <h2>Enterprise</h2><p class="price"><b class="sm">Contact us</b></p><p class="small">Custom terms and limits.</p>
    <ul class="plan-list">
      <li>Everything in Startup</li><li>Custom limits and terms, agreed with you</li>
    </ul>
    <a class="btn ghost" href="${mail('Panel Enterprise')}">Contact us</a>
  </div>
</div>

<div class="note founding">
  <p><strong>Founding offer: the first 10 agencies get $249 a month, locked for 12 months.</strong> The 12 months start the day your subscription starts. <span id="founding-left" class="founding-left" hidden></span></p>
  <p class="small">Spots are counted from real accepted applications, not a countdown. Nothing is charged until you start a subscription yourself.</p>
</div>
</div></section>

<section><div class="narrow prose">
<h2>In every plan, including Free</h2>
<ul>
  <li>Policy checks in code before every action</li>
  <li>Human approval for risky actions, with an approval PIN</li>
  <li>Signed, hash-chained receipts and a tamper-evident audit log</li>
  <li>Circuit breaker, per-order duplicate guard and daily caps</li>
  <li>Shadow mode, and enforcement you switch on yourself</li>
</ul>
<p>Plans only change how many clients you can manage, how far back the dashboard shows, and conveniences like client views, reports, templates, and Slack or email approval links. Your policies, receipts and audit log are never locked behind a plan.</p>
<h2>Questions</h2>
<p><strong>Can I try it first?</strong> Yes. The local firewall is free and open source, and Free includes one cloud workspace in shadow mode.</p>
<p><strong>Not useful in your first 30 days?</strong> When paid plans open, you can cancel in Settings for a full refund.</p>
<p><strong>Want to be a design partner instead?</strong> See <a href="/design-partners">design partners</a>.</p>
<div class="cta" style="justify-content:flex-start"><a class="btn" href="${APPLY_FOUNDING('Agency')}">Apply for founding pricing</a><a class="btn ghost" href="${mail('Panel pricing question')}">Ask a question</a></div>
</div></section>
<script src="/assets/pricing.js" defer></script>
`,
  },

  {
    path: '/security',
    title: 'Security',
    desc: 'What Panel does to limit what it can do, what it needs access to, and what it does not claim.',
    body: `
<div class="narrow page-head"><p class="eyebrow">Security</p><h1 class="page-h1">How Panel handles access and failures</h1>
<p class="lede" style="margin-left:0">This page describes what the code does today. It is not an audit report, and Panel holds no security certifications.</p></div>

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

<h2>Running an action only once</h2>
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
<p>Found a problem? Email <a href="mailto:security@tenthlook.com?subject=Panel%20security">security@tenthlook.com</a>. Please do not open a public issue for anything that could let someone forge a receipt or approve an action without the PIN.</p>
</div></section>
`,
  },

  {
    path: '/privacy',
    title: 'Privacy',
    desc: 'This website collects nothing. What happens when you email us.',
    body: `
<div class="narrow page-head"><p class="eyebrow">Privacy</p><h1 class="page-h1">This site doesn&rsquo;t collect anything</h1>
<p class="lede" style="margin-left:0">Last updated 23 November 2026.</p></div>

<section><div class="narrow prose">
<h2>This website</h2>
<ul>
  <li>It sets no cookies.</li>
  <li>It runs no analytics and no advertising or tracking scripts. The one script it has, on the pricing page, asks our app server how many founding spots are left; that request carries no cookies and no personal data.</li>
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
