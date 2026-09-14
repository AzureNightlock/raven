export function parseStringAssignment(stream) {
  stream.expect("DATA_TYPE", "str");
  const varName = stream.expect("IDENTIFIER");
  stream.expect("SYMBOL", "=");
  const value = stream.expect("STRING");

  return {
    type: "CreateStringVariable",
    dataType: "str",
    varName: varName.value,
    value: value.value,
    token: varName,
  };
}
