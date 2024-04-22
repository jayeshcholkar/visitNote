export function regexRuleSetOne(htmlString) {
  /* 
    Rule 1:
    if <code> .... content </code> found;
    add &nbsp; after the closing tags:
    <code> .... content </code>&nbsp;  
*/
  const regex = /(?<!<code>)(\[[^\]|^[]+\])(?!<\/code>)/g;
  return htmlString.replace(regex, "<code>$1</code>&nbsp;");
}
