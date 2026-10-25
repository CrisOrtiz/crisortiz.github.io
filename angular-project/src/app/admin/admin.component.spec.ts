import { changedKeys, fromEditableField, toEditableFields } from './admin.component';

describe('admin field helpers', () => {
  it('turns Firestore data into sorted editable fields, lists one item per line', () => {
    const fields = toEditableFields({ title: 'Sobre mi', typedStrings: ['Dev', 'Mentor'], count: 3 });
    expect(fields).toEqual([
      { key: 'title', value: 'Sobre mi', list: false },
      { key: 'typedStrings', value: 'Dev\nMentor', list: true },
    ]);
  });

  it('lists schema fields first, in order, even when missing', () => {
    const keys = toEditableFields({ zeta: 'z', title: 'About', paragraphs: ['a', 'b'] }, 'about');
    expect(keys.map(f => f.key)).toEqual(['title', 'paragraphs', 'highlight', 'yearsLabel', 'zeta']);
    expect(keys[1]).toMatchObject({ value: 'a\nb', list: true });
    expect(keys[2].value).toBe('');
  });

  it('converts list fields back to arrays without blank lines', () => {
    expect(fromEditableField({ key: 'k', value: 'a\n\n b \n', list: true })).toEqual(['a', ' b ']);
    expect(fromEditableField({ key: 'k', value: 'Soy un ', list: false })).toBe('Soy un ');
  });

  it('reports only edited and new keys as changed', () => {
    const original = { title: 'Sobre mi', typedStrings: ['Dev'] };
    const fields = [
      { key: 'title', value: 'Sobre mi', list: false },
      { key: 'typedStrings', value: 'Dev\nMentor', list: true },
      { key: 'p_5', value: 'Nuevo', list: false },
    ];
    expect(changedKeys(fields, original)).toEqual(['typedStrings', 'p_5']);
    expect(changedKeys([{ key: 'highlight', value: '', list: false }], original)).toEqual([]);
  });
});
