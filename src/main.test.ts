import { test } from "uvu"
import { equal, throws } from "uvu/assert"
import { Fraction, fraq, gcd } from "../src/main"

test("should calc gcd", () => {
  equal(gcd(1, 1), 1)
  equal(gcd(2, 1), 1)
  equal(gcd(3, 0), 3)
  equal(gcd(3, 5), 1)
  equal(gcd(6, 10), 2)
  equal(gcd(15, 25), 5)
  equal(gcd(24, 36), 12)
  equal(gcd(33, 99), 33)
  equal(gcd(100, 200), 100)
  equal(gcd(121, 242), 121)
  equal(gcd(999, 1000), 1)
  equal(gcd(1111, 2222), 1111)
  equal(gcd(12345, 6789), 3)
  equal(gcd(270, 192), 6)

  equal(gcd(0, 1), 1)
  equal(gcd(0, 2), 2)
  equal(gcd(2, 0), 2)
  equal(gcd(9007199254740881, 9007199254740997), 1)
  throws(() => gcd(3.1415, 1), /TypeError/i)
})

test("should create fraction", () => {
  equal(new Fraction(1, 1).toPair(), [1, 1])
  equal(new Fraction(1, 2).toPair(), [1, 2])
  equal(new Fraction(-1, 2).toPair(), [-1, 2])
  equal(new Fraction(1, -2).toPair(), [-1, 2])
  equal(new Fraction(-1, -2).toPair(), [1, 2])
  equal(new Fraction(4, 2).toPair(), [2, 1]) // reduced
  equal(new Fraction(4, 2, false).toPair(), [4, 2])
  equal(new Fraction(0, 1).toPair(), [0, 1])
  equal(new Fraction(0, 2).toPair(), [0, 1])

  equal(new Fraction(2).toPair(), [2, 1])
  throws(() => new Fraction(1, 0), /ZeroDivisionError/i)
  throws(() => new Fraction(3.1415, 1), /TypeError/i)

  equal(fraq([1, 2]).toPair(), [1, 2])
  equal(fraq(1, 2).toPair(), [1, 2])
  equal(fraq(2).toPair(), [2, 1])
  equal(fraq(new Fraction(2)).toPair(), [2, 1])

  equal(fraq(0.5).toPair(), [1, 2])
  equal(fraq(1.5).toPair(), [3, 2])
  equal(fraq(-0.5).toPair(), [-1, 2])
  equal(fraq(-1.5).toPair(), [-3, 2])
})

test("should abs fraction", () => {
  equal(new Fraction(1, 1).abs().toPair(), [1, 1])
  equal(new Fraction(1, 2).abs().toPair(), [1, 2])
  equal(new Fraction(-1, 2).abs().toPair(), [1, 2])
  equal(new Fraction(1, -2).abs().toPair(), [1, 2])
  equal(new Fraction(-1, -2).abs().toPair(), [1, 2])
})

test("should add fraction", () => {
  equal(new Fraction(1, 1).add([1, 1]).toPair(), [2, 1])
  equal(new Fraction(1, 1).add([1, 2]).toPair(), [3, 2])
  equal(new Fraction(1, 2).add([1, 1]).toPair(), [3, 2])
  equal(new Fraction(1, 2).add([1, 2]).toPair(), [1, 1])
  equal(new Fraction(1, 2).add([1, 3]).toPair(), [5, 6])

  equal(new Fraction(-1, 2).add([1, 2]).toPair(), [0, 1])
  equal(new Fraction(1, 2).add([-1, 2]).toPair(), [0, 1])
  equal(new Fraction(1, 2).add([1, -2]).toPair(), [0, 1])
  equal(new Fraction(1, -2).add([1, 2]).toPair(), [0, 1])
})

test("should sub fraction", () => {
  equal(new Fraction(1, 1).sub([1, 1]).toPair(), [0, 1])
  equal(new Fraction(1, 1).sub([1, 2]).toPair(), [1, 2])
  equal(new Fraction(1, 2).sub([1, 1]).toPair(), [-1, 2])
  equal(new Fraction(1, 2).sub([1, 2]).toPair(), [0, 1])
  equal(new Fraction(1, 2).sub([1, 3]).toPair(), [1, 6])
  equal(new Fraction(1, 3).sub([1, 2]).toPair(), [-1, 6])
  equal(new Fraction(1, 3).sub([1, 3]).toPair(), [0, 1])
  equal(new Fraction(1, 3).sub([1, 4]).toPair(), [1, 12])
  equal(new Fraction(1, 4).sub([1, 3]).toPair(), [-1, 12])

  equal(new Fraction(-1, 2).sub([1, 2]).toPair(), [-1, 1])
  equal(new Fraction(1, 2).sub([-1, 2]).toPair(), [1, 1])
  equal(new Fraction(1, 2).sub([1, -2]).toPair(), [1, 1])
})

test("should mul fraction", () => {
  equal(new Fraction(1, 2).mul([3, 4]).toPair(), [3, 8])
  equal(new Fraction(1, 2).mul([-3, 4]).toPair(), [-3, 8])
  equal(new Fraction(-1, 2).mul([-3, 4]).toPair(), [3, 8])
  equal(new Fraction(1, 2).mul(-3).toPair(), [-3, 2])
  equal(new Fraction(-1, 2).mul(3).toPair(), [-3, 2])
  equal(new Fraction(1, 2).mul(0).toPair(), [0, 1])
  equal(new Fraction(-1, 2).mul(0).toPair(), [0, 1])
  equal(new Fraction(2, 3).mul([2, 3]).toPair(), [4, 9])
  equal(new Fraction(3, 4).mul([4, 3]).toPair(), [1, 1])
  equal(new Fraction(3, 2).mul([2, 5]).toPair(), [3, 5])
  equal(new Fraction(2, 5).mul([3, 2]).toPair(), [3, 5])
  equal(new Fraction(-3, 4).mul([-2, 5]).toPair(), [3, 10])
  equal(new Fraction(3, -4).mul([2, 5]).toPair(), [-3, 10])
  equal(new Fraction(-2, -3).mul([-1, -4]).toPair(), [1, 6])
  equal(new Fraction(1, -4).mul([-2, 3]).toPair(), [1, 6])
  equal(new Fraction(-1, 3).mul([4, 5]).toPair(), [-4, 15])
  equal(new Fraction(-2, 3).mul([5, 7]).toPair(), [-10, 21])
})

test("should div fraction", () => {
  equal(new Fraction(1, 2).div([3, 4]).toPair(), [2, 3])
  equal(new Fraction(1, 2).div([-3, 4]).toPair(), [-2, 3])
  equal(new Fraction(-1, 2).div([-3, 4]).toPair(), [2, 3])
  equal(new Fraction(1, 2).div(-3).toPair(), [-1, 6])
  equal(new Fraction(-1, 2).div(3).toPair(), [-1, 6])
  equal(new Fraction(2, 3).div([2, 3]).toPair(), [1, 1])
  equal(new Fraction(3, 4).div([4, 3]).toPair(), [9, 16])
  equal(new Fraction(3, 2).div([2, 5]).toPair(), [15, 4])
  equal(new Fraction(2, 5).div([3, 2]).toPair(), [4, 15])
  equal(new Fraction(-3, 4).div([-2, 5]).toPair(), [15, 8])
  equal(new Fraction(3, -4).div([2, 5]).toPair(), [-15, 8])
  equal(new Fraction(-2, -3).div([-1, -4]).toPair(), [8, 3])
  equal(new Fraction(1, -4).div([-2, 3]).toPair(), [3, 8])
  equal(new Fraction(-1, 3).div([4, 5]).toPair(), [-5, 12])
  equal(new Fraction(-2, 3).div([5, 7]).toPair(), [-14, 15])

  throws(() => new Fraction(1, 0).div(0), /ZeroDivisionError/i)
})

test("should compare fraction", () => {
  equal(new Fraction(1, 2).gt([1, 3]), true)
  equal(new Fraction(1, 2).gt([1, 2]), false)
  equal(new Fraction(1, 2).gt([1, 1]), false)

  equal(new Fraction(1, 2).gte([1, 3]), true)
  equal(new Fraction(1, 2).gte([1, 2]), true)
  equal(new Fraction(1, 2).gte([1, 1]), false)

  equal(new Fraction(1, 2).lt([1, 3]), false)
  equal(new Fraction(1, 2).lt([1, 2]), false)
  equal(new Fraction(1, 2).lt([1, 1]), true)

  equal(new Fraction(1, 2).lte([1, 3]), false)
  equal(new Fraction(1, 2).lte([1, 2]), true)
  equal(new Fraction(1, 2).lte([1, 1]), true)
})

test("should limit denominator", () => {
  equal(new Fraction(1, 2).limit().toPair(), [1, 2])
  equal(new Fraction(33, 100).limit().toPair(), [33, 100])
  equal(new Fraction(333, 1000).limit().toPair(), [333, 1000])
  equal(new Fraction(3_333, 10_000).limit().toPair(), [3333, 10_000])
  equal(new Fraction(33_333, 100_000).limit().toPair(), [1, 3])
})

test("other", () => {
  equal(new Fraction(1, 2).toString(), "1/2")
  equal(new Fraction(3, 2).toString(), "3/2")
  equal(new Fraction(1, -2).toString(), "-1/2")
  equal(new Fraction(-1, 2).toString(), "-1/2")
  equal(new Fraction(-1, -2).toString(), "1/2")
  equal(new Fraction(1, 1).toString(), "1")
  equal(new Fraction(2, 1).toString(), "2")
  equal(new Fraction(-1, 1).toString(), "-1")
  equal(new Fraction(1, -1).toString(), "-1")
  equal(new Fraction(-1, -1).toString(), "1")
  equal(new Fraction(0, 1).toString(), "0")
  equal(new Fraction(0, -1).toString(), "0")
  equal(new Fraction(6, 2).toString(), "3")
  throws(() => new Fraction(0, 0).toString(), /ZeroDivisionError/i)

  equal(new Fraction(1, 2).toParts(), { s: 1, c: 0, n: 1, d: 2 })
  equal(new Fraction(3, 2).toParts(), { s: 1, c: 1, n: 1, d: 2 })
  equal(new Fraction(1, -2).toParts(), { s: -1, c: 0, n: 1, d: 2 })
  equal(new Fraction(-1, 2).toParts(), { s: -1, c: 0, n: 1, d: 2 })
  equal(new Fraction(-1, -2).toParts(), { s: 1, c: 0, n: 1, d: 2 })
  equal(new Fraction(1, 1).toParts(), { s: 1, c: 0, n: 1, d: 1 })
  equal(new Fraction(2, 1).toParts(), { s: 1, c: 0, n: 2, d: 1 }) /// ???
  equal(new Fraction(-1, 1).toParts(), { s: -1, c: 0, n: 1, d: 1 })
  equal(new Fraction(1, -1).toParts(), { s: -1, c: 0, n: 1, d: 1 })
  equal(new Fraction(-1, -1).toParts(), { s: 1, c: 0, n: 1, d: 1 })
  equal(new Fraction(0, 1).toParts(), { s: 1, c: 0, n: 0, d: 1 })
  equal(new Fraction(0, -1).toParts(), { s: 1, c: 0, n: 0, d: 1 })
})

test.run()