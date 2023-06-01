/**
 * Most of this file is rewritten from the Python Standard Library
 * Regards to Sjoerd Mullender & Jeffrey Yasskin
 * https://github.com/python/cpython/blob/3.11/Lib/fractions.py
 */

export type Fraq = Fraction | [number, number] | number | string
type Parts = { s: 1 | -1; c: number; n: number; d: number }

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
  if (args.length === 2) return new Fraction(...args)

  let val = args[0]
  if (val instanceof Fraction) return val
  if (Array.isArray(val)) return new Fraction(...val)

  val = val.toString().trim()

  if (/^([-]?\d+)$/.test(val)) {
    return new Fraction(parseInt(val, 10), 1)
  }

  const m0 = /^([-]?\d*)\.(\d+)$/.exec(val)
  if (m0) {
    const x = parseFloat(val)
    if (Number.isInteger(x)) return new Fraction(x, 1)

    const [a, b] = x
      .toString()
      .split(".")
      .map((x) => parseInt(x, 10))

    const s = x < 0 ? -1 : 1
    const d = 10 ** m0[2].length
    const n = (Math.abs(a) * d + b) * s

    return new Fraction(n, d).reduce()
  }

  const m1 = /^([-]?\d+)\s+([-]?\d+)\s*\/\s*([-]?\d+)$/.exec(val)
  if (m1) {
    const [c, n, d] = m1.slice(1).map((x) => parseInt(x, 10))
    const s = Math.sign(c) * Math.sign(n) * Math.sign(d)

    const b = Math.abs(d)
    const a = (Math.abs(c) * b + Math.abs(n)) * s
    return new Fraction(a, b)
  }

  const m2 = /^([-]?\d+)\s*\/\s*([-]?\d+)$/.exec(val)
  if (m2) {
    const [n, d] = m2.slice(1).map((x) => parseInt(x, 10))
    return new Fraction(n, d)
  }

  throw new Error("ValueError")
}

export class Fraction {
  public n: number
  public d: number

  constructor(n: number, d: number = 1, reduce = false) {
    if (d === 0) throw new Error("ZeroDivisionError")
    if (!Number.isInteger(n) || !Number.isInteger(d)) throw new Error("TypeError")

    const a = Math.abs(n) * (Math.sign(n) * Math.sign(d))
    const b = a === 0 ? 1 : Math.abs(d)
    const g = reduce ? gcd(a, b) : 1

    this.n = a / g
    this.d = b / g
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

  reduce() {
    let g = gcd(this.n, this.d)
    return new Fraction(this.n / g, this.d / g)
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

  // printer

  toParts(): Parts {
    const s = this.n < 0 ? -1 : 1
    const c = Math.floor(Math.abs(this.n) / this.d)
    const n = Math.abs(this.n) % this.d
    const d = this.d
    return n === 0 ? { s, c: 0, n: c, d } : { s, c, n, d }
  }

  toAscii(): string {
    let t: Fraction
    t = this.limit(16)

    const p = t.toParts()
    if (p.d === 1) return `${p.s * p.n}`
    if (p.c === 0) return `${p.s * p.n}/${p.d}`
    return `${p.s * p.c} ${p.n}/${p.d}`
  }
}
