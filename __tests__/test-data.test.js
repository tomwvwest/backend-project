const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const { toBeSortedBy } = require("jest-sorted");

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
        expect(article.comment_count).toBe(11);
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

describe("GET /api/articles", () => {
  test("200: responds with status code 200", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("returns an array of correct length filled with article objects with correct properties to the client", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        articles.forEach((item) => {
          expect(typeof item.author).toBe("string");
          expect(typeof item.title).toBe("string");
          expect(typeof item.article_id).toBe("number");
          expect(typeof item.topic).toBe("string");
          expect(typeof item.created_at).toBe("string");
          expect(typeof item.votes).toBe("number");
          expect(typeof item.article_img_url).toBe("string");
          expect(typeof item.comment_count).toBe("number");
        });
      });
  });
  test("objects are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const articles = body.articles;
        const sortedArticles = [...articles].sort((a, b) => {
          const aTimestamp = new Date(a.created_at).getTime();
          const bTimestamp = new Date(b.created_at).getTime();
          return bTimestamp - aTimestamp;
        });
        expect(articles).toEqual(sortedArticles);
      });
  });
  test("no object in array carry the body property", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const articles = body.articles;
        articles.forEach((obj) => {
          expect(obj).not.toHaveProperty("body");
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: returns array of correct length filled with objects containing the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("array is ordered by most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: returns an empty array if a valid article_id is requested but no comments are present", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toEqual([]);
      });
  });
  test("404: responds with status 404 and appropriate message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Could not find in articles");
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

describe("POST /api/articles/:article_id/comments", () => {
  test("201: inserts new comment to the db and sends comment back to client, for when the user already exists", () => {
    const newComment = { username: "butter_bridge", body: "great article" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment.comment_id).toBe(19);
        expect(comment.article_id).toBe(2);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("great article");
        expect(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(
            comment.created_at
          )
        ).toBe(true);
        expect(comment.votes).toBe(0);
      });
  });
  test("404: responds with status 404 and appropriate message when given a valid but non-existent id", () => {
    const newComment = { username: "butter_bridge", body: "great article" };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("400: responds with status 400 and appropriate message when given an invalid id", () => {
    const newComment = { username: "butter_bridge", body: "great article" };
    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with status 400 and appropriate message when given only a username", () => {
    const newComment = { username: "butter_bridge" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with status 400 and appropriate message when given only a comment", () => {
    const newComment = { body: "great article" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with status 400 and appropriate message when given a body containnig more than a username and comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "great article",
      hello: "yes",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: patches vote count on specific article and returns updated article", () => {
    const patchObj = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchObj)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.article_id).toBe(1);
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(
            article.created_at
          )
        ).toBe(true);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(article.votes).toBe(110);
      });
  });
  test("404: responds with status 404 and appropriate message when given a valid but non-existent id", () => {
    const patchObj = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1000")
      .send(patchObj)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("400: responds with status 400 and appropriate message when given an invalid id", () => {
    return request(app)
      .patch("/api/articles/invalid_id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with status 400 and appropriate message when given empty body", () => {
    const patchObj = {};
    return request(app)
      .patch("/api/articles/2")
      .send(patchObj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with status 400 and appropriate message when given a body with too many keys", () => {
    const patchObj = {
      inc_votes: 10,
      body: "great article",
      hello: "yes",
    };
    return request(app)
      .patch("/api/articles/2")
      .send(patchObj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with status 400 and appropriate message when given a non-integer to increment votes by", () => {
    const patchObj = {
      inc_votes: "ten",
    };
    return request(app)
      .patch("/api/articles/2")
      .send(patchObj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with status 400 and appropriate message when given a a body with no inc_votes key", () => {
    const patchObj = {
      invalidKey: 10,
    };
    return request(app)
      .patch("/api/articles/2")
      .send(patchObj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes comment from database", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db.query("SELECT * FROM comments");
      })
      .then(({ rows }) => {
        expect(rows.find((obj) => obj.comment_id === 1)).toBe(undefined);
      });
  });
  test("404: responds with status 404 and appropriate message when given a valid but non-existent id ", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment does not exist");
      });
  });
  test("400: responds with status 400 and appropriate message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/invalid_id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe('GET /api/users', () => {
  test('200: returns an array of user objects containing the correct properties', () => {
    return request(app).get('/api/users').expect(200).then(({body}) => {
      const users = body.users;
      expect(users.length).toBe(4);
      users.forEach(user => {
        expect(typeof user.username).toBe('string')
        expect(typeof user.name).toBe('string')
        expect(typeof user.avatar_url).toBe('string')
      })
    })
  })
})