import { BUF, NOT, AND, OR, NAND, NOR, XOR, XNOR } from "../index";

const n = {
  AND: "•",
  OR: "+",
  XOR: "⊕",
  NOT: "¯",
};
// const n = {
//   AND: "∧",
//   OR: "∨",
//   NOT: "¬",
// };
// const n = {
//   AND: "AND",
//   OR: "OR",
//   NOT: "NOT ",
// };

const inputs = {
  single: [{ B: 0 }, { B: 1 }],
  two: [
    { B: 0, C: 0 },
    { B: 0, C: 1 },
    { B: 1, C: 0 },
    { B: 1, C: 1 },
  ],
  three: [
    { B: 0, C: 0, D: 0 },
    { B: 0, C: 0, D: 1 },
    { B: 0, C: 1, D: 0 },
    { B: 0, C: 1, D: 1 },
    { B: 1, C: 0, D: 0 },
    { B: 1, C: 0, D: 1 },
    { B: 1, C: 1, D: 0 },
    { B: 1, C: 1, D: 1 },
  ],
};

describe("Boolean theorems with one variable", () => {
  describe("Identity", () => {
    const theorem = `$B ${n.AND} 1 = $B`;
    const dual = `$B ${n.OR} 0 = $B`;

    describe(`Theorem: ${remove$(theorem)}`, () => {
      it.each(inputs.single)(theorem, ({ B }) => eq(B, AND(B, 1)));
    });
    describe(`Dual: ${remove$(dual)}`, () => {
      it.each(inputs.single)(dual, ({ B }) => eq(OR(B, 0), B));
    });
  });

  describe("Null element", () => {
    const theorem = `$B ${n.AND} 0 = 0`;
    const dual = `$B ${n.OR} 1 = 1`;

    describe(`Theorem: ${remove$(theorem)}`, () => {
      it.each(inputs.single)(theorem, ({ B }) => eq(AND(B, 0), 0));
    });
    describe(`Dual: ${remove$(dual)}`, () => {
      it.each(inputs.single)(dual, ({ B }) => eq(OR(B, 1), 1));
    });
  });

  describe("Idempotency", () => {
    const theorem = `$B ${n.AND} $B = $B`;
    const dual = `$B ${n.OR} $B = $B`;

    describe(`Theorem: ${remove$(theorem)}`, () => {
      it.each(inputs.single)(theorem, ({ B }) => eq(AND(B, B), B));
    });
    describe(`Dual: ${remove$(dual)}`, () => {
      it.each(inputs.single)(dual, ({ B }) => eq(OR(B, B), B));
    });
  });

  describe("Involution", () => {
    const theorem = `$B = ${n.NOT}${n.NOT}$B`;

    describe(`Theorem: ${remove$(theorem)}`, () => {
      it.each(inputs.single)(theorem, ({ B }) => eq(BUF(B), BUF(!!B)));
    });
  });

  describe("Complements", () => {
    const theorem = `$B ${n.AND} ${n.NOT}$B = 0`;
    const dual = `$B ${n.OR} ${n.NOT}$B = 1`;

    describe(`Theorem: ${remove$(theorem)}`, () => {
      it.each(inputs.single)(theorem, ({ B }) => eq(AND(B, !B), 0));
    });
    describe(`Dual: ${remove$(dual)}`, () => {
      it.each(inputs.single)(dual, ({ B }) => eq(OR(B, !B), 1));
    });
  });
});

describe("Boolean theorems of several variables", () => {
  describe("Commutativity", () => {
    const theorem = `$B ${n.AND} $C = $B ${n.AND} $C`;
    const dual = `$B ${n.OR} $C = $B ${n.OR} $C`;

    describe(`Theorem: ${remove$(theorem)}`, () => {
      it.each(inputs.two)(theorem, ({ B, C }) => eq(AND(B, C), AND(C, B)));
    });
    describe(`Dual: ${remove$(dual)}`, () => {
      it.each(inputs.two)(dual, ({ B, C }) => eq(OR(B, C), OR(C, B)));
    });
  });

  describe("Associativity", () => {
    const theorem = `($B ${n.AND} $C) ${n.AND} $D = $B ${n.AND} ($C ${n.AND} $D)`;
    const dual = `($B ${n.OR} $C) ${n.OR} $D = $B ${n.OR} ($C ${n.OR} $D)`;

    describe(`Theorem: ${remove$(theorem)}`, () => {
      it.each(inputs.three)(theorem, ({ B, C, D }) =>
        eq(AND(AND(B, C), D), AND(B, AND(C, D)))
      );
    });
    describe(`Dual: ${remove$(dual)}`, () => {
      it.each(inputs.three)(dual, ({ B, C, D }) =>
        eq(OR(OR(B, C), D), OR(B, OR(C, D)))
      );
    });
  });

  describe("Distributivity", () => {
    const theorem = `($B ${n.AND} $C) ${n.OR} ($B ${n.AND} $D) = $B ${n.AND} ($C ${n.OR} $D)`;
    const dual = `($B ${n.OR} $C) ${n.AND} ($B ${n.OR} $D) = $B ${n.OR} ($C ${n.AND} $D)`;

    describe(`Theorem: ${remove$(theorem)}`, () => {
      it.each(inputs.three)(theorem, ({ B, C, D }) =>
        eq(OR(AND(B, C), AND(B, D)), AND(B, OR(C, D)))
      );
    });
    describe(`Dual: ${remove$(dual)}`, () => {
      it.each(inputs.three)(dual, ({ B, C, D }) =>
        eq(AND(OR(B, C), OR(B, D)), OR(B, AND(C, D)))
      );
    });
  });

  describe("Covering", () => {
    const theorem = `$B ${n.AND} ($B ${n.OR} $C) = $B`;
    const dual = `$B ${n.OR} ($B ${n.AND} $C) = $B`;

    describe(`Theorem: ${remove$(theorem)}`, () => {
      it.each(inputs.two)(theorem, ({ B, C }) => eq(AND(B, OR(B, C)), B));
    });
    describe(`Dual: ${remove$(dual)}`, () => {
      it.each(inputs.two)(dual, ({ B, C }) => eq(OR(B, AND(B, C)), B));
    });
  });

  describe("Combining", () => {
    const theorem = `($B ${n.AND} $C) ${n.OR} ($B ${n.AND} ${n.NOT}$C) = $B`;
    const dual = `($B ${n.OR} $C) ${n.AND} ($B ${n.OR} ${n.NOT}$C) = $B`;

    describe(`Theorem: ${remove$(theorem)}`, () => {
      it.each(inputs.two)(theorem, ({ B, C }) =>
        eq(OR(AND(B, C), AND(B, NOT(C))), B)
      );
    });
    describe(`Dual: ${remove$(dual)}`, () => {
      it.each(inputs.two)(dual, ({ B, C }) =>
        eq(AND(OR(B, C), OR(B, NOT(C))), B)
      );
    });
  });

  describe("Consensus", () => {
    const theorem = `($B ${n.AND} $C) ${n.OR} (${n.NOT}$B ${n.AND} $D) ${n.OR} ($C ${n.AND} $D) = $B ${n.AND} $C ${n.OR} ${n.NOT}$B ${n.AND} $D`;
    const dual = `($B ${n.OR} $C) ${n.AND} (${n.NOT}$B ${n.OR} $D) ${n.AND} ($C ${n.OR} $D) = $B ${n.OR} $C ${n.AND} ${n.NOT}$B ${n.OR} $D`;

    describe(`Theorem: ${remove$(theorem)}`, () => {
      it.each(inputs.three)(theorem, ({ B, C, D }) =>
        eq(AND(OR(B, C), OR(NOT(B), D), OR(C, D)), AND(OR(B, C), OR(NOT(B), D)))
      );
    });
    describe(`Dual: ${remove$(dual)}`, () => {
      it.each(inputs.three)(dual, ({ B, C, D }) =>
        eq(
          OR(AND(B, C), AND(NOT(B), D), AND(C, D)),
          OR(AND(B, C), AND(NOT(B), D))
        )
      );
    });
  });

  describe("De Morgan's Theorem", () => {
    const theorem = `${n.NOT}($B ${n.AND} $C ${n.AND} $D ...) = (${n.NOT}$B ${n.OR} ${n.NOT}$C ${n.OR} ${n.NOT}$D ...)`;
    const dual = `${n.NOT}($B ${n.OR} $C ${n.OR} $D ...) = (${n.NOT}$B ${n.AND} ${n.NOT}$C ${n.AND} ${n.NOT}$D)`;

    describe(`Theorem: ${remove$(theorem)}`, () => {
      it.each(inputs.three)(theorem, ({ B, C, D }) =>
        eq(NOT(AND(B, C, D)), OR(NOT(B), NOT(C), NOT(D)))
      );
    });
    describe(`Dual: ${remove$(dual)}`, () => {
      it.each(inputs.three)(dual, ({ B, C, D }) =>
        eq(NOT(OR(B, C, D)), AND(NOT(B), NOT(C), NOT(D)))
      );
    });
  });
});

function remove$(str) {
  return str.replace(/\$/g, "");
}
function eq(x, y) {
  return expect(x).toBe(y);
}
