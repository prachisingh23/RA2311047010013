// SAMPLE DATA (from question format)
const vehicles = [
  { TaskID: "1", Duration: 1, Impact: 5 },
  { TaskID: "2", Duration: 6, Impact: 2 },
  { TaskID: "3", Duration: 1, Impact: 3 },
  { TaskID: "4", Duration: 5, Impact: 5 },
  { TaskID: "5", Duration: 7, Impact: 3 },
  { TaskID: "6", Duration: 6, Impact: 3 },
  { TaskID: "7", Duration: 5, Impact: 1 },
  { TaskID: "8", Duration: 6, Impact: 10 },
  { TaskID: "9", Duration: 6, Impact: 6 },
  { TaskID: "10", Duration: 2, Impact: 5 }
];

// Example depot
const maxHours = 15;

// KNAPSACK FUNCTION
function knapsack(vehicles, maxHours) {
  const n = vehicles.length;
  const dp = Array(n + 1).fill().map(() => Array(maxHours + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = vehicles[i - 1];

    for (let w = 0; w <= maxHours; w++) {
      if (Duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - Duration] + Impact
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][maxHours];
}

// RUN
const result = knapsack(vehicles, maxHours);

console.log("Max Impact:", result);