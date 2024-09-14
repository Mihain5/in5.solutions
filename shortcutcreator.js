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
      alert('Invalid JSON input or error generating the shortcut. Please check your JSON code.');
      console.error(error);
    }
  });

  async function generateImportURL(shortcutData) {
    // Convert the shortcut data to plist XML using plist.js
    const plistXML = plist.build(shortcutData);

    // Convert plist to base64
    const base64Plist = btoa(unescape(encodeURIComponent(plistXML)));
    const urlEncodedData = encodeURIComponent(base64Plist);
    const importURL = `shortcuts://import-shortcut/?data=${urlEncodedData}`;
    return importURL;
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
