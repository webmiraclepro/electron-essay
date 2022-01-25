import { ElectronBlocker, Request } from '@cliqz/adblocker-electron';
import fs from 'fs';
import path from 'path'

let engine: ElectronBlocker;

const filterList: any = [];
const prebuiltAdsRules: any = [
    "../../prebuilt-ads-rules/easylist/easylist.txt",
    "../../prebuilt-ads-rules/easylist/easylistgermany.txt",
    "../../prebuilt-ads-rules/easylist/easylistgermany.txt",
    "../../prebuilt-ads-rules/peter-lowe/serverlist.txt",
    "../../prebuilt-ads-rules/ublock-origin/annoyances.txt",
    "../../prebuilt-ads-rules/ublock-origin/badware.txt",
    "../../prebuilt-ads-rules/ublock-origin/filters.txt",
    "../../prebuilt-ads-rules/ublock-origin/filters-2020.txt",
    "../../prebuilt-ads-rules/ublock-origin/resource-abuse.txt",
    "../../prebuilt-ads-rules/ublock-origin/unbreak.txt",
    "../../prebuilt-ads-rules/easylist/easyprivacy.txt",
    "../../prebuilt-ads-rules/ublock-origin/privacy.txt",
    //"../../prebuilt-ads-rules/custom-rule.txt",
    //"../../prebuilt-ads-rules/easylist/easylist-cookie.txt"
];
const getBlockerEngine = async() => {
  prebuiltAdsRules.map((rulePath: string) => {
    filterList.push(fs.readFileSync(path.join(__dirname, rulePath), 'utf-8'));
  });
  engine = await ElectronBlocker.parse(filterList.join('\n'));

  // update engine with resources.txt
  const resourcesPath = "../../prebuilt-ads-rules/ublock-origin/resources.txt";
  const resources = fs.readFileSync(path.join(__dirname, resourcesPath), 'utf-8');
  engine.updateResources(resources, '' + resources.length);
  engine.on('request-blocked', (request: Request) => {
    console.log('blocked', request.tabId, request.url);
  });

  engine.on('request-redirected', (request: Request) => {
    console.log('redirected', request.tabId, request.url);
  });

  engine.on('request-whitelisted', (request: Request) => {
    console.log('whitelisted', request.tabId, request.url);
  });

  engine.on('csp-injected', (request: Request) => {
    console.log('csp', request.url);
  });

  engine.on('script-injected', (script: string, url: string) => {
    console.log('script', script.length, url);
  });

  engine.on('style-injected', (style: string, url: string) => {
    console.log('style', style.length, url);
  });
  return engine
}

// const init = () => {
//   getInstance();
// }

export default getBlockerEngine;


