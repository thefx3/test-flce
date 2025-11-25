// auth/testSessionRequired.js
import jwt from "jsonwebtoken";

export default function testSessionRequired(req, res, next) {
  try {
    // 1. Get the token
    const token =
      req.headers["x-test-session-id"] ||
      req.headers["x-test-session"] ||
      null;

    if (!token) {
      return res.status(401).json({
        message: "Missing test session token",
      });
    }

    // 2. Sign secret
    const secret = process.env.TEST_SESSION_SECRET;
    if (!secret) {
      return res.status(500).json({
        message: "Server misconfiguration: TEST_SESSION_SECRET missing",
      });
    }

    // 3. Check JWT signature
    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch (err) {
      return res.status(403).json({
        message: "Invalid or expired test session token",
      });
    }

    // payload = { testId, createdAt, iat, exp }

    // 4. Check if test is on the right route
    const testId = Number(req.params.testId);
    if (Number.isNaN(testId)) {
      return res.status(400).json({
        message: "Invalid test ID in URL",
      });
    }

    if (Number(payload.testId) !== testId) {
      return res.status(403).json({
        message: "Token does not match this test",
      });
    }

    // 5. Attach session to req
    req.testSession = payload;

    next();
  } catch (err) {
    console.error("testSessionRequired error:", err);
    return res.status(500).json({
      message: "Server error validating session token",
    });
  }
}
