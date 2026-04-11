// Parses a nutrition value from a string, handling commas and non-numeric characters
export function percentageStringToInt(text: string): number {
    const valueText = text.replace(/[^0-9.,]/g, '').replace(',', '.');
    return parseFloat(valueText);
}