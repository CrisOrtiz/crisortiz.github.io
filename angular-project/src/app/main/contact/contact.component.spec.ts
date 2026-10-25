import { beforeEach, afterEach, describe, expect, it, jest } from '@jest/globals';
import { NgForm } from '@angular/forms';

import { CONTACT_ENDPOINT, ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fetchMock: jest.Mock<any>;

  const formMock = (invalid = false) => ({
    invalid,
    control: { markAllAsTouched: jest.fn() },
    resetForm: jest.fn(),
  }) as unknown as NgForm;

  const fill = () => {
    component.model = {
      name: 'Ana',
      email: 'ana@example.com',
      subject: 'Hola',
      message: 'Quiero contactarte',
    };
  };

  beforeEach(() => {
    component = new ContactComponent();
    fetchMock = jest.fn();
    (globalThis as any).fetch = fetchMock;
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not send when the form is invalid', async () => {
    const form = formMock(true);

    await component.onSubmit(form);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(form.control.markAllAsTouched).toHaveBeenCalled();
    expect(component.status()).toBe('idle');
  });

  it('should post the message to the endpoint and reset the form', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ success: 'true' }) });
    fill();
    const form = formMock();

    await component.onSubmit(form);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(CONTACT_ENDPOINT);
    const body = JSON.parse(init.body as string);
    expect(body.email).toBe('ana@example.com');
    expect(body._replyto).toBe('ana@example.com');
    expect(body._subject).toContain('Hola');
    expect(component.status()).toBe('sent');
    expect(form.resetForm).toHaveBeenCalled();
    expect(component.model.name).toBe('');
  });

  it('should show an error when the request fails', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    fill();

    await component.onSubmit(formMock());

    expect(component.status()).toBe('error');
  });

  it('should silently drop submissions that fill the honeypot', async () => {
    fill();
    component.honey = 'spam';

    await component.onSubmit(formMock());

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
