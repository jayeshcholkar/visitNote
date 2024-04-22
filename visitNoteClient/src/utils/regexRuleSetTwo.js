export function regexRuleSetTwo(wrappedHTML) {
  /* 
  Rule 2: 
  if <code> [... content ]...otherContent</code>&nbsp; found || <code> [... content]...otherContent</code>
  removes the enclosed content out of [] and adds it in the end
  */
  const regexWIWOSpace = /<code>.*?<\/code>(?: |&nbsp;)?/g;
  const matches = Array.from(
    wrappedHTML.matchAll(regexWIWOSpace),
    (match) => match[0]
  );

  for (let i = 0; i < matches.length; i++) {
    let preClosingCodeMatch = matches[i].match(/\](.*?)<\/code/);
    if (preClosingCodeMatch) {
      const extractedString = preClosingCodeMatch[1];
      const preString = matches[i].replace(extractedString, "");
      const stringToReplace = preString + extractedString;
      wrappedHTML = wrappedHTML.replace(matches[i], stringToReplace);
    }
  }
  return wrappedHTML;
}
