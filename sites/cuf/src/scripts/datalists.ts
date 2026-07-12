import { fetchJson } from '../data/data_control';

/** Returns array of panels to include from html inpu */
export function panelsToIncludeFrom(panels_data: string): string[] {
  try {
    const json_data = JSON.parse(panels_data);
    if (Array.isArray(json_data)) {
      return json_data.map((s) => `${s}`);
    }
  } catch (e) {} // if not an array
  const panels_data_split = panels_data.split('-');
  const remove_element = panels_data_split[1];
  let return_array: string[] = [];
  switch (panels_data_split[0]) {
    case 'page':
      return_array = ['prayer', 'involvement', 'chapters', 'jobs_available', 'position_papers'];
      break;
    default:
      console.error(`CufSidebar panels keyword ${panels_data_split[0]} not found.`);
      return return_array;
  }
  if (remove_element) {
    return_array = return_array.filter((el) => el !== remove_element);
  }
  return return_array;
}

interface MappingData {
  value: string;
  text: string;
}

/** Parses input mapping or returns specific mapping if a keyword */
export async function specificMapping(options_text: string): Promise<MappingData[]> {
  try {
    const json_data = JSON.parse(options_text);
    if (Array.isArray(json_data)) {
      return json_data.map((v) => {
        if (typeof v !== 'object') {
          return {
            value: `${v}`,
            text: `${v}`,
          };
        }
        return v as MappingData;
      });
    }
  } catch (e) {}
  switch (options_text) {
    case 'countries':
      return await countriesList();
    case 'prefixes':
      return ['', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Rev.'].map((v) => {
        return { value: v, text: v };
      });
    default:
      console.error(`CufSelect options keyword ${options_text} not found.`);
      return [];
  }
}

interface CountryData {
  alpha3: string;
  name: string;
}

/** Returns mapping of countries and 3-letter codes for use in options */
export async function countriesList(): Promise<MappingData[]> {
  const country_data = await fetchJson<CountryData[]>('countries.json');
  const country_array: MappingData[] = [];
  for (const country of country_data) {
    country_array.push({
      value: country.alpha3,
      text: country.name,
    });
  }
  return country_array;
}

/** Returns string value of default option */
export function defaultMapping(options_text: string): string | undefined {
  try {
    const json_data = JSON.parse(options_text);
    if (Array.isArray(json_data)) {
      return null;
    }
  } catch (e) {}
  switch (options_text) {
    case 'countries':
      return 'United States';
    case 'prefixes':
      return '';
    default:
      console.error(`CufSelect options keyword ${options_text} not found.`);
      return undefined;
  }
}
