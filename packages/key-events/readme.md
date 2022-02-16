# Key Events

An easy way to handle global keyboard event.

## Usage

```sh
pnpm i @0x-jerry/key-events
```

```ts
import { createKeyboardHandler } from '@0x-jerry/key-events'

const onKeydown = createKeyboardHandler((listener) => window.addEventListener('keydown', listener))

onKeydown('k', (e) => console.log('K has been pressed.', e))

onKeydown('alt+k', (e) => console.log('Alt + K has been pressed.', e))
```
