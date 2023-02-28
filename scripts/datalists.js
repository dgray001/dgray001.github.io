const {version} = await import(`/scripts/version.js?v=${Date.now()}`);
const {fetchJson} = await import(`/__data/data_control.js?v=${version}`);

/**
 * Returns array of panels to include based on attribute input
 * @param {JSON | string} panels_data - a valid JSON or keyword
 * @return {Array<string>} parsed options or keyword options
 */
export function panelsToIncludeFrom(panels_data) {
  try {
    const json_data = JSON.parse(panels_data);
    if (Array.isArray(json_data)) {
      return json_data;
    }
  } catch (e) {} // if not an array
  const panels_data_split = panels_data.split('-');
  const remove_element = panels_data_split[1];
  let return_array = [];
  switch(panels_data_split[0]) {
    case 'homepage':
      return_array = ["prayer", "news", "papers"];
      break;
    case 'page':
      return_array = ["prayer", "news", "jobs_available", "papers"];
      break;
    default:
      console.error(`CufSidebar panels keyword ${panels_data_split[0]} not found.`);
      return return_array;
  }
  if (remove_element) {
    return_array = return_array.filter(el => el !== remove_element);
  }
  return return_array;
}
  
/**
 * Updates this.options in case it is a keyword.
 * If it is not a keyword then return the inputted options
 * @param {JSON | string} options_text - a valid JSON or keyword
 * @return {Promise<Array<string> | Map<string, string>>} parsed options as either a map or array
 */
export async function specificMapping(options_text) {
  try {
    const json_data = JSON.parse(options_text);
    if (Array.isArray(json_data)) {
      return json_data;
    }
  } catch (e) {}
  switch(options_text) {
    case 'countries':
      return await countriesList();
    case 'prefixes':
      return ["", "Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Rev."];
    default:
      console.error(`CufSelect options keyword ${options_text} not found.`);
      return [];
  }
}

/**
 * Returns mapping of countries and 2-letter codes for use in options
 * @return {Promise<Map<string, string>>} country_map<code, display name>
 */
export async function countriesList() {
  const country_data = await fetchJson('countries.json');
  /**
  * @type {Map<string, string>}
  */
  const country_map = new Map();
  for (const country of country_data) {
    country_map.set(country['alpha3'], country['name']);
  }
  return country_map;
}

/**
 * Returns string value of default option or null for no default
 * @param {JSON | string} options_text - a valid JSON or keyword
 * @return {string | null} default option or null if none
 */
export function defaultMapping(options_text) {
  try {
    const json_data = JSON.parse(options_text);
    if (Array.isArray(json_data)) {
      return null;
    }
  } catch (e) {}
  switch(options_text) {
    case 'countries':
      return "United States";
    case 'prefixes':
      return "";
    default:
      console.error(`CufSelect options keyword ${options_text} not found.`);
      return null;
  }
}