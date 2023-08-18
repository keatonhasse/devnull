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

async function getTabs() {
  const tabs = await browser.tabs.query({ currentWindow: true, pinned: false });
  const tabList = tabs.map((tab) => {
    return {
      id: tab.id,
      title: tab.title,
      url: tab.url
    }
  }).filter(tab => {
    return (!/moz-extension:\/\/[a-z0-9-]*\/devnull.html/.test(tab.url));
  });
  return tabList;
}

async function saveTabs(tabs) {
  indexedDB.open('devnull').onsuccess = (e) => {
    db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    const group = {
      timestamp: Date.now(),
      title: 'untitled unmastered',
      tabs: tabs.map(tab => {
        delete tab.id;
        return tab;
      }).filter(tab => {
        return (tab.url !== 'about:newtab');
      })
    };
    if (group.tabs.length > 0) {
      store.add(group);
    }
  }
}

async function closeTabs(tabs) {
  browser.tabs.query({ url: 'moz-extension://*/devnull.html' }, async (tab) => {
    if (!tab.length) {
      browser.tabs.create({ url: 'devnull.html', pinned: true, index: 0, active: true });
    } else {
      browser.tabs.update(tab[0].id, { active: true });
      browser.runtime.sendMessage('update');
    }
    await browser.tabs.remove(tabs.map((tab) => {
      return tab.id;
    }));
  });
}

browser.browserAction.onClicked.addListener(async () => {
  await getTabs()
    .then(async (tabs) => {
      await saveTabs(tabs);
      await closeTabs(tabs);
    })
});
