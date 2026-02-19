function levenshtein(a, b) {
  if (a.length < b.length) [a, b] = [b, a]; // Ensure 'b' is the shorter string
  if (b.length === 0) return a.length;

  let prevRow = Array.from({ length: b.length + 1 }, (_, i) => i);
  let currRow = [];

  for (let i = 1; i <= a.length; i++) {
    currRow = [i];
    for (let j = 1; j <= b.length; j++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        currRow[j - 1] + 1,        
        prevRow[j] + 1,           
        prevRow[j - 1] + substitutionCost 
      );
    }
    prevRow = currRow;
  }

  return currRow[b.length];
}

function similarityPercentage(str1, str2) {
  const distance = levenshtein(str1, str2);
  const maxLen = Math.max(str1.length, str2.length);
  return ((1 - distance / maxLen) * 100).toFixed(2);
}

const doesHaveSomethingCommon = (str1, str2) => {
    const words1 = str1.toLowerCase().trim().split(/\s+/);
    const words2 = str2.toLowerCase().trim().split(/\s+/);
    return words1.some(word => words2.includes(word));
};

function fuzzySearch(query, dataset, similarityThreshold, searchOption) {
    const normalizedQuery = query.toLowerCase().trim();
    const strippedQuery = normalizedQuery.replace(/\s+/g, '');

    return dataset
        .map(foodItem => {
            let score = 0;

            if (searchOption === 'by_name') {
                const normalizedName = foodItem.name.toLowerCase().trim();
                const strippedName = normalizedName.replace(/\s+/g, '');
                
                const levSim = parseFloat(similarityPercentage(strippedQuery, strippedName));
                
                const hasCommon = doesHaveSomethingCommon(normalizedQuery, normalizedName);
                const commonBoost = hasCommon ? 75 : 0;

                score = Math.max(levSim, commonBoost);
                
               
                if (normalizedName.startsWith(normalizedQuery)) score += 15;
                else if (normalizedName.includes(normalizedQuery)) score += 10; 
            } else {
                score = parseFloat(similarityPercentage(normalizedQuery, foodItem.itemUID.toLowerCase().trim()));
            }

            return { foodItem, similarity: score };
        })
        .filter(result => result.similarity >= similarityThreshold)
        .sort((a, b) => b.similarity - a.similarity);
}

export default fuzzySearch;