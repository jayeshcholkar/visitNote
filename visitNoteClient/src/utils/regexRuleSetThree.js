export function regexRuleSetThree(wrappedHTML) {
  /* 
  Rule 3:
  if found <code> [ conten </code> or found <code> content ] </code>
  remove replace <code> and </code> with "" for this
*/
  const regexForAbsentButtons =
    /<code>(?!.*\[[^\]]*\].*|\].*\[.*)(.*?)<\/code>/g;
  const matchesFound = [];
  let match;
  while ((match = regexForAbsentButtons.exec(wrappedHTML)) !== null) {
    matchesFound.push(match);
  }

  for (let i = 0; i < matchesFound.length; i++) {
    wrappedHTML = wrappedHTML.replace(matchesFound[i][0], matchesFound[i][1]);
  }
  return wrappedHTML;
}
