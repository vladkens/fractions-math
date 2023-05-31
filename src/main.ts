/**
 * Most of this file is rewritten from the Python Standard Library
 * Regards to Sjoerd Mullender & Jeffrey Yasskin
 * https://github.com/python/cpython/blob/3.11/Lib/fractions.py
 */

export type Fraq = Fraction | [number, number] | number
type Parts = { s: 1 | -1; c: Number; n: Number; d: Number }

export const gcd = (a: number, b: number): number => {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new Error("TypeError")
  }

  if (a === 0) return b
  if (b === 0) return a

  a = Math.abs(a)
  b = Math.abs(b)

  while (b > 0) {
    const k = a % b
    a = b
    b = k
  }

  return a
}

export const fraq = (...args: [Fraq] | [number, number]): Fraction => {
  return Fraction.make(...args)
}

export class Fraction {
  public n: number
  public d: number

  constructor(n: number, d: number = 1, reduce = true) {
    if (d === 0) throw new Error("ZeroDivisionError")

    let a = Math.abs(n) * (Math.sign(n) * Math.sign(d))
    let b = n === 0 ? 1 : Math.abs(d)
    let g = reduce ? gcd(a, b) : 1

    this.n = a / g
    this.d = b / g
  }

  static make(...args: [Fraq] | [number, number]) {
    if (args.length === 2) return new Fraction(...args)

    const val = args[0]
    if (val instanceof Fraction) return val

    if (typeof val === "number") {
      if (Number.isInteger(val)) return new Fraction(val, 1)

      const [c, r] = val.toString().split(".").map(Number)
      const d = Math.pow(10, r.toString().length)
      const n = (Math.abs(c) * d + r) * Math.sign(val)
      return new Fraction(n, d)
    }

    return new Fraction(...val)
  }

  toString() {
    return this.d === 1 ? `${this.n}` : `${this.n}/${this.d}`
  }

  toNumber(): number {
    return this.n / this.d
  }

  toPair(): [number, number] {
    return [this.n, this.d]
  }

  toParts(): Parts {
    const s = this.n < 0 ? -1 : 1
    const c = Math.floor(Math.abs(this.n) / this.d)
    const n = Math.abs(this.n) % this.d
    const d = this.d
    return n === 0 ? { s, c: 0, n: c, d } : { s, c, n, d }
  }

  limit(max: number = 10_000): Fraction {
    max = Math.max(1, Math.ceil(max))
    if (this.d <= max) return new Fraction(this.n, this.d)

    let [n, d] = [this.n, this.d]
    let [p0, q0, p1, q1] = [0, 1, 1, 0]

    while (true) {
      const a = Math.floor(n / d)
      const q2 = q0 + a * q1
      if (q2 > max) break
      ;[p0, q0, p1, q1] = [p1, q1, p0 + a * p1, q2]
      ;[n, d] = [d, n - a * d]
    }

    const k = Math.floor((max - q0) / q1)
    const b1 = new Fraction(p0 + k * p1, q0 + k * q1, false)
    const b2 = new Fraction(p1, q1, false)

    const t1 = b2.sub(this).abs()
    const t2 = b1.sub(this).abs()
    return t1.lte(t2) ? b2 : b1
  }

  // math

  abs(): Fraction {
    return new Fraction(Math.abs(this.n), Math.abs(this.d))
  }

  add(b: Fraq): Fraction {
    const that = fraq(b)

    let [na, da] = [this.n, this.d]
    let [nb, db] = [that.n, that.d]
    const g = gcd(da, db)
    if (g === 1) return new Fraction(na * db + da * nb, da * db)

    const s = Math.floor(da / g)
    const t = na * Math.floor(db / g) + nb * s
    const g2 = gcd(t, g)
    if (g2 === 1) return new Fraction(t, s * db)

    return new Fraction(Math.floor(t / g2), s * Math.floor(db / g2))
  }

  sub(b: Fraq): Fraction {
    const that = fraq(b)

    let [na, da] = [this.n, this.d]
    let [nb, db] = [that.n, that.d]
    const g = gcd(da, db)
    if (g === 1) return new Fraction(na * db - da * nb, da * db)

    const s = Math.floor(da / g)
    const t = na * Math.floor(db / g) - nb * s
    const g2 = gcd(t, g)
    if (g2 === 1) return new Fraction(t, s * db)

    return new Fraction(Math.floor(t / g2), s * Math.floor(db / g2))
  }

  mul(b: Fraq): Fraction {
    const that = fraq(b)

    let [na, da] = [this.n, this.d]
    let [nb, db] = [that.n, that.d]
    const g1 = gcd(na, db)
    if (g1 > 1) {
      na = Math.floor(na / g1)
      db = Math.floor(db / g1)
    }

    const g2 = gcd(nb, da)
    if (g2 > 1) {
      nb = Math.floor(nb / g2)
      da = Math.floor(da / g2)
    }

    return new Fraction(na * nb, db * da)
  }

  div(b: Fraq): Fraction {
    const that = fraq(b)

    let [na, da] = [this.n, this.d]
    let [nb, db] = [that.n, that.d]

    const g1 = gcd(na, nb)
    if (g1 > 1) {
      na = Math.floor(na / g1)
      nb = Math.floor(nb / g1)
    }

    const g2 = gcd(db, da)
    if (g2 > 1) {
      da = Math.floor(da / g2)
      db = Math.floor(db / g2)
    }

    let [n, d] = [na * db, nb * da]
    if (d < 0) {
      n = -n
      d = -d
    }

    return new Fraction(n, d)
  }

  // comparison

  eq(b: Fraq) {
    const that = fraq(b)
    return this.n * that.d === this.d * that.n
  }

  // a < b
  lt(b: Fraq) {
    const that = fraq(b)
    return this.n * that.d < this.d * that.n
  }

  // a <= b
  lte(b: Fraq) {
    const that = fraq(b)
    return this.n * that.d <= this.d * that.n
  }

  // a > b
  gt(b: Fraq) {
    const that = fraq(b)
    return this.n * that.d > this.d * that.n
  }

  // a >= b
  gte(b: Fraq) {
    const that = fraq(b)
    return this.n * that.d >= this.d * that.n
  }
}