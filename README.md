# uk-translit

Official Ukrainian transliteration and slug generation for TypeScript, built according to the current rules of the Cabinet of Ministers of Ukraine Resolution No. 55. Designed for headless CMS workflows, with context-aware transliteration, clean slug output, strong test coverage, and no runtime dependencies.

The implementation follows the current text of the Resolution of the Cabinet of Ministers of Ukraine dated January 27, 2010, No. 55, current revision effective from January 12, 2016:
https://zakon.rada.gov.ua/go/55-2010-%D0%BF

## Installation

```bash
bun add uk-translit
```

## Usage

```typescript
import { slugify, transliterate } from 'uk-translit';

transliterate('Київ'); // Kyiv
transliterate('Згурівка'); // Zghurivka
slugify('Паляниця для всіх!'); // palianytsia-dlia-vsikh
```

## API

### `transliterate(input: string): string`

Transliterates Ukrainian text to Latin script according to KMU Resolution No. 55, including:

- word-start rules for `Є`, `Ї`, `Й`, `Ю`, `Я`
- `zgh` handling for `зг`
- omission of soft sign and apostrophes

### `slugify(input: string, options?): string`

Builds an ASCII slug from transliterated text.

Options:

- `separator?: string` default `-`
- `lowercase?: boolean` default `true`

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT
