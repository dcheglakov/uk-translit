export interface SlugifyOptions {
	separator?: string;
	lowercase?: boolean;
}

const WORD_START_MAP: Record<string, string> = {
	Є: 'Ye',
	Ї: 'Yi',
	Й: 'Y',
	Ю: 'Yu',
	Я: 'Ya',
	є: 'ye',
	ї: 'yi',
	й: 'y',
	ю: 'yu',
	я: 'ya',
};

const DEFAULT_MAP: Record<string, string> = {
	А: 'A',
	Б: 'B',
	В: 'V',
	Г: 'H',
	Ґ: 'G',
	Д: 'D',
	Е: 'E',
	Є: 'Ie',
	Ж: 'Zh',
	З: 'Z',
	И: 'Y',
	І: 'I',
	Ї: 'I',
	Й: 'I',
	К: 'K',
	Л: 'L',
	М: 'M',
	Н: 'N',
	О: 'O',
	П: 'P',
	Р: 'R',
	С: 'S',
	Т: 'T',
	У: 'U',
	Ф: 'F',
	Х: 'Kh',
	Ц: 'Ts',
	Ч: 'Ch',
	Ш: 'Sh',
	Щ: 'Shch',
	Ю: 'Iu',
	Я: 'Ia',
	а: 'a',
	б: 'b',
	в: 'v',
	г: 'h',
	ґ: 'g',
	д: 'd',
	е: 'e',
	є: 'ie',
	ж: 'zh',
	з: 'z',
	и: 'y',
	і: 'i',
	ї: 'i',
	й: 'i',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	у: 'u',
	ф: 'f',
	х: 'kh',
	ц: 'ts',
	ч: 'ch',
	ш: 'sh',
	щ: 'shch',
	ю: 'iu',
	я: 'ia',
	Ь: '',
	ь: '',
	"'": '',
	'’': '',
	'ʼ': '',
	"`": '',
};

const NON_BOUNDARY_SEPARATORS = new Set(["'", '’', 'ʼ', '`', 'Ь', 'ь']);

function isCyrillicLetter(char: string): boolean {
	return /[А-ЩЬЮЯЄІЇҐа-щьюяєіїґ]/u.test(char);
}

function isWordBoundary(char: string | undefined): boolean {
	if (!char) {
		return true;
	}

	if (NON_BOUNDARY_SEPARATORS.has(char)) {
		return false;
	}

	if (isCyrillicLetter(char)) {
		return false;
	}

	return true;
}

function isZghSequence(source: string, index: number): boolean {
	const current = source[index];
	const next = source[index + 1];

	return (current === 'З' || current === 'з') && (next === 'Г' || next === 'г');
}

function transliterateZgh(source: string, index: number): string {
	const current = source[index];
	const next = source[index + 1];

	if (current === 'З' && next === 'Г') {
		return 'ZGH';
	}

	if (current === 'З' && next === 'г') {
		return 'Zgh';
	}

	if (current === 'з' && next === 'Г') {
		return 'zGH';
	}

	return 'zgh';
}

export function transliterate(input: string): string {
	let result = '';

	for (let index = 0; index < input.length; index += 1) {
		const char = input[index] ?? '';

		if (isZghSequence(input, index)) {
			result += transliterateZgh(input, index);
			index += 1;
			continue;
		}

		const previousChar = index > 0 ? input[index - 1] : undefined;
		const isWordStart = isWordBoundary(previousChar);
		const mappedChar = isWordStart ? WORD_START_MAP[char] ?? DEFAULT_MAP[char] : DEFAULT_MAP[char];

		result += mappedChar ?? char;
	}

	return result;
}

export function slugify(input: string, options: SlugifyOptions = {}): string {
	const separator = options.separator ?? '-';
	const lowercase = options.lowercase ?? true;
	const transliterated = transliterate(input);
	const normalized = lowercase ? transliterated.toLowerCase() : transliterated;

	const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	return normalized
		.replace(/[^a-z0-9]+/gi, separator)
		.replace(new RegExp(`${escapedSeparator}{2,}`, 'g'), separator)
		.replace(new RegExp(`^${escapedSeparator}|${escapedSeparator}$`, 'g'), '');
}
