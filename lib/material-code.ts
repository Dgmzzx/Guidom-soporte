export function materialCode(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  const n = (h % 9000) + 1000;
  return `M-${n}`;
}
