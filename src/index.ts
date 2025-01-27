// Updated links for undestanding the statistic procedure used
// Critical Mann-Whitney U-values for 95% confidence
// https://sphweb.bumc.bu.edu/otlt/mph-modules/bs/bs704_nonparametric/bs704_nonparametric4.html
// http://www.statisticslectures.com/topics/mannwhitneyu/

// https://github.com/bestiejs/benchmark.js/blob/42f3b732bac3640eddb3ae5f50e445f3141016fd/benchmark.js#L1391
// This is a modernised extracted version from benchmark.js

const U_TABLE = {
  5: [0, 1, 2],
  6: [1, 2, 3, 5],
  7: [1, 3, 5, 6, 8],
  8: [2, 4, 6, 8, 10, 13],
  9: [2, 4, 7, 10, 12, 15, 17],
  10: [3, 5, 8, 11, 14, 17, 20, 23],
  11: [3, 6, 9, 13, 16, 19, 23, 26, 30],
  12: [4, 7, 11, 14, 18, 22, 26, 29, 33, 37],
  13: [4, 8, 12, 16, 20, 24, 28, 33, 37, 41, 45],
  14: [5, 9, 13, 17, 22, 26, 31, 36, 40, 45, 50, 55],
  15: [5, 10, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59, 64],
  16: [6, 11, 15, 21, 26, 31, 37, 42, 47, 53, 59, 64, 70, 75],
  17: [6, 11, 17, 22, 28, 34, 39, 45, 51, 57, 63, 67, 75, 81, 87],
  18: [7, 12, 18, 24, 30, 36, 42, 48, 55, 61, 67, 74, 80, 86, 93, 99],
  19: [7, 13, 19, 25, 32, 38, 45, 52, 58, 65, 72, 78, 85, 92, 99, 106, 113],
  20: [
    8, 14, 20, 27, 34, 41, 48, 55, 62, 69, 76, 83, 90, 98, 105, 112, 119, 127,
  ],
  21: [
    8, 15, 22, 29, 36, 43, 50, 58, 65, 73, 80, 88, 96, 103, 111, 119, 126, 134,
    142,
  ],
  22: [
    9, 16, 23, 30, 38, 45, 53, 61, 69, 77, 85, 93, 101, 109, 117, 125, 133, 141,
    150, 158,
  ],
  23: [
    9, 17, 24, 32, 40, 48, 56, 64, 73, 81, 89, 98, 106, 115, 123, 132, 140, 149,
    157, 166, 175,
  ],
  24: [
    10, 17, 25, 33, 42, 50, 59, 67, 76, 85, 94, 102, 111, 120, 129, 138, 147,
    156, 165, 174, 183, 192,
  ],
  25: [
    10, 18, 27, 35, 44, 53, 62, 71, 80, 89, 98, 107, 117, 126, 135, 145, 154,
    163, 173, 182, 192, 201, 211,
  ],
  26: [
    11, 19, 28, 37, 46, 55, 64, 74, 83, 93, 102, 112, 122, 132, 141, 151, 161,
    171, 181, 191, 200, 210, 220, 230,
  ],
  27: [
    11, 20, 29, 38, 48, 57, 67, 77, 87, 97, 107, 118, 125, 138, 147, 158, 168,
    178, 188, 199, 209, 219, 230, 240, 250,
  ],
  28: [
    12, 21, 30, 40, 50, 60, 70, 80, 90, 101, 111, 122, 132, 143, 154, 164, 175,
    186, 196, 207, 218, 228, 239, 250, 261, 272,
  ],
  29: [
    13, 22, 32, 42, 52, 62, 73, 83, 94, 105, 116, 127, 138, 149, 160, 171, 182,
    193, 204, 215, 226, 238, 249, 260, 271, 282, 294,
  ],
  30: [
    13, 23, 33, 43, 54, 65, 76, 87, 98, 109, 120, 131, 143, 154, 166, 177, 189,
    200, 212, 223, 235, 247, 258, 270, 282, 293, 305, 317,
  ],
}

function getZStat(u: number, sizeOne: number, sizeTwo: number) {
  return (
    (u - (sizeOne * sizeTwo) / 2) /
    Math.sqrt((sizeOne * sizeTwo * (sizeOne + sizeTwo + 1)) / 12)
  )
}

function getScore(xA: number, sampleB: number[]) {
  return sampleB.reduce((total, xB) => {
    let point = xB < xA ? 1 : 0.5
    if (xB > xA) {
      point = 0
    }
    return total + point
  }, 0)
}

function getUStat(one: number[], two: number[]) {
  return one.reduce((total, xA) => total + getScore(xA, two), 0)
}

/**
 * @returns -1 if slower, 1 if faster and 0 if we can't determine it
 */
export default function compare(
  sampleSetOne: number[],
  sampleSetTwo: number[]
) {
  const sizeOne = sampleSetOne.length
  const sizeTwo = sampleSetTwo.length
  const maxSize = Math.max(sizeOne, sizeTwo)
  const minSize = Math.min(sizeOne, sizeTwo)
  const uStatOne = getUStat(sampleSetOne, sampleSetTwo)
  const uStatTwo = getUStat(sampleSetTwo, sampleSetOne)
  const u = Math.min(uStatOne, uStatTwo)

  if (sizeOne + sizeTwo > 30) {
    if (Math.abs(getZStat(u, sizeOne, sizeTwo)) > 1.96) {
      return u === uStatOne ? 1 : -1
    }
    return 0
  }

  if (u <= getCritical(maxSize, minSize)) {
    return u === uStatOne ? 1 : -1
  }
  return 0
}

function getCritical(maxSize: number, minSize: number) {
  let critical: number = 0
  if (maxSize < 5 || minSize < 3) {
    critical = 0
  } else if (U_TABLE[maxSize]) {
    critical = U_TABLE[maxSize][minSize - 3] ?? 0
  }
  return critical
}
