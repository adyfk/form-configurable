import get from "./get";
import set from "./set";
import unset from "./unset";

test("set", () => {
  const expectData = {
    name: {
      firstname: "adi",
      lastname: "fatk",
      schools: [
        "sd",
        "smp",
      ],
    },
  };
  const data = {};

  set(data, "name.firstname", "adi");
  set(data, "name.lastname", "fatk");
  set(data, "name.schools[0]", "sd");
  set(data, "name.schools[1]", "smp");

  expect(data).toEqual(expectData);
  expect(expectData).toEqual({
    name: {
      firstname: get(data, "name.firstname"),
      lastname: get(data, "name.lastname"),
      schools: [
        get(data, "name.schools[0]"),
        get(data, "name.schools[1]"),
      ],
    },
  });

  unset(expectData, "name.schools");
  unset(expectData, "name.lastname");
  expect(expectData).toEqual({
    name: { firstname: "adi" },
  });
});
