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
        expect(typeof JSON.parse(apis)).toBe("object");
      });
  });
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

describe("GET /api/articles/:article_id", () => {
  test("200: responds with status code 200 with valid request", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("returns an object with correct property data types to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .then((response) => {
        const article = response.body.article;
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });
  test("returns correct object to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .then((response) => {
        const article = response.body.article;
        const dateCreatedtoLocalTime = new Date(1594329060000 - 60 * 60 * 1000);

        expect(article.created_at).toBe(dateCreatedtoLocalTime.toISOString());
        expect(article.article_id).toBe(1);
        expect(article.author).toBe("butter_bridge");
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.topic).toBe("mitch");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("404: responds with status 404 and appropriate message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("400: responds with status 400 and appropriate message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

xdescribe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with status code 200 with valid request", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("returns array of correct length filled with objects containing the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBe(11);
        
      });
  });
  test("array is ordered by most recent first", () => {});
  test("returns an empty array if a valid article_id is requested but no comments are present", () => {});
  test("404: responds with status 404 and appropriate message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("400: responds with status 400 and appropriate message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
