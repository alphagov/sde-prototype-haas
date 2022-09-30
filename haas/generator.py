import itertools
import random
from haas.hex import hex_codes


ALL_HEXAGRAMS = ["".join(hexagram) for hexagram in itertools.product("01", repeat=6)]


def generate_hex(n):
    return [hex_codes[hexagram] for hexagram in random.choices(ALL_HEXAGRAMS, k=n)]


def generate_reading(x):
    return "not implemented yet"
