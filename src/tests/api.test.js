import MockAdapter from "axios-mock-adapter";
import api from "../api/axios";

test("API base URL is set", () => {
  const mock = new MockAdapter(api);
  mock.onPost("/auth/login").reply(200, { success: true });

  expect(api.defaults.baseURL).toBe(import.meta.env.VITE_API_URL);
});
