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
    return request(app).get("/api/trea").expect(404);
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
        const rows = response._body.topics.rows;
        expect(rows.length).toBe(3);
        expect(Array.isArray(rows)).toBe(true);
      });
  });
  test("each item in array is an object", () => {
    return request(app)
      .get("/api/topics")
      .then((response) => {
        const rows = response._body.topics.rows;
        expect(
          rows.every((item) => {
            return (
              typeof item === "object" &&
              !Array.isArray(item) &&
              typeof item !== "function"
            );
          })
        ).toBe(true);
      });
  });
  test("each object in array contains keys of 'slug' and 'description", () => {
    return request(app)
      .get("/api/topics")
      .then((response) => {
        const rows = response._body.topics.rows;
        expect(
          rows.every((obj) => {
            return obj.slug && obj.description;
          })
        ).toBe(true);
      });
  });
});
