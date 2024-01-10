import PocketBase from "pocketbase";

export const baseUrl = "http://127.0.0.1:8090";
const pb = new PocketBase(baseUrl);

export default pb;
