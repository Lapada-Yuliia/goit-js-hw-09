/*
Створи фронтенд частину програми пошуку даних про країну за її частковою або повною назвою. 

HTTP-запит
Використовуй публічний API Rest Countries v2, а саме ресурс name, який повертає масив об'єктів країн, що задовольнили критерій пошуку. Додай мінімальне оформлення елементів інтерфейсу.

Напиши функцію fetchCountries(name), яка робить HTTP-запит на ресурс name і повертає проміс з масивом країн - результатом запиту. Винеси її в окремий файл fetchCountries.js і зроби іменований експорт.

Фільтрація полів
У відповіді від бекенду повертаються об'єкти, велика частина властивостей яких, тобі не знадобиться. Щоб скоротити обсяг переданих даних, додай рядок параметрів запиту - таким чином цей бекенд реалізує фільтрацію полів. Ознайомся з документацією синтаксису фільтрів.

Тобі потрібні тільки наступні властивості:

name.official - повна назва країни
capital - столиця
population - населення
flags.svg - посилання на зображення прапора
languages - масив мов

Поле пошуку
Назву країни для пошуку користувач вводить у текстове поле input#search-box. HTTP-запити виконуються при введенні назви країни, тобто на події input. Але робити запит з кожним натисканням клавіші не можна, оскільки одночасно буде багато запитів і вони будуть виконуватися в непередбачуваному порядку.

Необхідно застосувати прийом Debounce на обробнику події і робити HTTP-запит через 300мс після того, як користувач перестав вводити текст. Використовуй пакет lodash.debounce.

Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується, а розмітка списку країн або інформації про країну зникає.

Виконай санітизацію введеного рядка методом trim(), це вирішить проблему, коли в полі введення тільки пробіли, або вони є на початку і в кінці рядка.

Інтерфейс
Якщо у відповіді бекенд повернув більше ніж 10 країн, в інтерфейсі з'являється повідомлення про те, що назва повинна бути специфічнішою. Для повідомлень використовуй бібліотеку notiflix і виводь такий рядок "Too many matches found. Please enter a more specific name.".

Якщо бекенд повернув від 2-х до 10-и країн, під тестовим полем відображається список знайдених країн. Кожен елемент списку складається з прапора та назви країни.

Якщо результат запиту - це масив з однією країною, в інтерфейсі відображається розмітка картки з даними про країну: прапор, назва, столиця, населення і мови.

УВАГА
Достатньо, щоб застосунок працював для більшості країн. Деякі країни, як-от Sudan, можуть створювати проблеми, оскільки назва країни є частиною назви іншої країни - South Sudan. Не потрібно турбуватися про ці винятки.

Обробка помилки
Якщо користувач ввів назву країни, якої не існує, бекенд поверне не порожній масив, а помилку зі статус кодом 404 - не знайдено. Якщо це не обробити, то користувач ніколи не дізнається про те, що пошук не дав результатів. Додай повідомлення "Oops, there is no country with that name" у разі помилки, використовуючи бібліотеку notiflix.

УВАГА
Не забувай про те, що fetch не вважає 404 помилкою, тому необхідно явно відхилити проміс, щоб можна було зловити і обробити помилку.
*/

import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
import { createMarkupCountryInfo, createMarkupCountryList } from './js/markup';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchInputRef = document.getElementById('search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

searchInputRef.addEventListener(
  'input',
  debounce(onSearchInput, DEBOUNCE_DELAY)
);

async function onSearchInput() {
  if (searchInputRef.value === '') {
    countryInfoRef.innerHTML = '';
    countryListRef.innerHTML = '';
  }

  const name = searchInputRef.value.toLowerCase().trim();
  if (!name) {
    return;
  }

  if (name === '') {
    return (countryListRef.innerHTML = ''), (countryInfoRef.innerHTML = '');
  }

  await fetchCountries(name)
    .then(countries => {
      countryInfoRef.innerHTML = '';
      countryListRef.innerHTML = '';

      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (countries.length >= 2 && countries.length <= 10) {
        countryListRef.insertAdjacentHTML(
          'beforeend',
          createMarkupCountryList(countries)
        );
        return;
      }

      countryListRef.insertAdjacentHTML(
        'beforeend',
        createMarkupCountryList(countries)
      );
      countryInfoRef.insertAdjacentHTML(
        'beforeend',
        createMarkupCountryInfo(countries)
      );
    })
    .catch(error => {
      searchInputRef.value = '';
      noCountryFailure();
      console.log(error.name);
    });
}

function noCountryFailure() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
