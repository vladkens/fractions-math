# fractions-math

<div align="center">
  <a href="https://npmjs.org/package/fractions-math">
    <img src="https://badgen.net/npm/v/fractions-math" alt="version" />
  </a>
  <a href="https://github.com/vladkens/fractions-math/actions">
    <img src="https://github.com/vladkens/fractions-math/workflows/test/badge.svg" alt="test status" />
  </a>
  <a href="https://packagephobia.now.sh/result?p=fractions-math">
    <img src="https://badgen.net/packagephobia/publish/fractions-math" alt="size" />
  </a>
  <a href="https://npmjs.org/package/fractions-math">
    <img src="https://badgen.net/npm/dm/fractions-math" alt="downloads" />
  </a>
  <a href="https://github.com/vladkens/fractions-math/blob/main/LICENSE">
    <img src="https://badgen.net/github/license/vladkens/fractions-math" alt="license" />
  </a>
</div>

Implementing [`fractions`](https://docs.python.org/3/library/fractions.html) module from The Python Standard Library on TypeScript.

## Install

```sh
yarn add fractions-math
```

## Usage

```typescript
import { Fraction, fraq } from "fractions-math"

const f1 = new Fraction(1, 2)
const f2 = fraq(1.5)
const f3 = f1.add(f2).toString() // -> "2" (0.5 + 1.5)
const f4 = f3.mul(f2).toString() // -> "3" (2 * 1.5)
const f5 = f4.div(f1).toString() // -> "6" (3 / 0.5)
```

## API

### `Fraction.make(...args: [Fraq] | [number, number])`

Helper function to create fraction from various inputs.
Also alias available: `fraq`

```typescript
type Fraq = Fraction | [number, number] | number | string

Fraction.make(1, 2).toPair() // -> [1, 2]
fraq(1, 2).toPair() // ALIAS

fraq(2).toPair() // -> [2, 1]
fraq([2, 1]).toPair() // -> [2, 1]
fraq(0.5).toPair() // -> [1, 2]
```

### `new Fraction(n: number, d = 1, reduce = true)`

Creates a fraction taking two numbers – numenator and denominator. Denominator has default value `1`. By default, the fraction is reduced to the minimum form.

```typescript
new Fraction(1, 2).toPair() // -> [1, 2]
new Fraction(2).toPair() // -> [2, 1]
new Fraction(5, 10).toPair() // -> [1, 2]
new Fraction(5, 10, false).toPair() // -> [5, 10]
```

### `.toString()`

```typescript
fraq(1, 2).toString() // -> "1/2"
fraq(3, 3).toString() // -> "3"
fraq(-1).toString() // -> "-1"
fraq(1, -2).toString() // -> "-1/2"
```

### `.toNumber()`

```typescript
fraq(1, 2).toString() // -> 0.5
```

### `.limit(max: number = 10_000)`

Finds the closest Fraction that has denominator at most `max`.

```typescript
fraq(Math.PI).limit(1000).toString() // -> "355/113"
fraq(1.1).limit().toString() // -> "11/10"
```

### `.add(b: Fraq)`

```typescript
fraq(1, 2).add([-1, 2]).toString() // -> "0"
fraq(1, 2).add(1).toString() // -> "3/2"
```

### `.sub(b: Fraq)`

```typescript
fraq(1, 2).sub([1, 2]).toString() // -> "0"
fraq(1, 2).sub(1).toString() // -> "-1/2"
```

### `.mul(b: Fraq)`

```typescript
fraq(1, 2).mul([1, 2]).toString() // -> "1/4"
fraq(1, 2).mul(1.5).toString() // -> "3/4"
```

### `.div(b: Fraq)`

```typescript
fraq(1, 2).div([1, 2]).toString() // -> "1"
fraq(1, 2).div(1.5).toString() // -> "1/3"
fraq(1, 2).div(0).toString() // throws Error
```

### `.eq(b: Fraq)`

```typescript
fraq(1, 2).eq(0.5) // -> true
fraq(1, 2).eq([1, 3]) // -> false
```

### `.lt(b: Fraq) -> boolean`

### `.lte(b: Fraq) -> boolean`

### `.gt(b: Fraq) -> boolean`

### `.gte(b: Fraq) -> boolean`
