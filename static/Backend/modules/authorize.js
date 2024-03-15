const CLIENT_ID = ;
const API_KEY = ;

const DISCOVERY_DOC = ;
const SCOPES = ;

let tokenClient;
let gapiInited = false;
let gisInited = false;


/**
 * Callback after api.js is loaded.
 */
window.gapiLoaded = function() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
window.gisLoaded = function() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    console.log("Authorize")
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    // Almacena el token en el almacenamiento local
    sessionStorage.setItem('gapi_token', JSON.stringify(gapi.client.getToken()));
    sessionStorage.setItem('autorize', 'true');
    console.log(gapi.client.getToken())
    
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.popup').style.display = 'none';
    await listLabels();

    // Redirige a otra página después de que el token se haya guardado correctamente
    if (sessionStorage.getItem('autorize') === 'true') {
      window.location.href = '/static/Frontend/html/index.html';
    } 
  };

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    tokenClient.requestAccessToken({prompt: ''});
  }
}

// Resto del código...


/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  sessionStorage.removeItem('gapi_token');
  sessionStorage.removeItem('autorize');
  window.location.href = '/static/Frontend/html/login.html';

}

/**
 * Print all Labels in the authorized user's inbox. If no labels
 * are found an appropriate message is printed.
 */
async function listLabels() {
  let response;
  try {
    response = await gapi.client.gmail.users.labels.list({
      'userId': 'me',
    });
  } catch (err) {
    console.log(err.message)
    return;
  }
  const labels = response.result.labels;
  if (!labels || labels.length == 0) {
    console.log('No labels found.')
    return;
  }
  // Flatten to string to display
  const output = labels.reduce(
      (str, label) => `${str}${label.name}\n`,
      'Labels:\n');
  console.log(output)
}



