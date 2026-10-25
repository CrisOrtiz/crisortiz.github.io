import { Component, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, GoogleAuthProvider, User, onAuthStateChanged, signInWithPopup, signOut } from '@angular/fire/auth';
import { Firestore, arrayUnion, doc, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';

export const ADMIN_SECTIONS = [
  { id: 'home_section', label: 'Home' },
  { id: 'aboutme_section', label: 'Sobre mí / About' },
  { id: 'header_section', label: 'Menú / Header' },
];

export const ADMIN_LANGS = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
];

// A field is either plain text or a list of strings (e.g. typedStrings), edited one item per line
export interface EditableField {
  key: string;
  value: string;
  list: boolean;
}

export function toEditableFields(data: Record<string, unknown> | undefined): EditableField[] {
  return Object.entries(data ?? {})
    .filter(([, v]) => typeof v === 'string' || (Array.isArray(v) && v.every(i => typeof i === 'string')))
    .map(([key, v]) => Array.isArray(v)
      ? { key, value: v.join('\n'), list: true }
      : { key, value: v as string, list: false })
    .sort((a, b) => a.key.localeCompare(b.key));
}

export function fromEditableField(field: EditableField): string | string[] {
  return field.list ? field.value.split('\n').filter(line => line.trim() !== '') : field.value;
}

/** Keys whose value differs from what was loaded (new keys included). */
export function changedKeys(fields: EditableField[], original: Record<string, unknown>): string[] {
  return fields
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

  readonly sections = ADMIN_SECTIONS;
  readonly langs = ADMIN_LANGS;

  user = signal<User | null>(null);
  authorized = signal<boolean | null>(null);
  section = signal(ADMIN_SECTIONS[0].id);
  lang = signal('es');
  fields = signal<EditableField[]>([]);
  autoTranslate = signal(true);
  newKey = signal('');
  status = signal('');
  busy = signal(false);

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
      const data = Object.fromEntries(this.fields().map(f => [f.key, fromEditableField(f)]));
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
    if (this.authorized()) await this.load();
  }

  private async load(): Promise<void> {
    this.status.set('');
    const snap = await getDoc(this.contentRef(this.lang()));
    this.original = (snap.data() as Record<string, unknown>) ?? {};
    this.fields.set(toEditableFields(this.original));
  }

  private contentRef(lang: string) {
    return doc(this.firestore, `content/${lang}/sections/${this.section()}`);
  }
}
