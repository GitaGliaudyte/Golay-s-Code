import * as fs from "fs";
import { sendThroughBSC } from "./golay_implementation/channel";
import { Decoder } from "./golay_implementation/decode";
import { Encoder } from "./golay_implementation/encode";

// Helper: compare two binary strings and count bit differences
function countBitErrors(a: string, b: string): number {
  const minLen = Math.min(a.length, b.length);
  let diff = 0;
  for (let i = 0; i < minLen; i++) {
    if (a[i] !== b[i]) diff++;
  }
  return diff;
}

const encoder = new Encoder();
const decoder = new Decoder();

const distortionProbabilities = Array.from({ length: 51 }, (_, i) => i * 0.005); // 0, 0.005, 0.010, ..., 0.25
const inputLength = 10008; // Must be multiple of 12 for Golay code
const attemptCount = 50;

console.log("Starting Golay code experiment...");
console.log("----------------------------------");

// Array to store results
const results: {
  p: number;
  avgCodedErrors: number;
  avgNonCodedErrors: number;
  avgCodedTime: number;
  avgNonCodedTime: number;
}[] = [];

for (const distProb of distortionProbabilities) {
  let timerCoded = 0;
  let errorCountCoded = 0;
  let timerNonCoded = 0;
  let errorCountNonCoded = 0;

  for (let attempt = 0; attempt < attemptCount; attempt++) {
    const input = Array.from({ length: inputLength }, () =>
      Math.random() < 0.5 ? "0" : "1"
    ).join("");

    // --- Coded workflow ---
    const codedStart = performance.now();
    const encoded = encoder.encode(input);
    const noisyEncoded = sendThroughBSC(encoded, distProb);
    let decoded: string;
    try {
      decoded = decoder.decode(noisyEncoded);
    } catch {
      // If Golay decoder says retransmission needed (too many errors)
      decoded = "0".repeat(input.length); // count as total failure
    }
    const codedEnd = performance.now();

    timerCoded += codedEnd - codedStart;
    errorCountCoded += countBitErrors(input, decoded);

    // --- Non-coded workflow ---
    const nonCodedStart = performance.now();
    const noisy = sendThroughBSC(input, distProb);
    const nonCodedEnd = performance.now();

    timerNonCoded += nonCodedEnd - nonCodedStart;
    errorCountNonCoded += countBitErrors(input, noisy);
  }

  const avgCodedErrors = errorCountCoded / attemptCount;
  const avgNonCodedErrors = errorCountNonCoded / attemptCount;
  const avgCodedTime = timerCoded / attemptCount;
  const avgNonCodedTime = timerNonCoded / attemptCount;

  console.log(`Distortion probability: ${distProb.toFixed(3)}`);
  console.log(`→ Avg coded errors: ${avgCodedErrors.toFixed(2)}`);
  console.log(`→ Avg uncoded errors: ${avgNonCodedErrors.toFixed(2)}`);
  console.log(`→ Avg coded time: ${avgCodedTime.toFixed(2)} ms`);
  console.log(`→ Avg uncoded time: ${avgNonCodedTime.toFixed(2)} ms`);
  console.log("----------------------------------");

  results.push({
    p: distProb,
    avgCodedErrors,
    avgNonCodedErrors,
    avgCodedTime,
    avgNonCodedTime,
  });
}

const csvHeader = "p,avgCodedErrors,avgNonCodedErrors,avgCodedTime,avgNonCodedTime\n";
const csvBody = results
  .map(
    (r) =>
      `${r.p},${r.avgCodedErrors},${r.avgNonCodedErrors},${r.avgCodedTime},${r.avgNonCodedTime}`
  )
  .join("\n");

fs.writeFileSync("golay_experiment_results.csv", csvHeader + csvBody, "utf-8");
