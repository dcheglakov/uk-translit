import { expect, test } from 'bun:test';
import { slugify, transliterate } from '../src';

test('transliterates according to the KMU resolution', () => {
	expect(transliterate('Київ')).toBe('Kyiv');
	expect(transliterate('Єнакієве')).toBe('Yenakiieve');
	expect(transliterate('Гадяч')).toBe('Hadiach');
	expect(transliterate('Ґорґани')).toBe('Gorgany');
});

test('uses word-start rules for iotated letters', () => {
	expect(transliterate('Юрій')).toBe('Yurii');
	expect(transliterate('Андрій')).toBe('Andrii');
	expect(transliterate("під'їзд")).toBe('pidizd');
	expect(transliterate('об’єкт')).toBe('obiekt');
});

test('uses zgh for зг combinations', () => {
	expect(transliterate('Згурівка')).toBe('Zghurivka');
	expect(transliterate('розгін')).toBe('rozghin');
});

test('builds ASCII slugs without third-party dependencies', () => {
	expect(slugify('Паляниця для всіх!')).toBe('palianytsia-dlia-vsikh');
	expect(slugify('Згурівка 2026 / Київ')).toBe('zghurivka-2026-kyiv');
	expect(slugify('  Україна   понад  усе  ')).toBe('ukraina-ponad-use');
});

test('supports custom slug options', () => {
	expect(slugify('Мій Slug', { separator: '_', lowercase: false })).toBe('Mii_Slug');
});
