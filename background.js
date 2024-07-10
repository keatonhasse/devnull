browser.runtime.onInstalled.addListener(() => {
  const request = indexedDB.open('devnull');
  request.onerror = (e) => {
    console.error(`Database error: ${e.target.errorCode}`);
  }
  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore('groups', { keyPath: 'timestamp' });
  }
});

function getTabs() {
  const tabs = browser.tabs.query({ currentWindow: true, pinned: false }).then((tabs) => {
    return tabs.map((tab) => {
      return {
        id: tab.id,
        title: tab.title,
        url: tab.url
      }
    }).filter((tab) => tab.url !== browser.runtime.getURL('/devnull.html'));
  });
  return tabs;
}

function saveTabs(tabs) {
  indexedDB.open('devnull').onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    const group = {
      timestamp: Date.now(),
      title: 'untitled unmastered',
      tabs: tabs.map((tab) => {
        delete tab.id;
        return tab;
      }).filter((tab) => tab.url !== 'about:newtab')
    };
    if (group.tabs.length > 0) {
      store.add(group);
      browser.runtime.sendMessage(group);
    }
  }
}

function closeTabs(tabs) {
  browser.tabs.query({ url: 'moz-extension://*/devnull.html' }, (tab) => {
    if (!tab.length) {
      browser.tabs.create({ url: 'devnull.html', pinned: true, index: 0, active: true });
    } else {
      browser.tabs.update(tab[0].id, { active: true });
    }
    browser.tabs.remove(tabs.map((tab) => tab.id));
  });
}

browser.browserAction.onClicked.addListener(() => {
  getTabs().then((tabs) => {
      saveTabs(tabs);
      closeTabs(tabs);
    })
});
