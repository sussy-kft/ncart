jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: () => ({ getAll: jest.fn() }),
  useEffect: jest.fn(), 
  useState: jest.fn(),
}));

jest.mock("react-bootstrap", () => ({
  Form: {
    Control: jest.fn(),
    Check: jest.fn(),
  },
}));

jest.mock("../context/Alap/AxiosContext", () => ({}));

jest.mock("../komponensek/kozos/SelectMezo", () => jest.fn());

import { typeConverter, maxConverter, minConverter } from "../komponensek/kozos/InputMezo";

/**
 * A typeConverter függvény tesztjei, hogy helyesen konvertálja-e a típusokat.
 */
describe("typeConverter", () => {
  it('A "nvarchar" "text"-et ad-e vissza', () => {
    expect(typeConverter("nvarchar")).toBe("text");
  });

  it('A "float" "number"-t ad-e vissza', () => {
    expect(typeConverter("float")).toBe("number");
  });

  it('Az "int" "number"-t ad-e vissza', () => {
    expect(typeConverter("int")).toBe("number");
  });

  it('A "smallint" "number"-t ad-e vissza', () => {
    expect(typeConverter("smallint")).toBe("number");
  });

  it('A "tinyint" "number"-t ad-e vissza', () => {
    expect(typeConverter("tinyint")).toBe("number");
  });

  it('Az "email" "email"-t ad-e vissza', () => {
    expect(typeConverter("email")).toBe("email");
  });

  it('A "password" "password"-ot ad-e vissza', () => {
    expect(typeConverter("password")).toBe("password");
  });

  it('A "time" "time"-ot ad-e vissza', () => {
    expect(typeConverter("time")).toBe("time");
  });

  it('Az "unknown" "text"-et ad-e vissza', () => {
    expect(typeConverter("unknown")).toBe("text");
  });
});

/**
 * Az maxConverter függvény tesztjei, hogy helyesen konvertálja-e a maximum értékeket.
 */
describe("maxConverter", () => {
  it('Helyes max értéket kapott a "float"-ra', () => {
    expect(maxConverter("float")).toBe(3.4028235e38);
  });

  it('Helyes max értéket kapott a "bigint"-re', () => {
    expect(maxConverter("bigint")).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('Helyes max értéket kapott a "int"-re', () => {
    expect(maxConverter("int")).toBe(Math.pow(2, 31) - 1);
  });

  it('Helyes max értéket kapott a "smallint"-re', () => {
    expect(maxConverter("smallint")).toBe(Math.pow(2, 15) - 1);
  });

  it('Helyes max értéket kapott a "tinyint"-re', () => {
    expect(maxConverter("tinyint")).toBe(Math.pow(2, 8) - 1);
  });

  it('Null-t adott vissza az "unknown"-ra', () => {
    expect(maxConverter("unknown")).toBeNull();
  });
});

/**
 * Az minConverter függvény tesztjei, hogy helyesen konvertálja-e a minimum értékeket.
 */
describe("minConverter", () => {
  it('Helyes min értéket kapott a "float"-ra', () => {
    expect(minConverter("float")).toBe(-3.4028235e38);
  });

  it('Helyes min értéket kapott a "bigint"-re', () => {
    expect(minConverter("bigint")).toBe(Number.MIN_SAFE_INTEGER);
  });

  it('Helyes min értéket kapott a "int"-re', () => {
    expect(minConverter("int")).toBe(-Math.pow(2, 31));
  });

  it('Helyes min értéket kapott a "smallint"-re', () => {
    expect(minConverter("smallint")).toBe(-Math.pow(2, 15));
  });

  it('Helyes min értéket kapott a "tinyint"-re', () => {
    expect(minConverter("tinyint")).toBe(0);
  });

  it('Null-t adott vissza az "unknown"-ra', () => {
    expect(minConverter("unknown")).toBeNull();
  });
});
