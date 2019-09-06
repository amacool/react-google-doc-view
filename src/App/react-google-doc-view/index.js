import React, { useEffect, useState } from "react";

import Cookies from 'universal-cookie';
import DocView from "./DocView";
import { getSectionBlocks } from "./GetSectionBlocks";
import { clientId, apiKey } from "./config";
import { loadScript } from "./LoadScript";
import axios from "axios";

const cookies = new Cookies();

/**
 * @return {string}
 */
const ReactGoogleDocView = ({ documentId }) => {
  const [docContent, setDocContent] = useState(null);
  const accessToken = cookies.get('accessToken');

  const fetchGoogleDocContent = () => {
    console.log('fetching data...');
    axios.get(`https://cors-anywhere.herokuapp.com/https://docs.googleapis.com/v1/documents/${documentId}?key=${apiKey}`, {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`,
      },
    }).then((res) => {
      const docContent = getSectionBlocks(res.data);
      console.log(docContent);
      setDocContent(docContent);
    }).catch((err) => {
      console.log(err);
      cookies.remove('accessToken', {path: '/'});
      setDocContent(null);
    });
  };
  const authSign = () => {
    window.gapi.load('client:auth2', () => {
      console.log('auth signing ...');
      window.gapi.auth2.init({client_id: clientId}).then(() => {
        window.gapi.auth2.getAuthInstance()
          .signIn({scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly'})
          .then((data) => {
            // set cookie here
            let now = new Date();
            now.setHours(now.getHours() + data.Zi.expires_in);
            cookies.set('accessToken', data.Zi.access_token, {path: '/', expires: now});
            
            window.gapi.client.setApiKey(apiKey);
              window.gapi.client.load('https://content.googleapis.com/discovery/v1/apis/docs/v1/rest')
                .then(() => {
                  fetchGoogleDocContent();
                }, (err) => {
                  console.log(err);
                });
          }, function(err) {
            console.log(err);
          });
      }).catch((err) => {
        console.log(err);
      })
    });
  };
  
  useEffect(() => {
    console.log('loading...');
    if (!docContent) {
      if (!document.getElementById('google-doc-login')) {
        loadScript(document, 'script', 'google-doc-login', 'https://apis.google.com/js/api.js', () => {
          if (accessToken && accessToken !== 'undefined') {
            fetchGoogleDocContent();
          } else {
            authSign();
          }
        });
      } else {
        if (accessToken && accessToken !== 'undefined') {
          fetchGoogleDocContent();
        } else {
          authSign();
        }
      }
    }
  }, [docContent, accessToken]);

  return (
    <React.Fragment>
      {docContent ?
      <DocView
        docContent={docContent}
      /> : <div>loading...</div>}
    </React.Fragment>
  )
};

export default ReactGoogleDocView;