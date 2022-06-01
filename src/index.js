import './css/styles.css';
import { fetchCountries } from './javascript/fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import createCountries from './template/featch-countr.hbs';
import countryList from './template/country-name.hbs';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const infoEl = document.querySelector('.js-country__info');
const listEl = document.querySelector('.js-country__list');

function handleCountryList(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (countries.length === 1) {
    let country = {};
    ({
      flags: { png: country.flag },
      name: { common: country.name },
      capital: [country.capital],
      languages: country.languages,
      population: country.population,
    } = countries[0]);
    country.languages = Object.values(country.languages).join(', ');
    infoEl.innerHTML = createCountries(country);
    listEl.innerHTML = '';
  } else {
    listEl.innerHTML = countryList(countries);
    infoEl.innerHTML = '';
  }
}

const onSearchInput = debounce(event => {
  event.preventDefault();
  const searchQuery = event.target.value.trim();

  if (searchQuery) {
    fetchCountries(searchQuery)
      .then(response => {
        handleCountryList(response);
      })
      .catch(err => {
        console.error(err);
      });
  } else {
    listEl.innerHTML = '';
    infoEl.innerHTML = '';
  }
}, DEBOUNCE_DELAY);

inputEl.addEventListener('input', onSearchInput);
