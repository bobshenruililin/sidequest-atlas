Copy this entire folder onto the **Grok cloud computer**, not your laptop.

```text
In this repo:   docs/opportunity-os/copy-to-grok/
On the Bot:     /workspace/opportunity-os/
```

Grok’s durable disk is `/workspace` ([computer and apps](https://docs.x.ai/grok-bot/computer-and-apps)). `~/opportunity-os` is the wrong default.

**Keep** Settings → Agent → Execution on Local Computer at **Never allowed**. That blocks your Mac/Windows, not the cloud VM. If Scout says it “cannot touch local files,” that is expected. Do not let it invent a skeleton. Paste [CORRECT-SCOUT.md](CORRECT-SCOUT.md).

## How to get files onto `/workspace` without local execution

Composer: six attachments, 25 MB each. Attach files from this folder in batches and say: `Write these into /workspace/opportunity-os/ keeping filenames and subfolders.`

Do not copy `cv/` (phone). Do not paste `DO-NOT.md`.

Then paste (see [PASTE.md](PASTE.md)):

1. `CONSTITUTION.md` into Bot 1 (Closer). Complete.
2. `FIRST-HANDOFF.md` fence into Bot 1 as the first task.
3. `bots/scout.md` / `maker.md` / `voice.md` into the named Bots.

Scout’s first move must be `ls /workspace/opportunity-os`. If `CONSTITUTION.md` is missing, it stops.
