browser.runtime.onInstalled.addListener(() => {
  const request = indexedDB.open('devnull');
  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore('groups', { keyPath: 'timestamp' });
    //objectStore = db.createObjectStore('groups', { keyPath: 'id', autoIncrement: true });
    //objectStore.createIndex('timestamp', 'timestamp');
    //objectStore.createIndex('title', 'tabs.title', { unique: false });
    //objectStore.createIndex('url', 'tabs.url', { unique: false });
  }
});

async function getTabs() {
  const tabs = await browser.tabs.query({ currentWindow: true, pinned: false })
  return tabs
    .map(({ id, title, url }) => ({ id, title, url }));
  //.filter((tab) => tab.url !== browser.runtime.getURL('/devnull.html'));
}

function saveTabs(tabs) {
  indexedDB.open('devnull').onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    const group = {
      timestamp: Date.now(),
      title: 'untitled unmastered',
      tabs: tabs.map(({ id, ...tab }) => tab)
        .filter((tab) => tab.url !== 'about:newtab')
    };
    if (group.tabs.length > 0) {
      store.add(group);
    }
  }
}

function closeTabs(tabs) {
  browser.tabs.query({ url: 'moz-extension://*/devnull.html' }, (tab) => {
    if (tab.length == 0) {
      browser.tabs.create({ url: 'devnull.html', pinned: true, index: 0, active: true });
    } else {
      browser.tabs.remove(tab[0].id);
      browser.tabs.create({ url: 'devnull.html', pinned: true, index: 0, active: true });
    }
    browser.tabs.remove(tabs.map((tab) => tab.id));
  });
}

browser.browserAction.onClicked.addListener(() => {
  getTabs().then((tabs) => {
    saveTabs(tabs);
    closeTabs(tabs);
  });
});
