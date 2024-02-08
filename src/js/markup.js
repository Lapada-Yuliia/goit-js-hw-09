export function createMarkupCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `<ul class="countryDesc"><li class="countryItemDesc"><b>Capital</b>: ${capital}</li><li class="countryItemDesc"><b>Population</b>: ${population}</li><li class="countryItemDesc"><b>Languages</b>: ${Object.values(
        languages
      ).join(', ')}</li></ul>`;
    })
    .join('');
  return markup;
}

export function createMarkupCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class="countryItem"><h2 class="name">${name.official}</h2><img class="flag" src="${flags.svg}" alt="flag" /></li>`;
    })
    .join('');
  return markup;
}
