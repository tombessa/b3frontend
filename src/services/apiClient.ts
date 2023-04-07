import {setupAPIClient, setupAPISocialMedia} from './api'
import {BASE_URL} from "../utils/constants";

export const api = setupAPIClient();

export const apiSocial = setupAPISocialMedia(BASE_URL);