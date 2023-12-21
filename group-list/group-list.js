import template from './template.js';
import getGroups from './db.js'

class GroupList extends HTMLElement {
  constructor() {
    super();
    let groups = getGroups();
    console.log(groups);
    groups.forEach((group) => console.log(group));
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `${groups.map((group) => `
        <p>${group}</p>
      `)}
    `;
    //shadow.innerHTML = `${template(getGroups())}`;
    //const groups = document.createElement('ol');
    //groups.id = 'groups';
    //console.log(getGroups());
    //groups.innerHTML = `${template(getGroups())}`;
    //const g = getGroups();
    //groups.innerHTML = `${g.forEach(group => `<p>${group.title}</p>`)}`
    //groups.innerHTML = `${getGroups((groups) => template(groups))}`;
    //shadow.appendChild(groups);
  }
}

class GroupItem extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<div>test</div>`;
  }
}

customElements.define('group-list', GroupList);
customElements.define('group-item', GroupItem);
