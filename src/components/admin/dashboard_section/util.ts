import { JsonData, JsonDataContent, JsonDataSubheader } from '../../../data/data_control';
import { ChapterData } from '../../common/chapters_list/chapters_list';
import {
  LaywitnessData,
  LaywitnessIssueData,
  LaywitnessVolumeData,
} from '../../common/laywitness_list/laywitness_list';
import { LinkGroupData, LinksData } from '../../common/links_list/links_list';
import { LayWitnessFormData } from '../forms/lay_witness_form/lay_witness_form';
import { LinksFormData } from '../forms/links_form/links_form';
import { CufDashboardSection } from './dashboard_section';
import { CufEditItem } from './edit_item/edit_item';

import './edit_item/edit_item';

/** Adds new data to existing json data */
export function addNewJsonData(
  el: CufDashboardSection,
  data: JsonData<JsonDataContent>,
  added: JsonDataContent
): {
  new_data: JsonData<JsonDataContent> | undefined;
  data_added?: JsonDataContent;
} {
  if (el.getJsonKey() === 'position_papers') {
    added.titlelink = `/data/position_papers/${el.getFileInput().name}`;
  }
  data.content.unshift(added);
  return { new_data: data, data_added: added };
}

/** Edits existing entry in json data */
export function editJsonData(
  el: CufDashboardSection,
  data: JsonData<JsonDataContent>,
  edited: JsonDataContent,
  data_key: string,
  filename: string
): {
  new_data: JsonData<JsonDataContent> | undefined;
  data_edited?: JsonDataContent;
} {
  if (data_key === 'subheader') {
    if (!edited.title) {
      el.errorStatus('Must have a title for a subheader');
      return { new_data: undefined };
    }
    edited.titlelink = data.subheader.titlelink;
    data.subheader = edited as JsonDataSubheader;
  } else if (data_key === 'content-empty') {
    edited.titlelink = data.content_empty.titlelink;
    data.content_empty = edited;
  } else {
    const i = parseInt(data_key);
    edited.titlelink = data.content[i].titlelink;
    data.content[i] = edited;
  }
  if (el.getJsonKey() === 'position_papers' && !!filename) {
    edited.titlelink = `/data/position_papers/${filename}`;
  }
  return { new_data: data, data_edited: edited };
}

/** Deletes existing entry in json data */
export function deleteJsonData(
  el: CufDashboardSection,
  data: JsonData<JsonDataContent>,
  deleted: JsonDataContent,
  data_key: string
): {
  new_data: JsonData<JsonDataContent> | undefined;
  data_deleted?: JsonDataContent;
} {
  if (data_key === 'subheader') {
    el.errorStatus('Deleting subheader not implemented since adding subheader is not implemented');
    return { new_data: undefined };
  } else if (data_key === 'content-empty') {
    el.errorStatus(
      'Deleting empty content message not implemented since adding empty content message not implemented'
    );
    return { new_data: undefined };
  } else {
    const i = parseInt(data_key);
    data.content.splice(i, 1);
  }
  return { new_data: data, data_deleted: deleted };
}

/** Adds new laywitness data to existing data */
export function addNewLayWitnessData(
  el: CufDashboardSection,
  data: LaywitnessData,
  added: LayWitnessFormData
): { new_data: LaywitnessData | undefined; data_added?: LaywitnessIssueData } {
  for (const volume of data.volumes) {
    if (volume.number === added.volume) {
      let found_issue = false;
      for (const issue of volume.issues) {
        if (issue.number === added.issue && !issue.insert && !issue.addendum) {
          found_issue = true;
          break;
        }
      }
      const new_issue: LaywitnessIssueData = {
        number: added.issue,
        title: added.title,
      };
      if (found_issue) {
        if (added.addendum) {
          new_issue.addendum = 1;
          for (const addendum of volume.issues.filter(
            (a) => a.number === added.issue && !!a.addendum
          )) {
            new_issue.addendum = Math.max(1, addendum.addendum + 1);
          }
        } else if (added.insert) {
          new_issue.insert = 1;
          for (const insert of volume.issues.filter(
            (a) => a.number === added.issue && !!a.insert
          )) {
            new_issue.insert = Math.max(1, insert.insert + 1);
          }
        } else {
          el.errorStatus('This issue already exists');
          return { new_data: undefined };
        }
      } else {
        if (added.addendum) {
          new_issue.addendum = 1;
        } else if (added.insert) {
          new_issue.insert = 1;
        }
      }
      volume.issues.push(new_issue);
      volume.issues.sort((a, b) => {
        if (a.number !== b.number) {
          return b.number - a.number;
        } else {
          if (!a.insert && !a.addendum) {
            return -1;
          }
          if (!b.insert && !b.addendum) {
            return 1;
          }
        }
        if (a.addendum !== b.addendum) {
          return (a.addendum ?? 0) - (b.addendum ?? 0);
        }
        return a.insert - b.insert;
      });
      return { new_data: data, data_added: new_issue };
    }
  }
  const new_issue: LaywitnessIssueData = {
    number: added.issue,
    title: added.title,
  };
  if (added.addendum) {
    new_issue.addendum = 1;
  } else if (added.insert) {
    new_issue.insert = 1;
  }
  const new_volume: LaywitnessVolumeData = {
    number: added.volume,
    year: added.volume + 2022 - 40,
    issues: [new_issue],
  };
  data.volumes.push(new_volume);
  data.volumes.sort((a, b) => b.number - a.number);
  return { new_data: data, data_added: new_issue };
}

/** Edit existing entry in laywitness data */
export function editLayWitnessData(
  el: CufDashboardSection,
  data: LaywitnessData,
  edited: LayWitnessFormData,
  data_key: string
): { new_data: LaywitnessData | undefined; data_edited?: LaywitnessIssueData } {
  const { new_data } = deleteLayWitnessData(el, data, edited, data_key);
  const add_data = addNewLayWitnessData(el, new_data, edited);
  return { new_data: add_data.new_data, data_edited: add_data.data_added };
}

/** Delete existing entry in laywitness data */
export function deleteLayWitnessData(
  el: CufDashboardSection,
  data: LaywitnessData,
  deleted: LayWitnessFormData,
  data_key: string
): {
  new_data: LaywitnessData | undefined;
  data_deleted?: LaywitnessIssueData;
} {
  const i = parseInt(data_key.split('-')[0].trim());
  const j = parseInt(data_key.split('-')[1].trim());
  const issue_deleted = data.volumes[i].issues[j];
  data.volumes[i].issues.splice(j, 1);
  if (data.volumes[i].issues.length === 0) {
    data.volumes.splice(i, 1);
  }
  return { new_data: data, data_deleted: issue_deleted };
}

/** Return array of elements from json data */
export function getListJsonData(
  el: CufDashboardSection,
  data: JsonData<JsonDataContent>
): CufEditItem[] {
  const els: CufEditItem[] = [];
  if (data.subheader) {
    const item: CufEditItem = document.createElement('cuf-edit-item');
    item.addConfigJsonData(el, data.subheader, 'subheader');
    item.classList.add('subheader');
    els.push(item);
  }
  if (data.content_empty) {
    const item: CufEditItem = document.createElement('cuf-edit-item');
    item.addConfigJsonData(el, data.content_empty, 'content-empty');
    item.classList.add('content-empty');
    els.push(item);
  }
  for (const [i, c] of data.content.entries()) {
    const item: CufEditItem = document.createElement('cuf-edit-item');
    item.addConfigJsonData(el, c, i.toString());
    els.push(item);
  }
  return els;
}

/** Return array of elements from lay witness data */
export function getListLaywitnessData(
  el: CufDashboardSection,
  data: LaywitnessData
): CufEditItem[] {
  const els: CufEditItem[] = [];
  for (const [i, volume] of data.volumes.entries()) {
    for (const [j, issue] of volume.issues.entries()) {
      const item: CufEditItem = document.createElement('cuf-edit-item');
      item.addConfigLaywitnessData(el, issue, volume.number, `${i}-${j}`);
      els.push(item);
    }
  }
  return els;
}

/** Adds new data to existing chapters data */
export function addChaptersData(
  data: JsonData<ChapterData>,
  added: ChapterData
): { new_data: JsonData<ChapterData> | undefined; data_added?: ChapterData } {
  data.content.unshift(added);
  return { new_data: data, data_added: added };
}

/** Return array of elements from chapters data */
export function getListChaptersData(
  el: CufDashboardSection,
  data: JsonData<ChapterData>
): CufEditItem[] {
  const els: CufEditItem[] = [];
  if (data.subheader) {
    const item: CufEditItem = document.createElement('cuf-edit-item');
    item.addConfigJsonData(el, data.subheader, 'subheader');
    item.classList.add('subheader');
    els.push(item);
  }
  if (data.content_empty) {
    const item: CufEditItem = document.createElement('cuf-edit-item');
    item.addConfigJsonData(el, data.content_empty, 'content-empty');
    item.classList.add('content-empty');
    els.push(item);
  }
  for (const [i, c] of data.content.entries()) {
    const item: CufEditItem = document.createElement('cuf-edit-item');
    item.addConfigChapterData(el, c, i.toString());
    els.push(item);
  }
  return els;
}

/** Deletes existing entry in chapters data */
export function deleteChaptersData(
  el: CufDashboardSection,
  data: JsonData<ChapterData>,
  deleted: ChapterData,
  data_key: string
): { new_data: JsonData<ChapterData> | undefined; data_deleted?: ChapterData } {
  if (data_key === 'subheader') {
    el.errorStatus('Deleting subheader not implemented since adding subheader is not implemented');
    return { new_data: undefined };
  } else if (data_key === 'content-empty') {
    el.errorStatus(
      'Deleting empty content message not implemented since adding empty content message not implemented'
    );
    return { new_data: undefined };
  } else {
    const i = parseInt(data_key);
    data.content.splice(i, 1);
  }
  return { new_data: data, data_deleted: deleted };
}

/** Edits existing entry in chapters data */
export function editChaptersData(
  el: CufDashboardSection,
  data: JsonData<ChapterData>,
  edited: ChapterData | JsonDataSubheader,
  data_key: string
): {
  new_data: JsonData<ChapterData> | undefined;
  data_edited?: ChapterData | JsonDataSubheader;
} {
  if (data_key === 'subheader' || data_key === 'content-empty') {
    data.subheader = edited as JsonDataSubheader;
  } else {
    const i = parseInt(data_key);
    data.content[i] = edited as ChapterData;
  }
  return { new_data: data, data_edited: edited };
}

/** Adds new data to existing links data */
export function addLinksData(
  data: LinksData,
  added: LinksFormData
): { new_data: LinksData | undefined; data_added?: LinksFormData } {
  const link: JsonDataContent = {
    title: added.title,
    titlelink: added.titlelink,
    description: added.description,
  };
  let new_group = true;
  for (const group of data.groups) {
    if (group.subheader === added.group) {
      new_group = false;
      group.links.push(link);
      break;
    }
  }
  if (new_group) {
    const group: LinkGroupData = {
      subheader: added.group,
      links: [link],
    };
    data.groups.push(group);
  }
  return { new_data: data, data_added: added };
}

/** Return array of elements from links data */
export function getListLinksData(el: CufDashboardSection, data: LinksData): CufEditItem[] {
  const els: CufEditItem[] = [];
  for (const [i, group] of data.groups.entries()) {
    for (const [j, link] of group.links.entries()) {
      const item: CufEditItem = document.createElement('cuf-edit-item');
      item.addConfigLinksData(el, group, link, `${i}-${j}`);
      els.push(item);
    }
  }
  return els;
}

/** Deletes existing entry in links data */
export function deleteLinksData(
  data: LinksData,
  data_key: string
): { new_data: LinksData | undefined; data_deleted?: JsonDataContent } {
  const i = parseInt(data_key.split('-')[0].trim());
  const j = parseInt(data_key.split('-')[1].trim());
  const link_deleted = data.groups[i].links[j];
  data.groups[i].links.splice(j, 1);
  if (data.groups[i].links.length < 1) {
    data.groups.splice(i, 1);
  }
  return { new_data: data, data_deleted: link_deleted };
}

/** Edits existing entry in links data */
export function editLinksData(
  data: LinksData,
  edited: LinksFormData,
  data_key: string
): { new_data: LinksData | undefined; data_edited?: JsonDataContent } {
  const i = parseInt(data_key.split('-')[0].trim());
  const j = parseInt(data_key.split('-')[1].trim());
  const link_edited: JsonDataContent = {
    title: edited.title,
    titlelink: edited.titlelink,
    description: edited.description,
  };
  if (edited.group !== data.groups[i].subheader) {
    const { new_data } = deleteLinksData(data, data_key);
    const r = addLinksData(new_data, edited);
    return { new_data: r.new_data, data_edited: link_edited };
  }
  data.groups[i].links[j] = link_edited;
  return { new_data: data, data_edited: link_edited };
}
