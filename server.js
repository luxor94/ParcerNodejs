const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
  });
  

// Маршрут для получения цены по артикулу
app.get('/price/:articleCode', async (req, res) => {
  try {
    const articleCode = req.params.articleCode;
    const url = `https://www.wildberries.ru/catalog/${articleCode}/detail.aspx`;

    // Отправляем GET запрос к странице Wildberries
    const response = await axios.get(url);
    const html = response.data;

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
