// Turns money text from the page into a number, e.g. "$1,299.99" → 1299.99
export function parseCurrency(text: string): number {
  const cleaned = text.replace(/[$,\s]/g, "");
  const amount = Number(cleaned);

  //clear messaging
  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid currency value: "${text}"`);
  }
  return amount;
}
