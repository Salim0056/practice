const request = require('supertest');
const app = require('../controller-service');

describe('Контроллер', () => {
    let agent;

    beforeAll(() => {
        agent = request.agent(app);
    });

    afterAll(() => {
        app.close();
    });

    it('Должен вернуть статус сервиса', async () => {
        const response = await agent.get('/status');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
    });

    it('Должен масштабировать количество реплик вверх (scale-up)', async () => {
        const response = await agent.post('/scale-up');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Масштабирование выполнено: 2 реплик');
    }, 10000);

    it('Должен масштабировать количество реплик вниз (scale-down)', async () => {
        const response = await agent.post('/scale-down');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Масштабирование выполнено: 1 реплик');
    }, 10000);

    it('Должен сбросить количество реплик до 1 (clearWithoutOne)', async () => {
        await agent.post('/scale-up');
        const response = await agent.post('/clearWithoutOne');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Масштабирование выполнено: 1 реплик');
    }, 10000);
});
