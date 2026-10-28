import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { downloadBlob, downloadJson } from '../download';
import { PulseApiService, type MemberRow, type Perfil, type ProfileDocument, type PulseReport, type ReplayCheck } from '../services/pulse-api.service';
import { RetratoComponent } from './retrato.component';

/** Cómo trabaja: las seis respuestas del viernes, en orden. */
const WORK_FIELDS: Array<[string, string]> = [
  ['forma', 'Forma de trabajo'],
  ['horario', 'Rinde más'],
  ['canal', 'Si es urgente'],
  ['feedback', 'Devoluciones'],
  ['ritmo', 'Entregas'],
  ['reaccion', 'Si algo no sale'],
];

const STATUS: Record<string, string> = { invited: 'invitada', joined: 'en curso', completed: 'completó' };

/**
 * Vista de investigación (?investigacion). Código de administración →
 * participantes (con tabla descargable para el equipo) → la ficha de la
 * persona (contacto, carrera, charla, perfil de trabajo, CV y enlaces) y,
 * debajo, el mismo retrato que ve ella, con su traza, comprobación de
 * recálculo y exportación seudónima. Solo lectura.
 */
@Component({
  selector: 'synapxix-investigacion',
  standalone: true,
  imports: [FormsModule, RetratoComponent],
  template: `
    <div class="investigacion">
      @if (!members()) {
        <form class="panel adminLogin" (submit)="enter($event)">
          <div class="panelHead">
            <span class="num">R</span>
            <div><small>VISTA DE INVESTIGACIÓN</small><h2>Acceso del equipo</h2></div>
          </div>
          <label class="field">
            Código de administración
            <input [(ngModel)]="code" name="code" type="password" required autocomplete="off" />
          </label>
          @if (error()) {
            <div class="formError">{{ error() }}</div>
          }
          <button class="btn primary wide">ENTRAR →</button>
        </form>
      } @else {
        <div class="adminLayout">
          <aside class="adminList">
            <p class="eyebrow"><b>PARTICIPANTES</b> · {{ members()!.length }}</p>
            <button class="btn secondary wide" (click)="downloadTable()">DESCARGAR TABLA (CSV)</button>
            @for (m of members(); track m.memberId) {
              <button class="memberRow" [class.selected]="selectedId() === m.memberId" (click)="open(m)">
                <strong>{{ m.name ?? 'Sin nombre' }}</strong>
                <small>{{ m.email ?? '—' }}</small>
                <small>{{ area(m) }} · {{ statusLabel(m) }}</small>
                @if (meeting(m); as mt) {
                  <small>Charla: {{ mt }}</small>
                }
              </button>
            }
          </aside>
          <div class="adminMain">
            @if (selected(); as m) {
              <section class="ficha">
                <header>
                  <div>
                    <p class="eyebrow"><b>FICHA</b> · {{ statusLabel(m) }}</p>
                    <h2>{{ m.name ?? 'Sin nombre' }}</h2>
                    @if (m.email) {
                      <a class="linkBtn" [href]="'mailto:' + m.email">{{ m.email }}</a>
                    }
                  </div>
                  @if (report()) {
                    <button class="btn secondary" (click)="export_()">EXPORTAR PARA INVESTIGACIÓN</button>
                  }
                </header>
                <dl class="fichaGrid">
                  <div><dt>Carrera</dt><dd>{{ area(m) }}</dd></div>
                  <div><dt>Edad</dt><dd>{{ declared(m)?.edad ?? '—' }}</dd></div>
                  <div><dt>Se inscribió</dt><dd>{{ date(m.createdAt ?? m.joinedAt) }}</dd></div>
                  <div><dt>Completó</dt><dd>{{ date(m.completedAt) }}</dd></div>
                  <div class="wide"><dt>Charla de 16 minutos</dt><dd>{{ meeting(m) ?? 'Todavía no eligió' }}</dd></div>
                </dl>
                @if (perfil(m); as p) {
                  <dl class="fichaGrid">
                    <div class="wide"><dt>Superpoderes</dt><dd>{{ p.superpoderes?.join(', ') || '—' }}</dd></div>
                    <div><dt>Quiere aprender</dt><dd>{{ p.aprender ?? '—' }}</dd></div>
                    <div><dt>Lo que más la mueve</dt><dd>{{ p.motivacion ?? '—' }}</dd></div>
                    @for (f of workFields; track f[0]) {
                      <div><dt>{{ f[1] }}</dt><dd>{{ p.trabajo?.[f[0]] ?? '—' }}</dd></div>
                    }
                  </dl>
                }
                <div class="adminDocs">
                  <small>CV Y ENLACES</small>
                  @for (d of documents(); track d.documentId) {
                    @if (d.kind === 'cv') {
                      <button class="linkBtn" (click)="downloadDoc(d)">CV · {{ d.filename }} ↓</button>
                    } @else {
                      <a class="linkBtn" [href]="d.url" target="_blank" rel="noopener noreferrer">{{ d.url }}</a>
                    }
                  } @empty {
                    <span>{{ loading() ? 'Cargando…' : 'No compartió CV ni enlaces.' }}</span>
                  }
                </div>
              </section>
            }
            @if (report(); as r) {
              <synapxix-retrato [report]="r" [replay]="replay()" [heading]="'Informe de ' + (r.member.name ?? 'esta persona') + '.'" [traceLoader]="traceLoader" />
            } @else if (loading()) {
              <div class="feedback"><b>Proyectando…</b>Recalculando desde el registro de eventos.</div>
            } @else if (!selected()) {
              <div class="feedback"><b>Elegí una persona.</b>Vas a ver su ficha, su informe con la evidencia de cada afirmación y si el recálculo coincide.</div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class InvestigacionComponent {
  private readonly api = inject(PulseApiService);

  code = '';
  readonly workFields = WORK_FIELDS;
  readonly members = signal<MemberRow[] | null>(null);
  readonly selectedId = signal<string | null>(null);
  readonly selected = computed(() => this.members()?.find((m) => m.memberId === this.selectedId()) ?? null);
  readonly report = signal<PulseReport | null>(null);
  readonly replay = signal<ReplayCheck | null>(null);
  readonly documents = signal<ProfileDocument[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly traceLoader = (claimKey: string) => this.api.adminTrace(this.code, this.selectedId()!, claimKey);

  async enter(event: Event) {
    event.preventDefault();
    this.error.set('');
    try {
      // Lo más reciente primero: es lo que el equipo revisa a diario.
      const list = await this.api.adminMembers(this.code);
      const at = (m: MemberRow) => Date.parse(m.createdAt ?? m.joinedAt ?? '') || 0;
      this.members.set([...list].sort((a, b) => at(b) - at(a)));
    } catch {
      this.error.set('Código no válido.');
    }
  }

  declared(m: MemberRow) {
    return typeof m.declared === 'object' ? m.declared : null;
  }

  perfil(m: MemberRow): Perfil | null {
    return this.declared(m)?.perfil ?? null;
  }

  area(m: MemberRow) {
    return this.declared(m)?.area ?? m.roleLabel ?? '—';
  }

  statusLabel(m: MemberRow) {
    return STATUS[m.status] ?? m.status;
  }

  /** Día y horario que eligió para la charla de inicio. */
  meeting(m: MemberRow) {
    const r = this.perfil(m)?.reunion;
    return r ? `${r.dia} · ${r.horario}` : null;
  }

  date(value: string | null | undefined) {
    return value ? new Date(value).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  }

  async open(m: MemberRow) {
    this.selectedId.set(m.memberId);
    this.report.set(null);
    this.replay.set(null);
    this.documents.set([]);
    this.loading.set(true);
    try {
      this.documents.set(await this.api.adminDocuments(this.code, m.memberId));
      this.report.set(await this.api.adminReport(this.code, m.memberId));
      this.replay.set(await this.api.adminReplay(this.code, m.memberId));
    } catch {
      // Sin eventos todavía (se inscribió y no avanzó): queda la ficha sola.
    } finally {
      this.loading.set(false);
    }
  }

  async downloadDoc(d: ProfileDocument) {
    const id = this.selectedId();
    if (!id) return;
    downloadBlob(await this.api.adminDocumentBlob(this.code, id, d.documentId), d.filename ?? 'cv');
  }

  async export_() {
    const id = this.selectedId();
    if (!id) return;
    downloadJson(await this.api.adminExport(this.code, id), `dala-research-${id.slice(0, 8)}.json`);
  }

  /** Una fila por persona, lista para abrir en Excel o Google Sheets. */
  downloadTable() {
    const header = [
      'Nombre', 'Email', 'Carrera', 'Edad', 'Estado', 'Se inscribió', 'Completó', 'Charla: día', 'Charla: horario',
      'Superpoderes', 'Quiere aprender', 'Lo que más la mueve', ...WORK_FIELDS.map((f) => f[1]),
    ];
    const rows = (this.members() ?? []).map((m) => {
      const p = this.perfil(m);
      return [
        m.name, m.email, this.area(m), this.declared(m)?.edad, this.statusLabel(m),
        this.date(m.createdAt ?? m.joinedAt), this.date(m.completedAt), p?.reunion?.dia, p?.reunion?.horario,
        p?.superpoderes?.join(', '), p?.aprender, p?.motivacion, ...WORK_FIELDS.map((f) => p?.trabajo?.[f[0]]),
      ];
    });
    const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map((r) => r.map(cell).join(';')).join('\r\n');
    // BOM para que Excel lea bien los acentos; «;» porque Excel en español separa así.
    downloadBlob(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), `primer-pulso-participantes-${new Date().toISOString().slice(0, 10)}.csv`);
  }
}
