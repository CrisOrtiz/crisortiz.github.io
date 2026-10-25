import { Component, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, GoogleAuthProvider, User, onAuthStateChanged, signInWithPopup, signOut } from '@angular/fire/auth';
import { Firestore, arrayUnion, deleteDoc, doc, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { CONTENT_SECTIONS, migrateLegacy, sectionById } from '../content-schema';

export const ADMIN_LANGS = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
];

// A field is either plain text or a list of strings (e.g. typedStrings), edited one item per line
export interface EditableField {
  key: string;
  value: string;
  list: boolean;
  hint?: string;
}

/** Schema fields first, in their display order (empty when missing), then any extra text fields. */
export function toEditableFields(data: Record<string, unknown> | undefined, sectionId?: string): EditableField[] {
  const values = data ?? {};
  const schema = sectionById(sectionId ?? '')?.fields ?? [];
  const toText = (v: unknown) => Array.isArray(v) ? v.join('\n') : typeof v === 'string' ? v : '';
  const known = schema.map(f => ({ key: f.key, value: toText(values[f.key]), list: !!f.list, hint: f.hint }));
  const extra = Object.entries(values)
    .filter(([key, v]) => !schema.some(f => f.key === key)
      && (typeof v === 'string' || (Array.isArray(v) && v.every(i => typeof i === 'string'))))
    .map(([key, v]) => ({ key, value: toText(v), list: Array.isArray(v) }))
    .sort((a, b) => a.key.localeCompare(b.key));
  return [...known, ...extra];
}

export function fromEditableField(field: EditableField): string | string[] {
  return field.list ? field.value.split('\n').filter(line => line.trim() !== '') : field.value;
}

/** Keys whose value differs from what was loaded (new keys included). */
export function changedKeys(fields: EditableField[], original: Record<string, unknown>): string[] {
  return fields
    .filter(f => !(f.value.trim() === '' && original[f.key] === undefined))
    .filter(f => JSON.stringify(fromEditableField(f)) !== JSON.stringify(original[f.key]))
    .map(f => f.key);
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnDestroy {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  readonly sections = CONTENT_SECTIONS;
  readonly langs = ADMIN_LANGS;

  user = signal<User | null>(null);
  authorized = signal<boolean | null>(null);
  section = signal(CONTENT_SECTIONS[0].id);
  lang = signal('es');
  fields = signal<EditableField[]>([]);
  autoTranslate = signal(true);
  newKey = signal('');
  status = signal('');
  busy = signal(false);
  legacyFound = signal(false);

  private original: Record<string, unknown> = {};
  private unsubscribeAuth = onAuthStateChanged(this.auth, user => this.onUser(user));

  ngOnDestroy(): void {
    this.unsubscribeAuth();
  }

  get targetLang(): string {
    return this.lang() === 'es' ? 'en' : 'es';
  }

  async login(): Promise<void> {
    try {
      await signInWithPopup(this.auth, new GoogleAuthProvider());
    } catch (e: any) {
      this.status.set(`No se pudo iniciar sesión: ${e?.message ?? e}`);
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async selectSection(id: string): Promise<void> {
    this.section.set(id);
    await this.load();
  }

  async selectLang(code: string): Promise<void> {
    this.lang.set(code);
    await this.load();
  }

  addField(): void {
    const key = this.newKey().trim();
    if (!key || this.fields().some(f => f.key === key)) return;
    this.fields.update(list => [...list, { key, value: '', list: false }]);
    this.newKey.set('');
  }

  updateValue(key: string, value: string): void {
    this.fields.update(list => list.map(f => f.key === key ? { ...f, value } : f));
  }

  async save(translateAll = false): Promise<void> {
    const changed = changedKeys(this.fields(), this.original);
    const toTranslate = translateAll ? this.fields().map(f => f.key) : changed;
    if (!changed.length && !translateAll) {
      this.status.set('No hay cambios para guardar.');
      return;
    }
    this.busy.set(true);
    try {
      const data = Object.fromEntries(this.fields()
        .filter(f => changed.includes(f.key) || this.original[f.key] !== undefined)
        .map(f => [f.key, fromEditableField(f)]));
      await setDoc(this.contentRef(this.lang()), data, { merge: true });
      this.original = { ...this.original, ...data };

      if (this.autoTranslate() && toTranslate.length) {
        // Picked up by tools/translate (GitHub Action), which writes the other language
        await setDoc(doc(this.firestore, `translation_jobs/${this.section()}_${this.lang()}`), {
          section: this.section(),
          sourceLang: this.lang(),
          fields: arrayUnion(...toTranslate),
          requestedAt: serverTimestamp(),
        }, { merge: true });
        this.status.set(`Guardado. La traducción a ${this.targetLang.toUpperCase()} se aplicará en unos minutos.`);
      } else {
        this.status.set('Guardado.');
      }
    } catch (e: any) {
      this.status.set(`Error al guardar: ${e?.message ?? e}`);
    } finally {
      this.busy.set(false);
    }
  }

  /** Moves the old fragmented documents (home_section, p_1…) to the current structure. */
  async migrate(): Promise<void> {
    this.busy.set(true);
    try {
      for (const section of CONTENT_SECTIONS) {
        for (const { code } of ADMIN_LANGS) {
          const legacyRef = doc(this.firestore, `content/${code}/sections/${section.legacyId}`);
          const legacy = await getDoc(legacyRef);
          if (!legacy.exists()) continue;
          const currentRef = doc(this.firestore, `content/${code}/sections/${section.id}`);
          const current = await getDoc(currentRef);
          await setDoc(currentRef, { ...migrateLegacy(section.id, legacy.data()), ...(current.data() ?? {}) });
          await deleteDoc(legacyRef);
        }
      }
      this.legacyFound.set(false);
      this.status.set('Contenido migrado a la nueva estructura.');
      await this.load();
    } catch (e: any) {
      this.status.set(`Error al migrar: ${e?.message ?? e}`);
    } finally {
      this.busy.set(false);
    }
  }

  private async checkLegacy(): Promise<void> {
    const checks = CONTENT_SECTIONS.flatMap(s => ADMIN_LANGS.map(l =>
      getDoc(doc(this.firestore, `content/${l.code}/sections/${s.legacyId}`)).then(d => d.exists())));
    this.legacyFound.set((await Promise.all(checks)).some(Boolean));
  }

  private async onUser(user: User | null): Promise<void> {
    this.user.set(user);
    this.authorized.set(null);
    if (!user) return;
    try {
      const admin = await getDoc(doc(this.firestore, `admins/${user.uid}`));
      this.authorized.set(admin.exists());
    } catch {
      this.authorized.set(false);
    }
    if (this.authorized()) {
      await Promise.all([this.load(), this.checkLegacy()]);
    }
  }

  private async load(): Promise<void> {
    this.status.set('');
    const snap = await getDoc(this.contentRef(this.lang()));
    this.original = (snap.data() as Record<string, unknown>) ?? {};
    this.fields.set(toEditableFields(this.original, this.section()));
  }

  private contentRef(lang: string) {
    return doc(this.firestore, `content/${lang}/sections/${this.section()}`);
  }
}
