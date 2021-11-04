import build from './app';

describe("Basic App things", () => {
  test('Requests the "/" route', async () => {
    const app = await build();

    const response = await app.inject({
      method: "GET",
      url: "/",
    });
    expect(response.statusCode).toBe(200);
  });
});
