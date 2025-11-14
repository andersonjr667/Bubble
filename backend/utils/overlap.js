// Calcula o overlap de gostos entre dois arrays
function overlapCount(arr1, arr2) {
  return arr1.filter(g => arr2.includes(g)).length;
}

module.exports = { overlapCount };
