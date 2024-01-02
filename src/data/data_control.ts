import {DEV} from "../scripts/util";

/** Format all json data should be in */
export declare interface JsonData {
  header: string;
  headerlink?: string;
  subheader?: JsonDataSubheader;
  content: JsonDataContent[];
  content_empty?: JsonDataContent;
}

/** Format all json data should be in */
export declare interface JsonDataSubheader {
  title: string;
  titlelink?: string;
}

/** Format all json data should be in */
export declare interface JsonDataContent {
  title?: string;
  titlelink?: string;
  description?: string;
}

/** This function gets the most recent version of the input json data */
export async function fetchJson<T>(path: string): Promise<T> {
  try {
    const data_control_res = await fetch(`/data/data_control.json?v=${Math.floor(Date.now() / 3000)}`);
    const data_control = await data_control_res.json();
    let timestamp = '';
    if (data_control[path]) {
      timestamp = data_control[path];
    }
    else if (!DEV) {
      data_control[path] = '';
      const post_response = await fetch('/server/data_control.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data_control),
      });
      const post_response_json = await post_response.json();
      if (!post_response_json || !post_response_json['success']) {
        throw new Error('Posting to data_control.php failed.');
      }
    }
    const json_response = await fetch(`/data/${path}?v=${timestamp}`);
    return json_response.json();
  } catch(e) {
    console.error(`Error fetching json data: ${e}`);
    return {} as T;
  }
}
