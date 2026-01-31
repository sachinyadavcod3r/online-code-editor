// const express = require("express");
// const path = require("path");
// const bodyP = require("body-parser");
// const compiler = require("compilex");

// const app = express();
// const options = { stats: true };
// compiler.init(options);

// // Middleware
// app.use(bodyP.json());
// app.use(bodyP.urlencoded({ extended: true }));

// // Serve static files (CodeMirror, HTML, etc.)
// app.use(express.static(path.join(__dirname, "../public")));

// // Codemirror static path (optional, since express.static handles it)
// app.use("/codemirror-5.65.19", express.static(path.join(__dirname, "../codemirror-5.65.19")));

// // Routes
// app.get("/", (req, res) => {
//   compiler.flush(() => console.log("Cache cleared"));
//   res.sendFile(path.join(__dirname, "../public/index.html"));
// });

// app.get("/login", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/login.html"));
// });

// app.get("/register", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/register.html"));
// });

// // Compile route
// app.post("/compile", (req, res) => {
//   const { code, input, lang } = req.body;

//   const envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };

//   try {
//     if (lang === "Cpp") {
//       if (!input) {
//         compiler.compileCPP(envData, code, data => res.send(data?.output ? data : { output: "error" }));
//       } else {
//         compiler.compileCPPWithInput(envData, code, input, data => res.send(data?.output ? data : { output: "error" }));
//       }
//     } else if (lang === "Java") {
//       const javaEnv = { OS: "windows" };
//       if (!input) {
//         compiler.compileJava(javaEnv, code, data => res.send(data?.output ? data : { output: "error" }));
//       } else {
//         compiler.compileJavaWithInput(javaEnv, code, input, data => res.send(data?.output ? data : { output: "error" }));
//       }
//     } else if (lang === "Python") {
//       const pyEnv = { OS: "windows" };
//       if (!input) {
//         compiler.compilePython(pyEnv, code, data => res.send(data?.output ? data : { output: "error" }));
//       } else {
//         compiler.compilePythonWithInput(pyEnv, code, input, data => res.send(data?.output ? data : { output: "error" }));
//       }
//     } else {
//       res.send({ output: "Unsupported language" });
//     }
//   } catch (e) {
//     console.log("Compilation error:", e);
//     res.send({ output: "Server error" });
//   }
// });

// // dummy save-code route
// app.post("/save-code", (req, res) => {
//   res.send("log in to save your code");
// });

// // Start server
// app.listen(8000, () => {
//   console.log("Server running at http://localhost:8000");
// });
require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyP = require("body-parser");
const compiler = require("compilex");
const cookieParser = require("cookie-parser");
const connectDB = require("./db");
connectDB();


// Route imports
const authRoutes = require("./routes/authRoutes");
const codeRoutes = require("./routes/codeRoutes");
const protectPage = require("./middleware/protectPage");


const app = express();

// ✅ Initialize compilex
const options = { stats: true };
compiler.init(options);

// Middleware
app.use(bodyP.json());
app.use(bodyP.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, "../public")));
app.use("/codemirror-5.65.19", express.static(path.join(__dirname, "../codemirror-5.65.19")));

// ✅ Auth and Code routes
app.use("/api/auth", authRoutes);
app.use("/api/code", codeRoutes);

// ✅ Compilation route
app.post("/compile", (req, res) => {
  const { code, input, lang } = req.body;
  const envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };

  try {
    if (lang === "Cpp") {
      if (!input) {
        compiler.compileCPP(envData, code, (data) => res.send(data));
      } else {
        compiler.compileCPPWithInput(envData, code, input, (data) => res.send(data));
      }
    } else if (lang === "Java") {
      const javaEnv = { OS: "windows" };
      if (!input) {
        compiler.compileJava(javaEnv, code, (data) => res.send(data));
      } else {
        compiler.compileJavaWithInput(javaEnv, code, input, (data) => res.send(data));
      }
    } else if (lang === "Python") {
      const pyEnv = { OS: "windows" };
      if (!input) {
        compiler.compilePython(pyEnv, code, (data) => res.send(data));
      } else {
        compiler.compilePythonWithInput(pyEnv, code, input, (data) => res.send(data));
      }
    } else {
      res.send({ output: "Unsupported language" });
    }
  } catch (e) {
    console.error("Compilation error:", e);
    res.send({ output: "Server error" });
  }
});

// ✅ Frontend routes (for browser navigation)
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/index.html"))
);
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/login.html"))
);
app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/register.html"))
);
// 🔒 Protected pages
app.get("/profile", protectPage, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/profile.html"));
});

app.get("/mycodes", protectPage, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/mycodes.html"));
});

// ✅ Start the server
app.listen(8000, () => {
  console.log("🚀 Server running at http://localhost:8000");
});
