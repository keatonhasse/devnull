export const styles = `
  <style>
    @media (prefers-color-scheme: dark) {
      button {
        color: #f0f0f0;
      }
    }
    button {
      background-color: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
    }
    ol {
      list-style: none;
    }
    .group:not(:nth-last-child(1)) {
      margin-bottom: 2rem;
    }
    .group-header {
      display: flex;
      column-gap: 1rem;
      margin-bottom: 1rem;
    }
    .tab {
      color: royalblue;
      text-decoration: none;
    }
    .tab-remove-button {
      visibility: hidden;
      margin-left: 0.5rem;
    }
    .tab-item:hover .tab-remove-button {
      visibility: visible;
    }
  </style>
`;

export const template = (groups) => `
  ${groups.map((group) => `
    <li class="group" id="${group.timestamp}">
      <div class="group-header">
        <h2 class="group-title" contenteditable="true" spellcheck="false" style="margin: 0;">${group.title}</h2>
        <!-- <h2 class="group-tab-count" style="margin: 0;">${group.tabs.length} tabs</h2> -->
        <div class="group-right" style="flex-shrink: 0;">
          <div class="group-date">created ${new Date(group.timestamp).toLocaleString('en-US', { hour12: false })}</div>
          <button class="restore-button" style="margin-right: 0.5rem;">restore</button><button class="delete-button">delete</button>
        </div>
      </div>
      <ol class="tab-list">
        ${group.tabs.map((tab) => `
          <li class="tab-item">
            <a class="tab" target="_blank" rel="norefferer" href="${tab.url}">${tab.title}</a><button class="tab-remove-button">remove</button>
          </li>
        `).join('')}
      </ol>
    </li>
  `).join('')}
`;
