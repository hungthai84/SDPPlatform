import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { getOrCreateUser, getUserProfile } from './src/db/users.ts';
import { db } from './src/db/index.ts';
import { users, tasks } from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';

dotenv.config();

// Default User ID for non-authenticated access
const DEFAULT_USER_UID = 'user-1';
const DEFAULT_USER_EMAIL = 'hungthai84@gmail.com';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Chat Route
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { prompt, systemInstruction, context } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
        systemInstruction: systemInstruction 
      });

      const fullPrompt = context ? `Context: ${context}\n\nHuman: ${prompt}` : prompt;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      res.json({ text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  });

  // API endpoints
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, html } = req.body;
      
      // Mock sending since RESEND_API_KEY is removed
      console.log("Mock Email Sent (Feature is now in mock mode):");
      console.log("To:", to);
      console.log("Subject:", subject);
      console.log("Body:", html);
      return res.json({ success: true, mock: true, message: "Email simulated successfully (RESEND_API_KEY was removed)" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to send email" });
    }
  });

  // User Profile Synchronization & Lookup Endpoint
  app.post("/api/users/sync", async (req, res) => {
    try {
      const { name, avatar, phoneNumber, role, uid: providedUid, email: providedEmail } = req.body;
      
      const uid = providedUid || DEFAULT_USER_UID;
      const email = providedEmail || DEFAULT_USER_EMAIL;

      const user = await getOrCreateUser({
        uid,
        name: name || email.split("@")[0] || "User",
        email,
        avatar,
        phoneNumber,
        role: role || 'superadmin',
      });

      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error("User Sync Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to sync user profile";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get("/api/users/me", async (req, res) => {
    try {
      // Use provided UID or default
      const uid = req.query.uid as string || DEFAULT_USER_UID;
      const user = await getUserProfile(uid);
      if (!user) {
        // Create default user if not found
        const newUser = await getOrCreateUser({
            uid: DEFAULT_USER_UID,
            name: "Hung Thai",
            email: DEFAULT_USER_EMAIL,
            role: 'superadmin'
        });
        return res.status(200).json({ success: true, user: newUser });
      }
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error("Get Profile Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch user profile";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const allUsers = await db.select().from(users);
      res.status(200).json(allUsers);
    } catch (error) {
      console.error("Get Users Error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Cloud SQL Tasks APIs
  app.get("/api/tasks", async (req, res) => {
    try {
      const uid = req.query.uid as string || DEFAULT_USER_UID;
      const userTasks = await db.select()
        .from(tasks)
        .where(eq(tasks.ownerId, uid))
        .orderBy(desc(tasks.updatedAt));
      res.status(200).json(userTasks);
    } catch (error) {
      console.error("Get Tasks Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch tasks";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const { id, title, description, completed, status, priority, recurring, dueDate, taskListId, order, uid: providedUid } = req.body;
      const uid = providedUid || DEFAULT_USER_UID;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      let result;
      if (id) {
        // Update task
        result = await db.update(tasks)
          .set({
            title,
            description,
            completed: completed ?? false,
            status: status || 'Cần làm',
            priority: priority || 'Trung bình',
            recurring: recurring || 'none',
            dueDate,
            taskListId,
            order: order || 0,
            updatedAt: new Date(),
          })
          .where(eq(tasks.id, Number(id)))
          .returning();
      } else {
        // Create task
        result = await db.insert(tasks)
          .values({
            title,
            description,
            completed: completed ?? false,
            status: status || 'Cần làm',
            priority: priority || 'Trung bình',
            recurring: recurring || 'none',
            dueDate,
            taskListId,
            order: order || 0,
            ownerId: uid,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
      }

      res.status(200).json(result[0]);
    } catch (error) {
      console.error("Save Task Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save task";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
