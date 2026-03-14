# TheLastSpellingBee ReCaptcha

A modern, user-friendly CAPTCHA component for React applications that uses spelling and character conversion challenges. This package provides a secure and accessible way to verify human users.

![NPM Version](https://img.shields.io/npm/v/the-last-spelling-bee-re-captcha)
![License](https://img.shields.io/npm/l/the-last-spelling-bee-re-captcha)

## Features

- 🔒 Secure character-based verification
- 🎨 Framework-agnostic styling—custom CSS, works in any React project
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

Import the component **and** the styles (required) in your app:

```jsx
import { TheLastSpellingBeeReCaptcha } from 'the-last-spelling-bee-re-captcha';
// Import the default styles (required for layout and theming)
import 'the-last-spelling-bee-re-captcha/dist/the-last-spelling-bee-re-captcha.css';

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

The package ships with a single, scoped CSS file (no other UI libraries). You can override the look with your own CSS by targeting the `.tlsb-recaptcha` class.

## API Reference

### TheLastSpellingBeeReCaptcha Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `reCaptchaKey` | `string` | Required | Your API key from TheLastSpellingBee |
| `questionType` | `'CHARACTERS' \| 'NUMBERS' \| 'RANDOM' \| 'COMPLEX'` | `'CHARACTERS'` | Type of question to display |
| `wordLength` | `number` | `3` | Length of the word/answer |
| `onVerifyCaptcha` | `(verified: boolean) => void` | Required | Callback function called after verification |
| `isDarkMode` | `boolean` | `false` | Enables dark mode styling for the widget |
| `darkModeColor` | `string` | `'#0b1437'` | Custom background color used when `isDarkMode` is `true` |

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

### Dark Mode Example
```jsx
<TheLastSpellingBeeReCaptcha
    reCaptchaKey="your-api-key"
    onVerifyCaptcha={(verified) => {
        if (verified) {
            // Handle successful verification
        }
    }}
    isDarkMode={true}
    // Optional: provide your own dark background color
    darkModeColor="#101827"
/>
```

## Styling

The component uses a single, scoped CSS file with no external UI dependencies. Always import it once in your app:

```js
import 'the-last-spelling-bee-re-captcha/dist/the-last-spelling-bee-re-captcha.css';
```

All styles are scoped under the `.tlsb-recaptcha` class, so they won’t conflict with your app. You can override variables or classes in your own CSS. The layout is responsive and mobile-friendly.

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
- [React](https://reactjs.org)
- [Typescript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [Vercel](https://vercel.com)
