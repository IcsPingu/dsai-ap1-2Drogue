import { WEAPON_DATABASE } from '../data/WeaponDatabase';
import { WEAPON_PRESENTATIONS, getWeaponPresentation } from '../data/WeaponPresentation';

describe('apresentação das armas no catálogo', () => {
  const weapons = Object.values(WEAPON_DATABASE);

  test('possui apresentação própria para cada arma disponível', () => {
    expect(Object.keys(WEAPON_PRESENTATIONS).sort()).toEqual(Object.keys(WEAPON_DATABASE).sort());
  });

  test('não reutiliza halo nem ícones entre armas', () => {
    const icons = weapons.map(weapon => getWeaponPresentation(weapon).iconKey);
    expect(icons).not.toContain('item_halo');
    expect(new Set(icons).size).toBe(weapons.length);
  });

  test('identifica cada silhueta na categoria correta', () => {
    expect(getWeaponPresentation(WEAPON_DATABASE.scarborough_fair).category).toBe('Pistolas');
    expect(getWeaponPresentation(WEAPON_DATABASE.shuraba).category).toBe('Katana');
    expect(getWeaponPresentation(WEAPON_DATABASE.kulshedra).category).toBe('Chicote');
    expect(getWeaponPresentation(WEAPON_DATABASE.durga).category).toBe('Garras elementais');
    expect(getWeaponPresentation(WEAPON_DATABASE.kilgore).category).toBe('Lança-foguetes');
  });

  test('apresenta textos completos em português', () => {
    weapons.forEach(weapon => {
      const presentation = getWeaponPresentation(weapon);
      expect(presentation.title.length).toBeGreaterThan(10);
      expect(presentation.description.length).toBeGreaterThan(30);
      expect(presentation.lore.length).toBeGreaterThan(30);
    });
    expect(WEAPON_PRESENTATIONS.kilgore.name).toBe('Tenente-Coronel Kilgore');
  });
});
