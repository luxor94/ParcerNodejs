const express = require('express');
const http = require('http');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// Функция для отправки GET-запросов
const getHtml = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

// Маршрут для получения цены по артикулу
app.get('/price/:articleCode', async (req, res) => {
  try {
    const articleCode = req.params.articleCode;
    const url = `https://www.wildberries.ru/catalog/${articleCode}/detail.aspx`;

    // Отправляем GET запрос к странице Wildberries
    const html = await getHtml(url);

    // Парсим HTML с помощью Cheerio
    const $ = cheerio.load(html);
    const priceElement = $('span.j-final-price').first();
    const price = priceElement.text().trim();

    // Отправляем цену клиенту
    res.send(price);
  } catch (error) {
    console.error('Произошла ошибка:', error);
    res.status(500).send('Произошла ошибка');
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
