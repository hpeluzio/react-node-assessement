import api from "./api";
import "./data/users";

api.onAny().passThrough();
