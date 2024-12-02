const express = require('express');
const axios = require('axios');

const app = express();
const port = 4000;

let clusterStatus = {};
let replicas = 1;

function simulateWorkload() {
    const workloadDuration = Math.floor(Math.random() * 5000) + 1000;
    console.log(`Эмуляция рабочей нагрузки на ${workloadDuration} миллисекунд`);

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Рабочая нагрузка завершена');
            resolve();
        }, workloadDuration);
    });
}

async function startServiceReplica() {
    try {
        await simulateWorkload();
        const response = await axios.post('http://localhost:5000/start', {
            service: 'ssp-service',
            count: replicas
        });
        console.log('Реплики сервиса запущены:', response.data);
    } catch (error) {
        console.error('Ошибка при запуске реплик сервиса:', error);
    }
}

async function scaleReplicas(newReplicaCount, res) {
    try {
        replicas = newReplicaCount;
        clusterStatus = {};
        await startServiceReplica();
        res.status(200).send(`Масштабирование выполнено: ${replicas} реплик`);
    } catch (error) {
        console.error('Ошибка при масштабировании реплик:', error);
        res.status(500).send('Не удалось масштабировать количество реплик');
    }
}

app.get('/status', (req, res) => {
    res.json(clusterStatus); // Отправляем актуальный статус
});

app.post('/scale-up', async (req, res) => {
    await scaleReplicas(replicas + 1, res);
});

app.post('/scale-down', async (req, res) => {
    if (replicas > 1) {
        await scaleReplicas(replicas - 1, res);
    } else {
        res.status(400).send('Невозможно уменьшить количество реплик (мин 1)');
    }
});

app.post('/clearWithoutOne', async (req, res) => {
    await scaleReplicas(1, res);
});

app.listen(port, async () => {
    console.log(`Сервис контроллера запущен на порту ${port}`);
    try {
        await startServiceReplica(); // Запуск начальной реплики
        console.log('Начальные реплики сервиса запущены');
    } catch (error) {
        console.error('Ошибка при запуске начальных реплик:', error);
    }
});

module.exports = app; // Экспорт приложения для тестов