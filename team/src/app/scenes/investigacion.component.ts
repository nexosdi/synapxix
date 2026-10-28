import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { downloadBlob, downloadJson } from '../download';
import { PulseApiService, type MemberRow, type ProfileDocument, type PulseReport, type ReplayCheck } from '../services/pulse-api.service';
import { RetratoComponent } from './retrato.component';

/**
 * Vista de investigación (?investigacion). Código de administración →
 * participantes → el mismo retrato que ve la persona, con su traza,
 * comprobación de recálculo y exportación seudónima, más el CV y los enlaces
 * que la persona decidió compartir (separados de D.A.L.A.). Solo lectura.
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
            @for (m of members(); track m.memberId) {
              <button class="memberRow" [class.selected]="selectedId() === m.memberId" (click)="open(m)">
                <strong>{{ m.name ?? 'Sin nombre' }}</strong>
                <small>{{ area(m) }} · {{ m.completedAt ? 'completó' : m.status }}</small>
                @if (meeting(m); as mt) {
                  <small>Charla de 16 min: {{ mt }}</small>
                }
              </button>
            }
          </aside>
          <div class="adminMain">
            @if (report(); as r) {
              <div class="adminTools">
                <span class="eyebrow" style="margin: 0"><b>SUJETO</b> · {{ r.subjectId.slice(0, 8) }}</span>
                <button class="btn secondary" (click)="export_()">EXPORTAR PARA INVESTIGACIÓN</button>
              </div>
              @if (documents().length) {
                <div class="adminDocs">
                  <small>PERFIL PROFESIONAL COMPARTIDO</small>
                  @for (d of documents(); track d.documentId) {
                    @if (d.kind === 'cv') {
                      <button class="linkBtn" (click)="downloadDoc(d)">CV · {{ d.filename }} ↓</button>
                    } @else {
                      <a class="linkBtn" [href]="d.url" target="_blank" rel="noopener noreferrer">{{ d.url }}</a>
                    }
                  }
                </div>
              }
              <synapxix-retrato [report]="r" [replay]="replay()" [heading]="'Retrato de ' + (r.member.name ?? 'esta persona') + '.'" [traceLoader]="traceLoader" />
            } @else if (loading()) {
              <div class="feedback"><b>Proyectando…</b>Recalculando desde el registro de eventos.</div>
            } @else {
              <div class="feedback"><b>Elegí una persona.</b>Verás su retrato, la evidencia de cada afirmación y si el recálculo coincide.</div>
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
  readonly members = signal<MemberRow[] | null>(null);
  readonly selectedId = signal<string | null>(null);
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
      this.members.set(await this.api.adminMembers(this.code));
    } catch {
      this.error.set('Código no válido.');
    }
  }

  area(m: MemberRow) {
    return (typeof m.declared === 'object' ? m.declared.area : undefined) ?? m.roleLabel ?? '—';
  }

  /** Día y horario que eligió para la charla de inicio. */
  meeting(m: MemberRow) {
    const r = typeof m.declared === 'object' ? m.declared.perfil?.reunion : undefined;
    return r ? `${r.dia} · ${r.horario}` : null;
  }

  async open(m: MemberRow) {
    this.selectedId.set(m.memberId);
    this.report.set(null);
    this.replay.set(null);
    this.documents.set([]);
    this.loading.set(true);
    try {
      this.report.set(await this.api.adminReport(this.code, m.memberId));
      this.documents.set(await this.api.adminDocuments(this.code, m.memberId));
      this.replay.set(await this.api.adminReplay(this.code, m.memberId));
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
}
