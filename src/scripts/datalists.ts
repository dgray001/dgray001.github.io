
/** Returns array of panels to include from html inpu */
export function panelsToIncludeFrom(panels_data: string): string[] {
  try {
    const json_data = JSON.parse(panels_data);
    if (Array.isArray(json_data)) {
      return json_data.map(s => `${s}`);
    }
  } catch (e) {} // if not an array
  const panels_data_split = panels_data.split('-');
  const remove_element = panels_data_split[1];
  let return_array: string[] = [];
  switch(panels_data_split[0]) {
    case 'page':
      return_array = ["prayer", "involvement", "chapters", "jobs_available", "position_papers"];
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
