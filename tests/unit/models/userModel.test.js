const mongoose = require("mongoose");
const User = require("../../../src/models/User"); // Adjust path as per your structure
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("User Model", () => {
  it("should hash password before saving", async () => {
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "plainpassword",
    });

    await user.save();

    expect(user.password).not.toBe("plainpassword"); // Password should be hashed
  });

  it("should validate correct password using isValidPassword", async () => {
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "testpassword123",
    });

    await user.save();

    const isValid = await user.isValidPassword("testpassword123");
    expect(isValid).toBe(true);
  });

  it("should return false for incorrect password", async () => {
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "testpassword123",
    });

    await user.save();

    const isValid = await user.isValidPassword("wrongpassword");
    expect(isValid).toBe(false);
  });
});
