/**
 * Generador de invitaciones del Primer Pulso.
 *
 * Uso:
 *   TEAM_ADMIN_CODE=<code> node scripts/team-invites.mjs "Ana:psicopedagogía" "Leo:ingeniería" ...
 *   TEAM_ADMIN_CODE=<code> PULSE_URL=https://pulso.synapxix.com node scripts/team-invites.mjs Ana Leo
 *
 * Imprime un link listo para compartir por persona.
 */
const BASE = process.env.API_URL ?? `http://localhost:${process.env.SYNAPXIX_API_PORT || process.env.PORT || 3001}`;
const PULSE_URL = process.env.PULSE_URL ?? 'http://localhost:4400';
const ADMIN_CODE = process.env.TEAM_ADMIN_CODE;

if (!ADMIN_CODE) {
  console.error('Falta TEAM_ADMIN_CODE en el entorno.');
  process.exit(1);
}

const people = process.argv.slice(2).map((arg) => {
  const [name, roleLabel] = arg.split(':');
  return { name, roleLabel };
});

if (people.length === 0) {
  console.error('Pasá al menos una persona: node scripts/team-invites.mjs "Nombre:rol"');
  process.exit(1);
}

const response = await fetch(`${BASE}/api/team/v1/admin/invites`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Team-Admin-Code': ADMIN_CODE },
  body: JSON.stringify({ people }),
});

if (!response.ok) {
  console.error(`HTTP ${response.status}: ${await response.text()}`);
  process.exit(1);
}

for (const invite of await response.json()) {
  console.log(`${(invite.name ?? 'sin nombre').padEnd(22)} ${invite.inviteCode}  ${PULSE_URL}/?invite=${invite.inviteCode}`);
}
