import express from "express";
import cors from "cors";
import db from "../db/db_connect.js";
import { userSchema } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));


app.use(express.json());

app.post("/create", async (req, res) => {
    try {
        const { name } = req.body;
        const { month } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        } else if (!month) {
            return res.status(400).json({ error: "Month is required" });
        }

        const id = uuidv4();

        await db.insert(userSchema).values({ id, name, month });

        const [user] = await db.select().from(userSchema).where(eq(userSchema.id, id));
        return res.json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Failed to create user" });
    }
});

// Get All Users
app.get("/user", async (req, res) => {
    try {
        const users = await db.select().from(userSchema);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Update User
app.put("/user/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;
        const { month } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        } else if (!month) {
            return res.status(400).json({ error: "Month is required" });
        }

        const updateResult = await db
            .update(userSchema)
            .set({ name, month })
            .where(eq(userSchema.id, id));

        if (updateResult.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const [updatedUser] = await db.select().from(userSchema).where(eq(userSchema.id, id));
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
});

// Delete User
app.delete("/user/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const deleteResult = await db.delete(userSchema).where(eq(userSchema.id, id));

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

app.listen(8000, () => {
    console.log("🚀 Server is running on port 8000");
});
