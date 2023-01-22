/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';

// the DOM elements:
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  // console.log(locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
