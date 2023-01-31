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
    const res = await fetch('./__data/countries.json');
    const country_json = await res.text();
    const country_data = JSON.parse(country_json);
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