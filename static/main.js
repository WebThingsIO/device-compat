window.onload = function() {
  const deviceListUrl = 'https://raw.githubusercontent.com/WebThingsIO/device-compat/master/devices.json';
  const addonListUrl = 'https://raw.githubusercontent.com/WebThingsIO/addon-list/master/list.json';

  const tbody = document.querySelector('tbody');

  let devices;
  let addons;

  /**
   * Create an individual table row.
   *
   * @param {Object} device - Device to build row for.
   * @returns {Object} New `tr` node.
   */
  function createRow(device) {
    const tr = document.createElement('tr');

    const manufacturer = document.createElement('td');
    manufacturer.innerText = device.manufacturer;
    tr.appendChild(manufacturer);

    const model = document.createElement('td');
    model.innerText = device.model;
    tr.appendChild(model);

    const description = document.createElement('td');
    description.innerText = device.description;
    tr.appendChild(description);

    const type = document.createElement('td');
    type.innerText = device.type;
    type.classList.add('device-type');
    tr.appendChild(type);

    const status = document.createElement('td');
    status.innerText = device.status;
    status.classList.add('device-status', device.status);
    tr.appendChild(status);

    const adapters = document.createElement('td');
    const ul = document.createElement('ul');
    ul.classList.add('adapter-list');
    for (const adapter of device.adapters) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.innerText = adapter;

      for (const addon of addons) {
        if (addon.name === adapter) {
          a.href = addon.homepage;
          break;
        }
      }

      li.appendChild(a);
      ul.appendChild(li);
    }
    adapters.appendChild(ul);
    tr.appendChild(adapters);

    const note = document.createElement('td');
    note.innerText = device.note;
    tr.appendChild(note);

    return tr;
  }

  /**
   * Build the device table.
   *
   * @param {string} sortKey - Device object key to sort table by
   * @param {boolean} ascending - Whether or not the sort order is ascending
   */
  function buildTable(sortKey = 'manufacturer', ascending = true) {
    tbody.innerHTML = '';

    devices.sort((a, b) => {
      if (ascending) {
        return a[sortKey].localeCompare(b[sortKey]);
      }

      return b[sortKey].localeCompare(a[sortKey]);
    });

    for (const device of devices) {
      tbody.appendChild(createRow(device));
    }
  }

  /**
   * Handle click on one of the sortable headers.
   *
   * @param {Object} ev - Event object
   */
  function handleHeaderClick(ev) {
    const th = ev.target;

    if (!th.dataset.sortOrder || th.dataset.sortOrder === 'descending') {
      th.dataset.sortOrder = 'ascending';
    } else {
      th.dataset.sortOrder = 'descending';
    }

    document.querySelectorAll('.sortable').forEach((th) => {
      th.dataset.sortActive = 'false';
    });

    th.dataset.sortActive = 'true';

    buildTable(th.dataset.sortKey, th.dataset.sortOrder === 'ascending');
  }

  // Fetch the device list and the add-on list, then build the table.
  fetch(
    deviceListUrl
  ).then((res) => {
    return res.json();
  }).then((body) => {
    devices = body;
    return fetch(addonListUrl);
  }).then((res) => {
    return res.json();
  }).then((body) => {
    addons = body;

    buildTable();

    document.querySelectorAll('.sortable').forEach((th) => {
      th.onclick = handleHeaderClick;
    });
  });
};
