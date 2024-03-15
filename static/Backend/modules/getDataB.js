
function initializeGapiClient() {
    gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
      
    var token = JSON.parse(sessionStorage.getItem('gapi_token'));
    if (token) {
      gapi.client.setToken(token);
      console.log("Correcto")
      console.log(token)
    }
    
    gapiInited = true;
    maybeEnableButtons();
}

function getAttachmentsFromGmail() {
    return gapi.client.gmail.users.messages.list({
      'userId': 'me',
      'labelIds': ['INBOX']
    }).then(function(response) {
      var messages = response.result.messages;
      if (messages && messages.length > 0) {
        return Promise.all(messages.map(function(message) {
          var messageID = message.id;
          return gapi.client.gmail.users.messages.get({
            'userId': 'me',
            'id': messageID
          }).then(function(response) {
            var message = response.result;
            if (message.payload.mimeType === "multipart/mixed") {
              var parts = message.payload.parts;
              for (var j = 0; j < parts.length; j++) {
                var part = parts[j];
                if (part.filename && part.filename.length > 0 && 
                    (part.mimeType === "application/zip" || 
                     part.mimeType === "application/x-zip" || 
                     part.mimeType === "application/x-zip-compressed")) {
                  var attachId = part.body.attachmentId;
                  return gapi.client.gmail.users.messages.attachments.get({
                    'userId': 'me',
                    'messageId': messageID,
                    'id': attachId
                  });
                }
              }
            }
          });
        }));
      }
    });
}

function countAttachmentsFromGmail() {
    return gapi.client.gmail.users.messages.list({
      'userId': 'me',
      'labelIds': ['INBOX']
    }).then(function(response) {
      var messages = response.result.messages;
      if (messages && messages.length > 0) {
        return Promise.all(messages.map(function(message) {
          var messageID = message.id;
          return gapi.client.gmail.users.messages.get({
            'userId': 'me',
            'id': messageID
          }).then(function(response) {
            var message = response.result;
            if (message.payload.mimeType === "multipart/mixed") {
              var parts = message.payload.parts;
              for (var j = 0; j < parts.length; j++) {
                var part = parts[j];
                if (part.filename && part.filename.length > 0 && 
                    (part.mimeType === "application/zip" || 
                     part.mimeType === "application/x-zip" || 
                     part.mimeType === "application/x-zip-compressed")) {
                  var attachId = part.body.attachmentId;
                  return gapi.client.gmail.users.messages.attachments.get({
                    'userId': 'me',
                    'messageId': messageID,
                    'id': attachId
                  });
                }
              }
            }
          });
        }));
      }
    });
}
