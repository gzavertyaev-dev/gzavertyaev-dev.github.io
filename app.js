import * as ELEMENTS from "./elements.js";

// Наш сгенерированный уникальный APP_ID на openweathermap
const APP_ID = "eea75aae6dbe00233ac1efadf2d99a2a";

// Создадим функцию createWeatherCard, которая будет принимать в себя в кажестве аргумента
// данные о погоде в случае успешного ответа с сервера
const createWeatherCard = (weatherData) => {
  // делаем console.log(weatherData), чтобы видеть что нам пришло с сервера
  console.log(weatherData);
  // Показываем имя города
  ELEMENTS.WEATHER_CITY.textContent = weatherData.name;
  // // Показываем описание погоды
  // ELEMENTS.WEATHER_DESCRIPTION.textContent = weatherData.description;
  // // Показываем температуру
  // ELEMENTS.WEATHER_TEMPERATURE.textContent = weatherData.temperature;

  // Делаем индикатор загрузки невидимым, а WEATHER_INFO_CONTAINER блок видимым
  ELEMENTS.LOADING_TEXT.style.display = "none";
  ELEMENTS.WEATHER_INFO_CONTAINER.style.display = "flex";
};

const showErrorCard = (error) => {
  ELEMENTS.ERROR_MESSAGE.textContent = error.message;

  ELEMENTS.LOADING_TEXT.style.display = "none";
  ELEMENTS.ERROR_INFO_CONTAINER.style.display = "flex";
};

// Создадим асинхронную функцию searchWeatherForCity, которая будет делать наш запрос на openweathermap
// и показывать блок с погодой или с ошибкой, в зависимости от результата выполнения запроса
async function searchWeatherForCity() {
  // Получаем введенные данные с инпута в CITY_NAME, и убираем пробелы
  const CITY_NAME = ELEMENTS.SEARCH_CITY_INPUT.value.trim();
  // Создаем URL для запроса на openweathermap, прокинув CITY_NAME, APP_ID
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${APP_ID}`;

  // Проверяем ввел ли пользователь хоть 1 символ в инпут City Name,
  // если не ввел, то мы показываем alert и не выполняем функцию дальше,
  // если ввел, то продолжаем выполнение функции
  if (CITY_NAME.length === 0) {
    return alert("Please enter a city name");
  }

  // Показываем индикатор загрузки, и скрываем блок с погодой или с ошибкой
  ELEMENTS.LOADING_TEXT.style.display = "flex";
  ELEMENTS.WEATHER_INFO_CONTAINER.style.display = "none";
  ELEMENTS.ERROR_INFO_CONTAINER.style.display = "none";

  // Создаем блок try - catch, чтобы ловить успешный результат выполнения запроса
  // или же ошибку
  try {
    // Делаем запрос на openweathermap
    const response = await fetch(URL);
    // декодирует ответ в формате JSON и возвращает промис, однако с помощью
    // await мы сразу получаем result
    const result = await response.json();

    // Явно провеяем, что если response.ok === false из-за специфики работы с fetch,
    // то генерируем ошибку, и вызывается блок catch
    if (!response.ok) {
      // Если статус ответа не в пределах 200-299, считаем это ошибкой
      // и гененируем ее таким образом, чтобы отдать result блоку catch
      throw Object.assign(new Error("Request failed!"), {
        response: result,
      });
    }

    // Передаем функции createWeatherCard наш result, чтобы создать и показываем карточку с погодой
    createWeatherCard(result);
  } catch (error) {
    // Передаем error.response в showErrorCard, чтобы отобразить ошибку для пользователя
    showErrorCard(error.response);
  }
}

// Вызываем метод addEventListener для того, чтобы на click вызвать функцию searchWeatherForCity
ELEMENTS.SEARCH_BUTTON.addEventListener("click", searchWeatherForCity);
