const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/status', (req, res) => {
    res.status(200).send('Сервис (СПП) работает');
});

app.get('/workload', (req, res) => {
    const workloadDuration = parseInt(req.query.duration) || 5000;  // duration в миллисекундах, по умолчанию 5 секунд

    console.log(`Запуск рабочей нагрузки на ${workloadDuration} миллисекунд`);

    setTimeout(() => {
        res.status(200).send(`Рабочая нагрузка завершена за ${workloadDuration} миллисекунд`);
    }, workloadDuration);
});

app.listen(port, () => {
    console.log(`SSP сервис работает на порту ${port}`);
});
