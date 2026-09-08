export function parseVariableAssignment(stream) {
  stream.expect("DATA_TYPE", "int");
  const varName = stream.expect("IDENTIFIER");
  stream.expect("SYMBOL", "=");
  const value = stream.expect("NUMBER");

  return {
    type: "CreateIntegerVariable",
    dataType: "int",
    varName: varName.value,
    value: value.value,
    token: varName
  };
}
