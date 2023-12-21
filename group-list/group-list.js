import { styles, template } from './template.js';
import getGroups from './db.js'

class GroupList extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = styles;
    /*getGroups().then((groups) => {
      shadow.innerHTML = `${template(groups)}`;*/
    /*console.log(groups);
    groups.map((group) => {
      shadow.innerHTML = `${template(group)}`;
    });*/
    //});
    /*shadow.innerHTML = `${groups.map((group) => `
        <p>${group.title}</p>
      `)}
    `;*/
    //shadow.innerHTML = `${template(getGroups())}`;
    const list = document.createElement('ol');
    list.id = 'groups';
    getGroups().then((groups) => {
      list.innerHTML = `${template(groups)}`;
    });
    shadow.appendChild(list);
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
