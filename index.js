const bin = (v) => (v ? 1 : 0);

export const BUF = (A) => bin(A);
export const NOT = (...input) => bin(input.every((A) => !A));
export const AND = (...input) => bin(input.reduce((A, B) => A && B));
export const OR = (...input) => bin(input.reduce((A, B) => A || B));
export const NAND = (...input) => bin(!AND(...input));
export const NOR = (...input) => bin(!OR(...input));
export const XOR = (A, B) => bin((A && !B) || (!A && B));
export const XNOR = (A, B) => bin(!((A && !B) || (!A && B)));
