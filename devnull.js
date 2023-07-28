document.addEventListener('DOMContentLoaded', () => {
  getGroups();
});

function restoreGroup() {

}

function deleteGroup(group) {
  const parent = e.currentTarget.parentNode;
  //document.getElementsByClassName('restore-button')['0'].parentNode.parentNode.querySelector('ol').className
  console.log(parent);
  indexedDB.open('devnull').onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    store.delete(group);
  }
}

function getGroups() {
  indexedDB.open('devnull').onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    store.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        const group = cursor.value;
        document.getElementById('groups').innerHTML += `<li class="group-container"><div class="group-header"><h2 class="group-title">${group.title}</h2><div class="group-right"><p class="group-date"></p><div class="group-actions"><button class="restore-button">restore</button><button class="delete-button">delete</button></div></div></div><ol id="${group.timestamp}"></ol></li>`;
        document.getElementsByClassName(`${group.timestamp}`)['0'].parentElement.getElementsByClassName('group-date')['0'].innerHTML = `created ${new Date(group.timestamp).toLocaleString('en-US', { hour12: false })}`;
        //document.querySelector('.group-date').innerHTML = `created ${new Date(group.timestamp).toLocaleString()}`;
        document.getElementsByClassName(`${group.timestamp}`)['0'].innerHTML = group.tabs.map(tab => `<li class="tab-title"><a href="${tab.url}" target="_blank" rel="noopener noreferrer" class="tab-url">${tab.title}</a></li>`).join(' ');
        cursor.continue();
      }
    };
  };
}
