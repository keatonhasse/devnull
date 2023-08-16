document.addEventListener('DOMContentLoaded', () => {
  getGroups();
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  createGroup(request);
});

function open(name, callback) {
  indexedDB.open(name).onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    callback(store);
  }
}

function restoreGroup(group) {
  open('devnull', (store) => {
    store.get(group).onsuccess = (e) => {
      const tabs = e.target.result.tabs;
      tabs.forEach((tab) => {
        browser.tabs.create({ url: tab.url });
        browser.tabs.update({ active: true });
      });
    }
  });
  deleteGroup(group);
}

function deleteGroup(group) {
  open('devnull', (store) => {
    store.delete(group);
  });
}

function removeTabFromGroup(tab, group) {
  open('devnull', (store) => {
    store.get(group).onsuccess = (e) => {
      const item = e.target.result;
      item.tabs = item.tabs.splice(tab, 1);
      store.put(item);
    }
  });
}

function createGroup(group) {
  const groups = document.getElementById('groups');
  const fragment = document.createDocumentFragment();
  fragment.appendChild(function() {
    const header = document.getElementById('group-template').content.cloneNode(true);
    header.querySelector('.group').id = group.timestamp;
    header.querySelector('.group-title').textContent = group.title;
    header.querySelector('.group-date').textContent = `created ${new Date(group.timestamp).toLocaleString('en-US', { hour12: false })}`;
    const list = header.querySelector('.tab-list');
    group.tabs.map(tab => {
      const item = header.getElementById('tab-template').content.cloneNode(true);
      item.querySelector('a').href = tab.url;
      item.querySelector('a').textContent = tab.title;
      list.appendChild(item);
    });
    return header;
  }());
  groups.prepend(fragment);
}

function getGroups() {
  indexedDB.open('devnull').onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    store.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        const group = cursor.value;
        createGroup(group);
        const item = document.getElementById(group.timestamp);
        item.addEventListener('click', (e) => {
          if (e.target.className == 'restore-button' || e.target.className == 'delete-button') {
            groups.removeChild(item);
            (e.target.className == 'restore-button') ? restoreGroup(group.timestamp) : deleteGroup(group.timestamp);
          }
          if (e.target.className == 'tab' || e.target.className == 'tab-remove-button') {
            const list = e.target.closest('.tab-list');
            const nodes = Array.from(list.children);
            if (nodes.length == 2) {
              groups.removeChild(list.parentElement);
              deleteGroup(group.timestamp);
            } else {
              list.removeChild(e.target.parentElement);
              removeTabFromGroup(nodes.indexOf(e.target), group.timestamp);
            }
          }
        });
        cursor.continue();
      }
    };
  };
}
