/* global XMLHttpRequest */

const req = url =>
    new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);

        xhr.onload = () => res(JSON.parse(xhr.responseText));
        xhr.onerror = () => rej(xhr.statusText);
        xhr.send();
    });


const DataModel = window.DataModel.default;

let sdm;
let idm;
async function exec () {
    const resp = await Promise.all(['/data/sprint_clean.json', '/data/issues_clean.json'].map(url => req(url)));
    const sprint = resp[0];
    const issues = resp[1];

    sdm = new DataModel(sprint, [
        { name: 'id', type: 'dimension' },
        { name: 'name', type: 'dimension' },
        { name: 'startDate', type: 'dimension', subtype: 'temporal' },
        { name: 'endDate', type: 'dimension', subtype: 'temporal' },
        { name: 'completeDate', type: 'dimension', subtype: 'temporal' },
        { name: 'goal', type: 'dimension' },
        { name: 'state', type: 'dimension' }
    ]);
}

exec();