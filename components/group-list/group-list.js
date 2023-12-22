import { styles, template } from './template.js';
import { restoreGroup, deleteGroup, removeTabFromGroup, getGroups } from '../../db.js'

const State = {
  groups: [],
  append: (e) => {
    State.groups.push(e);
  }
};

class GroupList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.renderGroupList();
  }

  async renderGroupList() {
    this.shadowRoot.innerHTML = styles;
    const groupList = document.createElement('ol');
    groupList.id = 'groups';
    State.groups = await getGroups();
    groupList.innerHTML = template(State.groups);
    this.shadowRoot.appendChild(groupList);
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('click', (e) => {
      const groups = this.shadowRoot.getElementById('groups');
      const group = e.target.closest('.group');
      const key = Number(group?.id);
      switch (e.target.className) {
        case 'restore-button':
          restoreGroup(key);
        case 'delete-button':
          deleteGroup(key);
          groups.removeChild(group);
          break;
        case 'tab':
        case 'tab-remove-button':
          const list = e.target.closest('.tab-list');
          const nodes = Array.from(list.children);
          if (nodes.length == 1) {
            deleteGroup(key);
            groups.removeChild(list.parentElement);
          } else {
            const tab = e.target.parentElement;
            const index = nodes.indexOf(tab);
            removeTabFromGroup(index, key);
            list.removeChild(tab);
          }
          break;
      }
    });
  }
}

customElements.define('group-list', GroupList);
