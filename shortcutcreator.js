// shortcutcreator.js

document.addEventListener('DOMContentLoaded', () => {
  const createShortcutBtn = document.getElementById('create-shortcut-btn');
  const jsonInput = document.getElementById('json-input');
  const outputSection = document.getElementById('output-section');
  const shortcutLink = document.getElementById('shortcut-link');
  const shortcutDetails = document.getElementById('shortcut-details');

  createShortcutBtn.addEventListener('click', async () => {
    const jsonText = jsonInput.value;

    try {
      const shortcutData = JSON.parse(jsonText);

      // Generate the import URL
      const importURL = await generateImportURL(shortcutData);

      // Update the link
      shortcutLink.href = importURL;

      // Display shortcut details
      displayShortcutDetails(shortcutData);

      // Show the output section
      outputSection.style.display = 'block';
    } catch (error) {
      alert('Invalid JSON input. Please check your JSON code.');
      console.error(error);
    }
  });

  async function generateImportURL(shortcutData) {
    // Convert the shortcut data to plist XML
    const plist = jsonToPlist(shortcutData);

    // Convert plist to base64
    const base64Plist = btoa(unescape(encodeURIComponent(plist)));
    const urlEncodedData = encodeURIComponent(base64Plist);
    const importURL = `shortcuts://import-shortcut/?data=${urlEncodedData}`;
    return importURL;
  }

  function jsonToPlist(json) {
    // Simple conversion from JSON to plist XML format
    // For complex shortcuts, you may need a more robust solution
    let plist = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    plist += `<plist version="1.0">\n`;
    plist += jsonToPlistHelper(json);
    plist += `</plist>\n`;
    return plist;
  }

  function jsonToPlistHelper(obj) {
    let plist = '';
    if (Array.isArray(obj)) {
      plist += `<array>\n`;
      obj.forEach((item) => {
        plist += jsonToPlistHelper(item);
      });
      plist += `</array>\n`;
    } else if (typeof obj === 'object' && obj !== null) {
      plist += `<dict>\n`;
      for (let key in obj) {
        plist += `<key>${key}</key>\n`;
        plist += jsonToPlistHelper(obj[key]);
      }
      plist += `</dict>\n`;
    } else if (typeof obj === 'string') {
      plist += `<string>${obj}</string>\n`;
    } else if (typeof obj === 'number') {
      // Distinguish between integers and real numbers
      if (Number.isInteger(obj)) {
        plist += `<integer>${obj}</integer>\n`;
      } else {
        plist += `<real>${obj}</real>\n`;
      }
    } else if (typeof obj === 'boolean') {
      plist += obj ? `<true/>\n` : `<false/>\n`;
    } else {
      plist += `<string>${obj}</string>\n`;
    }
    return plist;
  }

  function displayShortcutDetails(shortcutData) {
    // Extract details and display them
    const shortcutName = shortcutData.WFWorkflowName || 'Untitled Shortcut';
    const actions = shortcutData.WFWorkflowActions || [];
    let detailsHTML = `<p><strong>Name:</strong> ${shortcutName}</p>`;
    detailsHTML += `<p><strong>Actions:</strong></p><ul>`;
    actions.forEach((action) => {
      const actionID = action.WFWorkflowActionIdentifier || 'Unknown Action';
      detailsHTML += `<li>${actionID}</li>`;
    });
    detailsHTML += `</ul>`;
    shortcutDetails.innerHTML = detailsHTML;
  }
});
