# the-last-spelling-bee-re-captcha

A simple and framework to generate and verify TheLastSpellingBee ReCaptcha. This package currently supports [TheLastSpellingBeeReCaptcha V1](https://thelastspellingbee.com/api-reference).

## Installation

```bash

npm install the-last-spelling-bee-re-captcha

yarn add the-last-spelling-bee-re-captcha

```

## Usage

```bash

import { TheLastSpellingBeeReCaptcha } from 'the-last-spelling-bee-re-captcha';

```

### Props

The `TheLastSpellingBeeReCaptcha` component accepts the following props:

-   _questionType:_ `string` (optional): Specifies the type of question to be displayed. Available options are `CHARACTERS`, `NUMBERS`, `RANDOM`, or `COMPLEX`. If not provided, the default question
    type is `CHARACTERS`..
-   _wordLength_ `number` (optional): Specifies the length of the character word that users need to answer. For example, if set to 3, users will be asked to provide a 3-character word. The default
    value is 3.
-   _reCaptchaKey_ `secret` (required): A string representing the API key to use for the request.
-   _refreshonVerifyReCaptcha_ (optional): Specifies whether to refresh the ReCaptcha widget after a successful verification. Default is `false`.
-   _refreshReCaptcha_ (optional): Specifies whether to refresh the ReCaptcha widget on every render. Default is `false`.
-   _onVerifyCaptcha_ (required): A callback function that will be called when the user completes the ReCaptcha challenge. It receives the verification result as a parameter.

### Examples

-   Here is an example usage of the `TheLastSpellingBeeReCaptcha` component:.
-   Get your ReCaptcha API Key here [TheLastSpellingBeeTest Recaptcha API KEY](https://thelastspellingbee.com/api-key)

```js
<TheLastSpellingBeeReCaptcha
    reCaptchaKey={'your-TheLastSpellingBee-key'}
    onVerifyCaptcha={(result) => {
        // Handle the captcha verification result
        console.log('Result: ', result);
    }}
/>
```

### Example Response

An example response from the `TheLastSpellingBeeReCaptcha` after a successful verification:

```js
{
  "status": 200,
  "result": true
}

```

### Notes

-   Make sure to replace 'your-TheLastSpellingBee-key' with your actual TheLastSpellingBee ReCaptcha API key.
-   The onVerifyCaptcha callback function should handle the verification result according to your application's requirements.
-   The package provides a default question type of CHARACTERS and a default word length of 3 if not explicitly specified.
-   Please refer to the documentation of TheLastSpellingBee ReCaptcha for more information (https://thelastspellingbee.com/api-reference)

## Error Handling

The `TheLastSpellingBeeReCaptcha` component may encounter errors during initialization or verification. You can handle these errors by wrapping the component in a try-catch block or utilizing the `onError`
prop.

```js
try {
    <TheLastSpellingBeeReCaptcha
        reCaptchaKey={'your-TheLastSpellingBee-key'}
        onVerifyCaptcha={(result) => {
            // Handle the captcha verification result
            console.log('Result: ', result);
        }}
        onError={(error) => {
            // Handle the error
            console.error('Error: ', error);
        }}
    />;
} catch (error) {
    // Handle the result error
    console.error('Error: ', error);
}
```

The `onError` prop allows you to specify a callback function that will be called when an error occurs. It receives the error object as a parameter.

## Dependencies

The `the-last-spelling-bee-re-captcha` package has one dependency: `axios`. This package is used to make HTTP requests to the ReCaptcha API.

## Contribution

If you would like to contribute to the `the-last-spelling-bee-re-captcha` package, you can do so by submitting a pull request on GitHub. The package repository can be found at
https://github.com/suleigolden/thelastspellingbee-npm-package

## Credits

The `the-last-spelling-bee-re-captcha` package was created by TheLastCodeBender and is maintained by TheLastSpellingBeeGTest.

The package was inspired by the ReCaptcha API provided by Google, which is used by millions of websites to protect against spam and abuse.

We would like to thank the developers of the following open source packages, which were used in the creation of this package:

-   `axios`: A promise-based HTTP client for the browser and Node.js.
-   `fetch`: A browser API for making HTTP requests.
-   `Jest`: A JavaScript testing framework used for unit testing.

We also want to thank the many contributors who have helped improve the package through bug reports, feature requests, and code contributions. Your contributions are greatly appreciated!

If you have any questions or feedback about the package, please don't hesitate to contact us. We would be happy to hear from you.

## License

Copyright (c) 2023 TheLastSpellingBee

MIT (http://www.opensource.org/licenses/mit-license.php)
