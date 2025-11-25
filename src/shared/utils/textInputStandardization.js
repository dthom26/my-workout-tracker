// helper function to standardize text input
// @pram {string} input - the text input to standardize
// @returns {string} standardized text
function standardizeTextInput(input) {
  // trim whitespace and convert to lowercase
  let standardized = input.trim().toLowerCase();

  // get rid of special characters
  standardized = standardized.replace(/[^\w\s]/gi, "");

  // get rid of hyphens and underscores
  standardized = standardized.replace(/[-_]/g, " ");

  // get rid of multiple spaces
  standardized = standardized.replace(/\s+/g, " ");
  console.log("Standardized input:", standardized);
  // return standardized string
  return standardized;
}

export default standardizeTextInput;

/// trim whitespace and convert to lowercase
// get rid of special characters
// get rid of hyphens and underscores
// get rid of multiple spaces
// return standardized string
