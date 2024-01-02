import {JsonData, JsonDataContent} from '../../../data/data_control';
import {LaywitnessData, LaywitnessIssueData, LaywitnessVolumeData} from '../../common/laywitness_list/laywitness_list';
import {LayWitnessFormData} from '../forms/lay_witness_form/lay_witness_form';
import {CufDashboardSection} from './dashboard_section';
import {CufEditItem} from './edit_item/edit_item';

import './edit_item/edit_item';

/** Adds new data to existing json data */
export function addNewJsonData(el: CufDashboardSection, data: JsonData, added: JsonDataContent):
  {new_data: JsonData|undefined, data_added?: JsonDataContent}
{
  if (el.json_key === 'position_papers') {
    added.titlelink = `/data/position_papers/${el.file_input.files[0].name}`;
  }
  data.content.unshift(added);
  return {new_data: data, data_added: added};
}

/** Adds new laywitness data to existing data */
export function addNewLayWitnessData(el: CufDashboardSection, data: LaywitnessData, added: LayWitnessFormData):
  {new_data: LaywitnessData|undefined, data_added?: LaywitnessIssueData}
{
  for (const volume of data.volumes) {
    if (volume.number === added.volume) {
      let found_issue = false;
      for (const issue of volume.issues) {
        if (issue.number === added.issue) {
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
          for (const addendum of volume.issues.filter(a => a.number === added.issue && !!a.addendum)) {
            new_issue.addendum = Math.max(1, addendum.addendum + 1);
          }
        } else if (added.insert) {
          new_issue.insert = 1;
          for (const insert of volume.issues.filter(a => a.number === added.issue && !!a.insert)) {
            new_issue.insert = Math.max(1, insert.insert + 1);
          }
        } else {
          el.errorStatus('This issue already exists');
          return {new_data: undefined};
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
        } else if (a.addendum !== b.addendum) {
          return (a.addendum ?? 0) - (b.addendum ?? 0);
        }
        return a.insert - b.insert;
      });
      return {new_data: data, data_added: new_issue};
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
  return {new_data: data, data_added: new_issue};
}

/** Return array of elements from json data */
export function getListJsonData(data: JsonData): CufEditItem[] {
  const els: CufEditItem[] = [];
  if (!!data.subheader) {
    const item: CufEditItem = document.createElement('cuf-edit-item');
    item.addConfigJsonData(data.subheader);
    item.classList.add('subheader');
    els.push(item);
  }
  if (!!data.content_empty) {
    const item: CufEditItem = document.createElement('cuf-edit-item');
    item.addConfigJsonData(data.content_empty);
    item.classList.add('content-empty');
    els.push(item);
  }
  for (const c of data.content) {
    const item: CufEditItem = document.createElement('cuf-edit-item');
    item.addConfigJsonData(c);
    els.push(item);
  }
  return els;
}

/** Return array of elements from lay witness data */
export function getListLaywitnessData(data: LaywitnessData): HTMLDivElement[] {
  return [];
}
