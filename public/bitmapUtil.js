// Function to assign a Set of unique strings to positions in a bitmap
export function assignBitmapPositions(uniqueStrings) {
    const map = new Map();
    let position = 0;

    for (const str of uniqueStrings) {
        map.set(str, position);
        position++;
    }

    return map; // Returns the map with strings as keys and bitmap positions as values
}

// Function to generate a bitmap as raw bytes (Uint8Array) for a given subset of strings
export function generateBitmapRawBytes(strings, map) {
    const bitCount = map.size;
    const byteCount = Math.ceil(bitCount / 8); // Calculate the number of bytes needed
    const bitmap = new Uint8Array(byteCount); // Initialize bitmap as raw bytes

    for (const str of strings) {
        if (map.has(str)) {
            const position = map.get(str);
            const byteIndex = Math.floor(position / 8);
            const bitIndex = position % 8;

            // Set the corresponding bit using bitwise OR
            bitmap[byteIndex] |= (1 << bitIndex);
        }
    }

    return bitmap; // Returns the bitmap as a Uint8Array
}

// Example usage
const uniqueStrings = new Set(["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew"]);
const positionMap = assignBitmapPositions(uniqueStrings);

console.log("Position Map:", positionMap);

const subset = ["apple", "date", "grape"];
const bitmapBytes = generateBitmapRawBytes(subset, positionMap);

console.log("Raw Bitmap Bytes:", bitmapBytes);

// For debugging: print the bits
function printBitmapBits(bitmap) {
    return Array.from(bitmap)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join('');
}

console.log("Bitmap as raw bytes:", bitmapBytes);
console.log("Bitmap as Bits:", printBitmapBits(bitmapBytes));
