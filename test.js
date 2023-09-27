const app = require("./index");
const supertest = require("supertest");
const request = supertest(app);
const { sequelize } = require("./storage/database");

let server;

describe("Async tests", () => {
  beforeAll(async () => {
    server = app.listen(8001);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
    await server.close();
  });

  //First test add endpoint as we use it for the other integration tests
  it("Tests adding negative points", async () => {
    const res = await request.post("/add").send({
      payer: "PranavRocks",
      points: -1500,
      timestamp: "2020-11-24T14:00:00Z",
    });

    expect(res.status).toBe(400);
  });

  it("Tests add endpoint", async () => {
    const res = await request.post("/add").send({
      payer: "DANNON",
      points: 1000,
      timestamp: "2020-11-02T14:00:00Z",
    });

    expect(res.status).toBe(200);
  });

  //Test balance endpoint
  it("Gets the balance endpoint", async () => {
    const res = await request.get("/balance");

    expect(res.status).toBe(200);
  });

  it("Add", async () => {
    const res = await request.post("/add").send({
      payer: "PranavRocks",
      points: 2000,
      timestamp: "2020-11-24T14:00:00Z",
    });

    expect(res.status).toBe(200);
  });

  //Test spend endpoint
  it("Tests spend endpoint", async () => {
    const res = await request.post("/spend").send({
      points: 1500,
    });

    expect(res.body["DANNON"]).toBe(-1000);
    expect(res.body["PranavRocks"]).toBe(-500);
  });

  //Tests order thouroughly as well as removal of payer with 0 points
  it("Tests order of spend endpoint is not recency of insertion", async () => {
    await request.post("/add").send({
      payer: "Charizard",
      points: 3000,
      timestamp: "2020-11-21T14:00:00Z",
    });
    const res = await request.post("/spend").send({
      points: 3000,
    });
    expect(res.body["Charizard"]).toBe(-3000);
    expect(res.body["PranavRocks"]).toBe(0);
  });

  it("Tests overspend", async () => {
    const res = await request.post("/spend").send({
      points: 2500,
    });

    expect(res.status).toBe(400);
  });

  it("Tests spending negative", async () => {
    const res = await request.post("/spend").send({
      points: -1500,
    });

    expect(res.status).toBe(400);
  });
});
