import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../../services/contentService';
import { CONTACT, pickLang } from '../profile-data';

// FormSubmit relays the form to this inbox. The first submission sends an
// activation email to the address; once confirmed, messages arrive normally.
export const CONTACT_ENDPOINT = 'https://formsubmit.co/ajax/cristhianortizmercado@gmail.com';

export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
    selector: 'app-contact',
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule
    ],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  private lang = toSignal(inject(ContentService).currentLang$, { initialValue: 'en' });
  public t = computed(() => CONTACT[pickLang(this.lang())]);
  public model: ContactMessage = { name: '', email: '', subject: '', message: '' };
  // Honeypot field: bots fill it, people never see it.
  public honey = '';
  public status = signal<ContactStatus>('idle');

  async onSubmit(form: NgForm): Promise<void> {
    if (form.invalid || this.status() === 'sending') {
      form.control.markAllAsTouched();
      return;
    }
    if (this.honey) {
      return;
    }

    this.status.set('sending');
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: this.model.name,
          email: this.model.email,
          message: this.model.message,
          _subject: `[crisortiz.github.io] ${this.model.subject}`,
          _replyto: this.model.email,
          _template: 'table',
          _captcha: 'false'
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result?.success === 'false' || result?.success === false) {
        throw new Error(result?.message || `HTTP ${response.status}`);
      }
      this.status.set('sent');
      this.model = { name: '', email: '', subject: '', message: '' };
      form.resetForm();
    } catch (err) {
      console.error('Contact form error', err);
      this.status.set('error');
    }
  }
}
