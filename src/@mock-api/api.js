import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const api = new MockAdapter(axios);
export default api;
