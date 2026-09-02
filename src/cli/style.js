function paint(code) {
  return (text) => `\x1b[${code}m${text}\x1b[0m`;
}

export const purple = paint("38;5;141");
export const deepPurple = paint("38;5;99");
export const green = paint("38;2;74;222;128");
export const bold = paint("1");
export const dim = paint("2");

export const aka = paint("38;2;255;59;74"); // #ff3b4a
export const neonCyan = paint("38;2;45;226;230"); // #2de2e6
export const neonPink = paint("38;2;255;43;214"); // #ff2bd6
export const violet = paint("38;2;155;92;255"); // #9b5cff

export const yamabuki = paint("38;2;255;183;0"); // #ffb700
export const sakura = paint("38;2;255;122;162"); // #ff7aa2
export const ai = paint("38;2;40;72;110"); // indigo-ish
export const sumi = paint("38;2;110;110;118"); // muted ink gray

export const ink = paint("38;2;52;52;60");     // #34343c