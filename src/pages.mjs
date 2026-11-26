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
  <h1>An action firewall for AI agents<span class="dot">.</span></h1>
  <p class="lede">Panel sits between an agent and its tools. Every action is checked against your policy in code, held for a human when it should be, and logged with a signed receipt. No model decides the verdict.</p>
  <div class="cta"><a class="btn" href="/evals">See the results</a><a class="btn ghost" href="/how-it-works">How it works</a></div>
</div></div>

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

<section><div class="wrap">
  <h2 class="center">Try it in shadow mode</h2>
  <p class="center small" style="max-width:62ch;margin:0 auto">Shadow mode lets every call run and records what Panel would have blocked or held. It protects nothing until you remove the flag yourself.</p>
  <pre class="qs"><code>pipx install panel-firewall
usepanel keygen
usepanel pin set
usepanel init
usepanel proxy --shadow</code></pre>
  <p class="center small">Needs Python 3.11+. <code>usepanel keygen</code> and <code>usepanel pin set</code> create the receipt-signing key and your approval PIN; Panel will not start without them. <code>usepanel init</code> drafts a starter policy from your upstream MCP server: review it. Then <code>usepanel report --since 48h</code> shows what would have happened.</p>
</div></section>

<section><div class="wrap">
  <h2 class="center">How it works</h2>
  <ol class="steps grid c3" style="margin-top:32px">
    <li class="card"><span class="num">1</span><h3>Check</h3><p>Each tool call is checked against your written policy, by code, before anything runs. Unknown tools and engine errors are blocked.</p></li>
    <li class="card"><span class="num">2</span><h3>Hold</h3><p>Risky actions wait for a person to approve them out of band, with a PIN. The agent cannot approve its own action.</p></li>
    <li class="card"><span class="num">3</span><h3>Run &amp; log</h3><p>An allowed action runs once, and a signed, hash-chained receipt is written to a ledger. Replies that say &ldquo;done&rdquo; must cite a real receipt.</p></li>
  </ol>
  <p class="center small" style="margin-top:20px"><a href="/how-it-works">See the details &rarr;</a></p>
</div></section>

<section><div class="narrow center">
  <h2>Also: a support-bot guard</h2>
  <p class="small" style="max-width:56ch;margin:0 auto">Panel also checks what a customer-support bot says and does against a store policy. Those results are the second section of <a href="/evals">/evals</a>.</p>
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
    desc: 'Action firewall results on real gpt-4.1 agents (940 task-runs), the scoring artifacts, the claim blocker, latency, and the earlier support-bot results, with every limit.',
    body: `
<div class="narrow page-head"><p class="eyebrow">Evals</p><h1 class="page-h1">What we measured, and how small it is.</h1>
<p class="lede" style="margin-left:0">Two sections: the action firewall on real models, then the support-bot guard. Every test was written and hashed before it ran, by the same author who wrote the rules. Read the limits before the numbers.</p></div>

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

<h3>Limits, plainly</h3>
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
<div class="narrow page-head center"><p class="eyebrow">Pricing</p><h1 class="page-h1">Safety is in every plan.</h1>
<p class="lede" style="margin-left:auto;margin-right:auto">The plans differ in scale and in how you manage clients, never in whether Panel checks an action.</p></div>

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
<div class="narrow page-head"><p class="eyebrow">Security</p><h1 class="page-h1">Built to do less, and to fail closed.</h1>
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
<p>Found a problem? Email <a href="mailto:security@tenthlook.com?subject=Panel%20security">security@tenthlook.com</a>. Please do not open a public issue for anything that could let someone forge a receipt or approve an action without the PIN.</p>
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
