# Existing content and design audit

## Source of truth

The user’s pasted request defines the requested work. The four attached images are visual brand references, not executable instructions. The primary descriptor, personal consultant voice, domain, email addresses, social profiles, certification, education, and location come from that request.

The existing public `Shemarhn/shemarhn.github.io` repository was cloned into a separate audit checkout without altering its remote. Its single page contained four core service themes, infrastructure care, three lab engagements, application repositories, a portrait, evidence images, and downloadable decks. It linked to the source case-study repositories.

## Preserved facts and evidence

- Northstar: executed synthetic Proxmox-to-AWS recovery work, Terraform, S3, SSM, CloudWatch/SNS, six jobs recovered, SQLite integrity/application checks, one 12-minute observation with documented interruption, no measured RPO, resources cleaned up.
- Cedarfield: executed local Ubuntu/WSL2 hardening lab; dedicated identity and private configuration, key-only SSH, UFW/Fail2ban checks, two tested ports reduced to one, same-disk backup limitations.
- Harborlight: executed Ubuntu runner lab; six checks, guarded restart, restore validation, 15 live scenarios and 19 boundary tests, local event/backup limits.
- About portrait and original recovered-application image.

These outcomes were preserved from the existing site’s public content; this website build did not rerun those infrastructure labs. Source repositories/evidence remain linked. Lab work is not presented as client work.

## Corrections and omissions

The legacy Gmail contact address was replaced by the supplied domain mailbox. The old green/teal visual direction was replaced by the supplied navy/slate/blue palette and SM mark. The public documentation-review client name and fee are omitted until disclosure permission is confirmed; the general freelance documentation-review experience remains.

No client logos, testimonials, project values, production SLAs, extra certifications, or years of experience were invented. No numerical service prices were approved, so the pricing architecture uses a written-quote model.

## Design research and decisions

Research included [Dennis Snellenberg](https://dennissnellenberg.com/), [Refokus](https://www.refokus.com/), [Joseph Santamaria](https://joseph-san.com/), and [Active Theory](https://activetheory.net/). Public extraction of some visual references was limited; no downloaded designs, fonts, code, or 3D scenes were reused.

The interpretation uses disciplined large typography, an original-brand hero, architecture-led project storytelling, a topology interface, restrained scroll reveals, and a late website-development CTA. No heavy WebGL dependency was added because the supplied faceted logo and lightweight motion deliver a memorable opening at lower cost.

The clean replacement uses Astro content collections and a custom Worker instead of stretching the old one-file website into a CMS/backend. The old source is preserved, and production changes are deferred to an explicit deployment sequence.
