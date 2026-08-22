# Grok Bot prompts

Named Bots do **not** share chat memory. They share the computer.

If `/workspace/opportunity-os/CONSTITUTION.md` is on disk, paste **only** the role file below. Do not paste DO-NOT.md. See [../PASTE.md](../PASTE.md).

If the files are missing, paste [../CONSTITUTION.md](../CONSTITUTION.md) once into that Bot, then the role file.

| Bot | File | Paste with constitution? | Sends? |
|-----|------|--------------------------|--------|
| Scout | [scout.md](scout.md) | No, if constitution is on disk | no |
| Maker | [maker.md](maker.md) | No, if constitution is on disk | no |
| Voice | [voice.md](voice.md) | No, if constitution is on disk | no |
| Closer | [closer.md](closer.md) | Already pasted as Bot 1 message 1 | only after Bob writes `send <id>` |

Voice + Closer may be one Bot if Bob wants fewer seats. Scout and Maker should stay separate so crawl and artifact work can run in parallel.
