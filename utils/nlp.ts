export function calculateTfIdfCosineSimilarity(text1: string, text2: string, corpus: string[]): number {
  if (!text1 || !text2) return 0;

  const tokenize = (text: string) => {
    return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0);
  };

  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);
  const corpusTokens = corpus.map(tokenize);

  const df: Record<string, number> = {};
  corpusTokens.forEach(doc => {
    const uniqueWords = new Set(doc);
    uniqueWords.forEach(w => {
      df[w] = (df[w] || 0) + 1;
    });
  });

  const N = corpus.length || 1;

  const getTfIdfVector = (tokens: string[]) => {
    const tf: Record<string, number> = {};
    tokens.forEach(w => {
      tf[w] = (tf[w] || 0) + 1;
    });

    const vector: Record<string, number> = {};
    for (const w in tf) {
      const idf = Math.log(N / ((df[w] || 0) + 1)) + 1; // smoothed IDF
      vector[w] = tf[w] * idf;
    }
    return vector;
  };

  const vec1 = getTfIdfVector(tokens1);
  const vec2 = getTfIdfVector(tokens2);

  const uniqueWords = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  uniqueWords.forEach(w => {
    const val1 = vec1[w] || 0;
    const val2 = vec2[w] || 0;
    dotProduct += val1 * val2;
    mag1 += val1 * val1;
    mag2 += val2 * val2;
  });

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}
