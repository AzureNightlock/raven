export function parseComponentAssignment(stream){
  stream.expect("DATA_TYPE", "html");
  const varName = stream.expect("IDENTIFIER");
  stream.expect("SYMBOL", "=");
  const component = stream.expect("IDENTIFIER");
  stream.expect("SYMBOL", "(");
  stream.expect("SYMBOL", ")");
  return {
    type: "ComponentAssignment",
    varName: varName.value,
    component: component.value,
    token: component,
  };
}