import { changedKeys, fromEditableField, toEditableFields } from './admin.component';

describe('admin field helpers', () => {
  it('turns Firestore data into sorted editable fields, lists one item per line', () => {
    const fields = toEditableFields({ title: 'Sobre mi', typedStrings: ['Dev', 'Mentor'], count: 3 });
    expect(fields).toEqual([
      { key: 'title', value: 'Sobre mi', list: false },
      { key: 'typedStrings', value: 'Dev\nMentor', list: true },
    ]);
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
  });
});
