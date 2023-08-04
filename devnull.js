document.addEventListener('DOMContentLoaded', () => {
  getGroups();
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
  /*indexedDB.open('devnull').onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    store.get(group).onsuccess = (e) => {
      const tabs = e.target.result.tabs;
      console.log(tabs);
      tabs.forEach((tab) => {
        browser.tabs.create({ url: tab.url });
        browser.tabs.update({ active: true });
      });
    }
  }*/
  deleteGroup(group);
}

function deleteGroup(group) {
  open('devnull', (store) => {
    store.delete(group);
  });
  /*indexedDB.open('devnull').onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    store.delete(group);
  }*/
}

function removeTabFromGroup(tab, group) {
  open('devnull', (store) => {
    store.get(group).onsuccess = (e) => {
      const item = e.target.result;
      if (item.tabs.length == 1) {
        store.delete(group);
      } else {
        item.tabs = item.tabs.splice(tab, 1);
        store.put(item);
      }
      /*console.log(tab);
      tabs.splice(tab, 1);
      store.put(group);*/
    }
    //tabs.splice(tab, 1);
    /*console.log('remove tab');
    console.log(store.get(group));
    const index = store.index('timestamp');
    index.getKey(group).onsuccess = () => {
      console.log(index.result);
    }*/
    //console.log(index);
    /*store.getKey(group).onsuccess = () => {
      console.log(group.result);
    }*/
  });
  /*indexedDB.open('devnull').onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
  }*/
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
      item.querySelector('a').addEventListener('click', (e) => {
        const url = e.target.href;
        removeTabFromGroup(tab.index, group.timestamp);
        console.log(group.timestamp);
      });
      item.querySelector('.tab-remove-button').addEventListener('click', (e) => {
        //groups.removeChild(tab);
        removeTabFromGroup(tab, index, group.timestamp);
      });
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
          if (e.target.className == 'restore-button') {
            groups.removeChild(item);
            restoreGroup(group.timestamp);
          }
          if (e.target.className == 'delete-button') {
            groups.removeChild(item);
            deleteGroup(group.timestamp);
          }
        });
        cursor.continue();
      }
    };
  };
}
