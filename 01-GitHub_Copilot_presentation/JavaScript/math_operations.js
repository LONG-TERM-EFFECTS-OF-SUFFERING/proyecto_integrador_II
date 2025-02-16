/**
 * Returns the sum of two numbers.
 *
 * @param {number} a - The first addend.
 * @param {number} b - The second addend.
 * @returns {number} the sum of the two numbers.
 */
function add(a, b) {
	return a + b;
}

/**
 * Returns the product of two numbers.
 *
 * @param {number} a - The multiplicand.
 * @param {number} b - The multiplier.
 * @returns {number} the product of the two numbers.
 */
function multiply(a, b) {
	return a * b;
}

/**
 * Returns the division of a by b.
 *
 * @param {number} a - The dividend.
 * @param {number} b - The divisor.
 * @throws {Error} If b is zero.
 * @returns {number} the division result.
 */
function divide(a, b) {
	if (b === 0)
		throw new Error("Cannot divide by zero");
	return a / b;
}


module.exports = { add, multiply, divide };
