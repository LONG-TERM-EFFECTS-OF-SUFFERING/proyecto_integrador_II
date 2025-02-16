def add(a: float, b: float) -> float:
	"""Returns the sum of two numbers.

	Parameters
	----------
		a: float

			The first addend.

		b: float

			The second addend.

		Returns
		-------
			float

				The addition of the two numbers.
	"""
	return a + b

def multiply(a: float, b: float) -> float:
	"""Returns the product of two numbers.

	Parameters
	----------
		a: float

			The multiplicand.

		b: float

			The multiplier.

		Returns
		-------
			float

				The product of the two numbers.
	"""
	return a * b

def divide(a: float, b: float) -> float:
	""" Returns the division of a by b.

	Parameters
	----------

		a : float
			The dividend.

		b : float
			The divisor.

	Raises
	------
		ValueError

			If b is zero.

	Returns
	-------
		float
			The division of the two numbers.
	"""
	if b == 0:
		raise ValueError("Cannot divide by zero")
	return a / b
