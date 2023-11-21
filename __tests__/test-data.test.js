const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("General errors", () => {
  test("404: responds with status code 404  with appropriate message when given a unavailable route", () => {
    request(app)
      .get("/api/bad-route")
      .expect(404)
      .then((response) => {
        const errorMessage = response.body.msg;
        expect(errorMessage).toBe("Route Not Found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with status code 200 with valid request", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("returns an array that is not empty", () => {
    return request(app)
      .get("/api/topics")
      .then((response) => {
        const rows = response.body.topics;
        expect(rows.length).toBe(3);
        expect(Array.isArray(rows)).toBe(true);
      });
  });
  test("each item in array is an object that contains keys of 'slug' and 'description' with correct data type values", () => {
    return request(app)
      .get("/api/topics")
      .then((response) => {
        const rows = response.body.topics;
        rows.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api", () => {
  test("200: responds with status code 200", () => {
    return request(app).get("/api").expect(200);
  });
  test("returns a JSON Object", () => {
    return request(app)
      .get("/api")
      .then((response) => {
        const apis = response.body.apis;
        expect(typeof JSON.parse(apis)).toBe('object')
      });
  })
  test("each value in parent object is a nested object containing the correct keys and value data types", () => {
    return request(app)
      .get("/api")
      .then((response) => {
        const apis = response.body.apis;
        const parsedApis = JSON.parse(apis);
        for (const api in parsedApis) {
          const specificApi = parsedApis[api];
          expect(typeof specificApi.description).toBe("string");
          expect(specificApi.queries).toBeInstanceOf(Array);
          expect(typeof specificApi.description).toBe("string");
          expect(!specificApi.exampleResponse).toBe(false);
        }
      });
  });
});


