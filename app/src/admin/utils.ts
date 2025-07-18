export function shortenId(id: string) {
  return `${id.slice(0, 3)}...${id.slice(-3)}`;
}
