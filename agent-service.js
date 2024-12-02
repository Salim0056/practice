const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());

let replicas = [];

app.post('/start', (req, res) => {
    const { service, count } = req.body;
    replicas = [];

    if (count <= 0) {
        return res.status(400).send('Количество реплик должно быть больше 0');
    }

    for (let i = 0; i < count; i++) {
        replicas.push({ id: `${service}-replica-${replicas.length}` });
    }

    console.log(`${count} реплик сервиса ${service} запущено`);
    res.status(200).send(replicas);
});


app.post('/stop', (req, res) => {
    const { service, count } = req.body;
    if (count <= 0) {
        return res.status(400).send('Количество реплик для удаления должно быть больше 0');
    }

    let removedCount = 0;
    replicas = replicas.filter(replica => {
        if (removedCount < count && replica.id.startsWith(service)) {
            removedCount++;
            return false;
        }
        return true;
    });

    if (removedCount === 0) {
        return res.status(404).send('Реплики для удаления не найдены');
    }

    console.log(`${removedCount} реплик сервиса ${service} удалено`);
    res.status(200).send(replicas);
});

app.get('/status', (req, res) => {
    res.json(replicas);
});

app.listen(port, () => {
    console.log(`Сервис агента работает на порту ${port}`);
});





