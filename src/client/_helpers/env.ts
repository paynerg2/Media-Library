//import { resolve } from 'path';
// import { config } from 'dotenv';

// config({ path: resolve(__dirname, '../../.env') });

// Importing env variables from this module ensures that config
// runs before they are expected.
//TODO: Figure out why Create-React-App makes it so ridiculous to do fullstack work
//! Issue: CRA has dotenv baked in, but uses it in a very specific way, involving putting .env
//! in a specific directory and naming variables with the form REACT_APP*, and this apparently
//! clashes with the normal use of dotenv applied on the backend for this project.
//? Use config.json instead.
//? YAGNI: This is a personal project anyways, and will need to deal with production-type stuff at some point, but for dev it's not
//? honestly that important.
export const env = {
    productionApiUrl: 'https://cave-media-library.herokuapp.com',
    apiUrl: 'http://localhost:4000'
};
