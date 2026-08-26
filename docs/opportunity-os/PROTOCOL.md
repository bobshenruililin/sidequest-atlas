# Operator protocol — research and draft, never auto-apply

Grok Bots and Atlas operators share this pipeline. It is a runbook, not a scheduler. Recurring Grok tasks may fire Scout against the watchlist; they still stop at a packet.

1. **Ingest.** Paste, RSS, or official page → alert with `first_seen_at`, claimed deadline, status `unverified`.
2. **Reverify.** Organiser page + application-owner page. Deadline with timezone. Eligibility, costs, benefits, whether dates are tentative.
3. **Conflicts.** Official sources win. If two official pages disagree, alert on the *earlier* deadline and ask Bob. Aggregators never break a tie.
4. **Liveness.** Compare now to `deadline_at`. Ignore “currently open” headings. Past deadline → `closed`, keep the row.
5. **Canon.** Eligibility, thesis fit, protected calendar, teaching term. Weak fit stays visible.
6. **Alert.** Newly verified *open* calls: ping Bob at first sight, then 14 days / 7 days / 72 hours before close if still open.
7. **Draft offline.** Maker + Voice. Private fields stay `BOB FILLS IN PORTAL`. Do not log into APNIC or any ATS.
8. **Packet.** One versioned folder. Official claims, collision, uncertainty, attachments.
9. **Approve.** Bob writes `send <id>` to mean “this is the packet I will submit.”
10. **Submit.** Bob logs in, enters private data, clicks submit.
11. **Record.** After Bob confirms, Closer marks `sent`. Atlas capture gets the sanitized lesson only.

See [watchlist/sources.yaml](watchlist/sources.yaml) and [bots/scout.md](bots/scout.md).
