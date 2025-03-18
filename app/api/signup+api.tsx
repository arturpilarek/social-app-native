import jwt from "jsonwebtoken";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    const {email, password} = await request.json();
    // TODO: Validate email and password
    if (!email || !password) {
        return Response.json({message: "Email and password are required"}, {status: 400});
    }

    if (password.length < 8) {
        return Response.json({message: "Password must be at least 8 characters long"}, {status: 400});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return Response.json({message: "Invalid email"}, {status: 400});
    }

    // look up user in db
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    // if user exists, return error
    if (user) {
        return Response.json({message: "User already exists"}, {status: 400});
    }

    // create user in db
    const [newUser] = await db.insert(users).values({
        email,
        // TODO: hash password
        password,
    }).returning();

    // create jwt token
    const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET!);
    // return jwt token
    return Response.json({token});
}