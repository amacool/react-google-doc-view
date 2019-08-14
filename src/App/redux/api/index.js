import axios from 'axios';
import { urlPrefix } from "../constants";

const postApi = async ({url, data}) => {
  return await axios.post(urlPrefix + url, data)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
};

const getApi = async ({url, data}) => {
  return await axios.get(urlPrefix + url, data)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
};

export {postApi, getApi};