import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Tool definitions for Gemini
const configureVehicleTool: FunctionDeclaration = {
  name: "configure_vehicle",
  description: "Updates the visual configuration of the vehicle in the 3D showroom canvas in real-time. Call this whenever the customer mentions colors, paint finishes, rims, calipers, interior leather, or packages.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      colorHex: {
        type: Type.STRING,
        description: "The hex color code for the car body paint (e.g., #D1001C for Guards Red, #111315 for Jet Black, #0284C7 for Miami Blue, #EAB308 for Racing Yellow, #374151 for Stealth Matte Grey, #D1D5DB for Chalk, #BE185D for Ruby Star Neo).",
      },
      colorName: {
        type: Type.STRING,
        description: "The luxury name of the paint color.",
      },
      finishType: {
        type: Type.STRING,
        enum: ["glossy", "matte", "metallic"],
        description: "The paint finish reflection type.",
      },
      rimStyle: {
        type: Type.STRING,
        enum: ["classic", "spyder", "aero", "gt3"],
        description: "The wheel rim design architecture.",
      },
      rimColorHex: {
        type: Type.STRING,
        description: "Hex color code for the wheel rims (e.g., #D1D5DB silver, #18181B satin black, #CA8A04 aurum gold, #4B5563 titanium).",
      },
      rimColorName: {
        type: Type.STRING,
        description: "Name of the rim color finish.",
      },
      caliperColorHex: {
        type: Type.STRING,
        description: "Brake caliper hex color (e.g., #DC2626 Guards Red, #FACC15 Racing Yellow PCCB ceramic, #84CC16 Acid Green, #09090B High Gloss Black).",
      },
      caliperColorName: {
        type: Type.STRING,
        description: "Name of the caliper color.",
      },
      interiorColorHex: {
        type: Type.STRING,
        description: "Interior upholstery hex color (e.g., #18181B Black Race-Tex, #854D0E Cognac Club Leather, #881337 Bordeaux Red).",
      },
      interiorColorName: {
        type: Type.STRING,
        description: "Name of the interior color.",
      },
      selectedPackage: {
        type: Type.STRING,
        enum: ["Standard", "Sport Chrono", "Weissach Lightweight"],
        description: "Performance package upgrade.",
      }
    },
  },
};

const setCameraViewTool: FunctionDeclaration = {
  name: "set_camera_view",
  description: "Smoothly pans and rotates the 3D showroom camera to focus on a specific part or angle of the vehicle.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      viewPreset: {
        type: Type.STRING,
        enum: ["hero", "front", "side", "rear", "top", "engine", "wheel_detail", "interior"],
        description: "The target camera preset angle.",
      },
      reason: {
        type: Type.STRING,
        description: "Why the camera is shifting to this view.",
      }
    },
    required: ["viewPreset"],
  },
};

const toggleFeatureTool: FunctionDeclaration = {
  name: "toggle_feature",
  description: "Toggles interactive physical vehicle mechanisms such as active aerodynamics rear spoiler, headlights illumination, opening doors, or exploded engineering inspection view.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      feature: {
        type: Type.STRING,
        enum: ["headlights", "spoiler", "doors", "exploded_view"],
        description: "Which vehicle mechanical feature to toggle.",
      },
      state: {
        type: Type.BOOLEAN,
        description: "True to activate/open/deploy, false to deactivate/close/stow.",
      }
    },
    required: ["feature", "state"],
  },
};

const switchModelTool: FunctionDeclaration = {
  name: "switch_model",
  description: "Switches the showroom vehicle to a different model.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      modelId: {
        type: Type.STRING,
        enum: ["911_carrera_gts", "911_gt3_rs", "taycan_turbo_gt"],
        description: "The vehicle model identifier.",
      }
    },
    required: ["modelId"],
  },
};

const SYSTEM_INSTRUCTION = `
You are "Alex", the elite AI Sales & Engineering Specialist for a flagship luxury Porsche Design Studio and showroom.
Your mission is to welcome clients, guide them through configuring their dream vehicle, explain performance engineering specs passionately, and manipulate the 3D showroom in real-time.

Core Directives:
1. Elite Luxury Tone: Sophisticated, knowledgeable, passionate about automotive dynamics, horsepower, aerodynamics, downforce, and Porsche heritage (Zuffenhausen, Weissach, Nürburgring records).
2. Proactive Real-Time 3D Action: Whenever the client asks to change a color, swap wheels, inspect the engine, check the brakes, view the interior, deploy the spoiler, or see an exploded engineering view, you MUST trigger the appropriate tool alongside your verbal response!
   - For paint/wheels/calipers/interior: Call \`configure_vehicle\` with exact hex values and names.
   - For looking at parts: Call \`set_camera_view\` (e.g., 'engine' when discussing boxer engines, 'wheel_detail' for carbon ceramic brakes, 'interior' for cockpit).
   - For mechanical action: Call \`toggle_feature\` (spoiler, headlights, doors, exploded_view).
   - For vehicle changes: Call \`switch_model\`.
3. Conciseness for Voice: The client will hear your response spoken aloud. Keep your spoken responses punchy, vivid, and elegant (2 to 4 sentences). State the visual changes you're making dynamically.
4. If the client asks for pricing or quotes, give accurate luxury figures and note the options applied.
`;

// API Routes
app.post("/api/agent/chat", async (req, res) => {
  try {
    const { message, currentConfig, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();

    // Contextual system prompt with current state
    const contextualSystemInstruction = `${SYSTEM_INSTRUCTION}

Current Vehicle State in Showroom:
- Model: ${currentConfig?.modelName || 'Porsche 911 Carrera GTS'} (${currentConfig?.modelId || '911_carrera_gts'})
- Body Color: ${currentConfig?.bodyColorName || 'Guards Red'} (${currentConfig?.bodyColor || '#D1001C'}), Finish: ${currentConfig?.finish || 'glossy'}
- Wheels: ${currentConfig?.rimStyle || 'classic'} in ${currentConfig?.rimColorName || 'Satin Black'} (${currentConfig?.rimColor || '#18181B'})
- Brake Calipers: ${currentConfig?.caliperColorName || 'Guards Red'} (${currentConfig?.caliperColor || '#DC2626'})
- Interior: ${currentConfig?.interiorColorName || 'Black Race-Tex'} (${currentConfig?.interiorColor || '#18181B'})
- Active Aero Wing Deployed: ${currentConfig?.spoilerActive ? 'Yes' : 'No'}
- Headlights: ${currentConfig?.headlightsOn ? 'Illuminated' : 'Off'}
- Doors: ${currentConfig?.doorsOpen ? 'Open' : 'Closed'}
- Exploded Architecture View: ${currentConfig?.explodedView ? 'Active' : 'Assembled'}
- Selected Package: ${currentConfig?.selectedPackage || 'Sport Chrono'}
`;

    if (!ai) {
      // Graceful fallback if GEMINI_API_KEY is not configured yet
      // Deterministic NLP pattern matching for common requests
      const lower = message.toLowerCase();
      const toolCalls: any[] = [];
      let replyText = "Welcome to the studio. I am Alex, your showroom specialist. How would you like to configure your Porsche today?";

      if (lower.includes("red")) {
        toolCalls.push({
          name: "configure_vehicle",
          args: { colorHex: "#D1001C", colorName: "Guards Red", finishType: "glossy" },
          summary: "Applied Guards Red factory racing paint"
        });
        replyText = "Applying historic Guards Red gloss paint to the Carrera. Notice how the iconic silhouette commands the showroom under this lighting.";
      } else if (lower.includes("matte") || lower.includes("black") || lower.includes("stealth")) {
        toolCalls.push({
          name: "configure_vehicle",
          args: { colorHex: "#18181B", colorName: "Stealth Satin Black", finishType: "matte", rimColorHex: "#111111", rimColorName: "Satin Black" },
          summary: "Applied Stealth Satin Black paint and blacked-out rims"
        });
        replyText = "Understood. Shifting to an ultra-stealth Satin Black finish with matching dark alloy rims for an aggressive stance.";
      } else if (lower.includes("yellow")) {
        toolCalls.push({
          name: "configure_vehicle",
          args: { colorHex: "#EAB308", colorName: "Racing Yellow", finishType: "glossy" },
          summary: "Applied Racing Yellow gloss finish"
        });
        replyText = "Racing Yellow activated. A pure motorsport tribute directly from Weissach.";
      } else if (lower.includes("blue") || lower.includes("miami")) {
        toolCalls.push({
          name: "configure_vehicle",
          args: { colorHex: "#0284C7", colorName: "Miami Blue", finishType: "glossy" },
          summary: "Applied Miami Blue PTS paint"
        });
        replyText = "Paint to Sample Miami Blue applied. One of our most coveted heritage finishes.";
      } else if (lower.includes("engine") || lower.includes("motor") || lower.includes("specs")) {
        toolCalls.push({
          name: "set_camera_view",
          args: { viewPreset: "engine", reason: "Focus on rear-mounted boxer powerplant" },
          summary: "Camera shifted to Engine Bay perspective"
        });
        toolCalls.push({
          name: "toggle_feature",
          args: { feature: "exploded_view", state: true },
          summary: "Exploded view reveals twin-turbo flat-six architecture"
        });
        replyText = "Here is the heart of the machine: a 3.6-liter twin-turbo boxer-6 paired with an electric exhaust turbocharger producing 532 horsepower and catapulting 0-60 in 2.9 seconds.";
      } else if (lower.includes("wheel") || lower.includes("rim") || lower.includes("tire")) {
        toolCalls.push({
          name: "set_camera_view",
          args: { viewPreset: "wheel_detail", reason: "Focusing on motorsport wheels" },
          summary: "Zoomed into forged alloy wheel assembly"
        });
        replyText = "Taking a closer look at the 20/21-inch staggered forged alloy setup equipped with Michelin Pilot Sport Cup 2 rubber.";
      } else if (lower.includes("wing") || lower.includes("spoiler")) {
        const nextState = !currentConfig?.spoilerActive;
        toolCalls.push({
          name: "toggle_feature",
          args: { feature: "spoiler", state: nextState },
          summary: `${nextState ? 'Deployed' : 'Stowed'} active aerodynamic rear wing`
        });
        replyText = nextState 
          ? "Deploying the active rear wing into high-downforce attack mode." 
          : "Stowing the rear aero spoiler into clean high-speed touring profile.";
      } else if (lower.includes("explode") || lower.includes("chassis") || lower.includes("parts")) {
        const nextExploded = !currentConfig?.explodedView;
        toolCalls.push({
          name: "toggle_feature",
          args: { feature: "exploded_view", state: nextExploded },
          summary: `${nextExploded ? 'Engaged' : 'Dismissed'} exploded engineering architecture`
        });
        replyText = nextExploded 
          ? "Exploding the 3D model to reveal the suspension geometry, powertrain placement, and composite aerodynamic panels." 
          : "Reassembling the body panels back into showroom configuration.";
      } else if (lower.includes("door")) {
        const nextDoors = !currentConfig?.doorsOpen;
        toolCalls.push({
          name: "toggle_feature",
          args: { feature: "doors", state: nextDoors },
          summary: `${nextDoors ? 'Opened' : 'Closed'} doors to display cockpit`
        });
        toolCalls.push({
          name: "set_camera_view",
          args: { viewPreset: "interior" },
          summary: "Centered cockpit perspective"
        });
        replyText = nextDoors 
          ? "Opening the doors. Step inside to see the Race-Tex microfiber and carbon bucket seats." 
          : "Doors secured shut.";
      }

      return res.json({
        replyText,
        toolCalls,
        audioText: replyText,
      });
    }

    // Call Gemini 3.8 Flash with function calling
    const formattedContents: any[] = [];

    // Include recent history if provided
    if (Array.isArray(history)) {
      for (const h of history.slice(-4)) {
        formattedContents.push({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content }],
        });
      }
    }

    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction: contextualSystemInstruction,
        temperature: 0.7,
        tools: [{
          functionDeclarations: [
            configureVehicleTool,
            setCameraViewTool,
            toggleFeatureTool,
            switchModelTool
          ]
        }]
      }
    });

    const replyText = response.text || "I have applied your custom specifications to the vehicle on screen.";
    const rawCalls = response.functionCalls || [];
    
    const executedTools = rawCalls.map((call) => {
      let summary = `Triggered ${call.name}`;
      if (call.name === "configure_vehicle") {
        const args: any = call.args || {};
        const parts = [];
        if (args.colorName) parts.push(`Paint: ${args.colorName} (${args.finishType || 'finish'})`);
        if (args.rimColorName || args.rimStyle) parts.push(`Wheels: ${args.rimStyle || ''} in ${args.rimColorName || ''}`);
        if (args.caliperColorName) parts.push(`Calipers: ${args.caliperColorName}`);
        summary = `Configured 3D vehicle (${parts.join(", ")})`;
      } else if (call.name === "set_camera_view") {
        const args: any = call.args || {};
        summary = `Camera adjusted to ${args.viewPreset} angle`;
      } else if (call.name === "toggle_feature") {
        const args: any = call.args || {};
        summary = `${args.state ? 'Enabled' : 'Disabled'} ${args.feature}`;
      } else if (call.name === "switch_model") {
        const args: any = call.args || {};
        summary = `Switched vehicle to ${args.modelId}`;
      }
      return {
        name: call.name,
        args: call.args,
        summary
      };
    });

    return res.json({
      replyText,
      toolCalls: executedTools,
      audioText: replyText,
    });
  } catch (error: any) {
    console.error("Error in /api/agent/chat:", error);
    res.status(500).json({ 
      error: error.message || "Failed to process showroom assistant request",
      replyText: "My apologies, the showroom telemetry encountered a momentary delay. Let me know what finish or angle you'd like to adjust.",
      toolCalls: []
    });
  }
});

// Start the Express and Vite server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Porsche 3D AI Showroom Server listening on port ${PORT}`);
  });
}

startServer();
