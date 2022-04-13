import { rest } from "msw";
import { ARTIFICIAL_DELAY_MS } from "./server";

export const sampleUser = {
  email: "user1@user.com",
  password: "123456",
};

export const authHandlers = [
  rest.post("/api/login", function (req: any, res: any, ctx: any) {
    const { email, password } = req.body;

    if (email !== sampleUser.email) {
      return res(
        ctx.delay(ARTIFICIAL_DELAY_MS),
        ctx.status(401),
        ctx.json({
          errors: {
            errorEmail: "Wrong email address",
          },
        })
      );
    } else if (password !== sampleUser.password) {
      return res(
        ctx.delay(ARTIFICIAL_DELAY_MS),
        ctx.status(401),
        ctx.json({
          errors: {
            errorPassword: "Wrong password",
          },
        })
      );
    } else {
      return res(
        ctx.delay(ARTIFICIAL_DELAY_MS),
        ctx.json({
          user: {
            ...sampleUser,
            name: sampleUser.email.split("@")[0],
          },
        })
      );
    }
  }),
];
