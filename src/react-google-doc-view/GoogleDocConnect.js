import { getSectionBlocks } from "./GetSectionBlocks";

export const googleDocConnect = async ({ clientId, apiKey, documentId }) => {
  const authenticate = async () => {
    return await new Promise((resolve, reject) => {
      window.gapi.auth2.getAuthInstance()
        .signIn({scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly'})
        .then(() => {
          resolve(true);
        }, function(err) {
          reject(err);
        });
    });
  };
  const loadClient = async () => {
    console.log(apiKey);
    window.gapi.client.setApiKey(apiKey);
    return await new Promise((resolve, reject) => {
      window.gapi.client.load('https://content.googleapis.com/discovery/v1/apis/docs/v1/rest')
        .then(() => {
          console.log('GAPI client loaded for API');
          resolve(true);
        }, (err) => {
          reject(err);
        });
    });
  };
  const execute = async () => {
    return await new Promise((resolve, reject) => {
      window.gapi.client.docs.documents.get({
        'documentId': documentId,
        'suggestionsViewMode': 'DEFAULT_FOR_CURRENT_ACCESS'
      }).then((response) => {
        if (response.result.error) {
          reject(response.result.error);
        }
        resolve(response);
      }, (err) => {
        reject(err);
      });
    });
  };
  const authSign = async () => {
    return await new Promise((resolve, reject) => {
      window.gapi.load('client:auth2', () => {
        console.log('auth signing ...');
        window.gapi.auth2.init({client_id: clientId}).then(() => {
          console.log('init client!');
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
      });
    });
  };
  try {
    await authSign();
    await authenticate();
    await loadClient();
    return await execute();
  } catch (err) {
    console.error(err);
    return false;
  }
};