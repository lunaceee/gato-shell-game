function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function camelize(parts) {
  let result = "";
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    result += i === 0 ? part : capitalize(part);
  }
  return result;
}
