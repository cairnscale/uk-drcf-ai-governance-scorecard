#!/usr/bin/env node

export const CONTROLS = [
  { id: 'approval_gate', domain: 'UK DRCF Agentic', title: 'Deterministic human approval gate before emails, payments, or external writes', weight: 10 },
  { id: 'spend_limit', domain: 'UK DRCF Agentic', title: 'Hard-coded per-action and daily GBP spend caps outside LLM weights', weight: 9 },
  { id: 'zero_egress_boundary', domain: 'UK GDPR / DUAA 2025', title: 'PII redaction or UK/EEA zero-data-retention model boundary', weight: 10 },
  { id: 'vendor_dpa', domain: 'UK GDPR Art. 28', title: 'Signed Data Processing Addendum & model-training opt-out verified', weight: 8 },
  { id: 'deterministic_finance', domain: 'Integrity', title: 'VAT, CIS, and GBP arithmetic isolated in deterministic Rust/SQL/BigInt', weight: 10 },
  { id: 'article_50_notice', domain: 'EU AI Act Art. 50', title: 'User interaction disclosure and synthetic provenance metadata (before 2 Dec 2026)', weight: 9 },
  { id: 'idempotent_retries', domain: 'Reliability', title: 'Stable idempotency keys preventing duplicate webhook/action side effects', weight: 8 },
  { id: 'ai_register', domain: 'UK GDPR Art. 5(2)', title: 'Live AI system register listing owners, data classes, and review dates', weight: 7 },
  { id: 'prompt_injection_tests', domain: 'Security', title: 'Adversarial fixture tests covering untrusted inbox/document text', weight: 8 },
  { id: 'immutable_audit_log', domain: 'Accountability', title: 'Append-only pre-action evidence log tying prompts, checks, and sign-off', weight: 7 },
  { id: 'kill_switch', domain: 'Operations', title: 'One-step pause/kill switch halting autonomous runs immediately', weight: 7 },
  { id: 'exit_portability', domain: 'Commercial Ownership', title: 'Customer-owned policy config (policy.toml) and full vendor exit plan', weight: 7 },
];

export function scoreReadiness(state = {}) {
  const maxScore = CONTROLS.reduce((s, c) => s + c.weight, 0);
  let achieved = 0;
  const gaps = [];

  for (const ctrl of CONTROLS) {
    if (state[ctrl.id] === true) {
      achieved += ctrl.weight;
    } else {
      gaps.push({ id: ctrl.id, domain: ctrl.domain, title: ctrl.title, weight: ctrl.weight });
    }
  }

  const pct = Math.round((achieved / maxScore) * 100);
  const band = pct >= 85 ? 'STRONG_READINESS' : pct >= 55 ? 'PARTIAL_GAP' : 'HIGH_RISK_EXPOSURE';
  return {
    scorePercent: pct,
    achievedWeight: achieved,
    maxWeight: maxScore,
    band,
    missingControlCount: gaps.length,
    gaps: gaps.sort((a, b) => b.weight - a.weight),
  };
}
