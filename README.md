# TheLastSpellingBee ReCaptcha

A modern, user-friendly CAPTCHA component for React applications that uses spelling and character conversion challenges. This package provides a secure and accessible way to verify human users.

![NPM Version](https://img.shields.io/npm/v/the-last-spelling-bee-re-captcha)
![License](https://img.shields.io/npm/l/the-last-spelling-bee-re-captcha)

## Features

- 🔒 Secure character-based verification
- 🎨 Modern, responsive UI with Chakra UI
- 🌈 Dynamic color schemes
- ⌨️ Anti-paste protection
- ♿ Accessibility support
- 🔄 Refresh capability
- 📱 Mobile-friendly design

## Installation

Using npm:
```bash
npm install the-last-spelling-bee-re-captcha
```

Using yarn:
```bash
yarn add the-last-spelling-bee-re-captcha
```

## Quick Start

```jsx
import { TheLastSpellingBeeReCaptcha } from 'the-last-spelling-bee-re-captcha';

function MyForm() {
    const handleVerification = (verified) => {
        if (verified) {
            console.log('User verified!');
        }
    };

    return (
        <TheLastSpellingBeeReCaptcha
            reCaptchaKey="your-api-key"
            onVerifyCaptcha={handleVerification}
        />
    );
}
```

## API Reference

### TheLastSpellingBeeReCaptcha Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `reCaptchaKey` | `string` | Required | Your API key from TheLastSpellingBee |
| `questionType` | `'CHARACTERS' \| 'NUMBERS' \| 'RANDOM' \| 'COMPLEX'` | `'CHARACTERS'` | Type of question to display |
| `wordLength` | `number` | `3` | Length of the word/answer |
| `onVerifyCaptcha` | `(verified: boolean) => void` | Required | Callback function called after verification |

### Question Types

#### CHARACTERS
- Question Format: `D A D D Y`
- Expected Answer: `4 1 4 4 25`
- Description: Convert letters to their position in the alphabet

#### NUMBERS
- Question Format: `4 1 4 4 25`
- Expected Answer: `D A D D Y`
- Description: Convert numbers to their corresponding letters

#### RANDOM
- Description: Randomly alternates between CHARACTERS and NUMBERS

#### COMPLEX
- Question Format: `D 1 D 4 Y`
- Expected Answer: `4 A 4 D 25`
- Description: Mixed format requiring both letter-to-number and number-to-letter conversion

## Security Features

- Prevents copy-paste actions
- Requires manual typing
- Character-by-character validation
- Rate limiting on API requests
- Secure API key validation

## Examples

### Basic Usage
```jsx
<TheLastSpellingBeeReCaptcha
    reCaptchaKey="your-api-key"
    onVerifyCaptcha={(verified) => {
        if (verified) {
            // Handle successful verification
        }
    }}
/>
```

### Custom Configuration
```jsx
<TheLastSpellingBeeReCaptcha
    reCaptchaKey="your-api-key"
    questionType="COMPLEX"
    wordLength={5}
    onVerifyCaptcha={(verified) => {
        if (verified) {
            // Handle successful verification
        } else {
            // Handle failed verification
        }
    }}
/>
```

## Error Handling

The component includes built-in error handling with user-friendly toast notifications for:
- Invalid API keys
- Network errors
- Invalid input attempts
- Copy-paste attempts
- Verification failures

## Getting an API Key

1. Visit [TheLastSpellingBee](https://thelastspellingbee.com/api-key)
2. Create an account or log in
3. Generate your API key
4. Use the key in your application

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT © [TheLastSpellingBee](https://thelastspellingbee.com)

## Support

- Documentation: [Full API Reference](https://thelastspellingbee.com/api-reference)
- [https://thelastspellingbee.com/contact-us](https://thelastspellingbee.com/contact-us)

## Credits

- [TheLastSpellingBee](https://thelastspellingbee.com)
- [Sulei Golden](https://github.com/suleigolden)
- [Chakra UI](https://chakra-ui.com)
- [React](https://reactjs.org)
- [Typescript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [Vercel](https://vercel.com)
