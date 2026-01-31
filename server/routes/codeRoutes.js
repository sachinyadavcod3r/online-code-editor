const express = require("express");
const Code = require("../models/Code");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Save new code
router.post("/save", auth, async (req, res) => {
  try {
    const { filename, language, code } = req.body;

    await Code.create({
      userId: req.user.id,
      filename,
      language,
      code,
    });

    res.json({ message: "Project saved successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving code" });
  }
});


// Get user's codes
router.get("/mycodes", auth, async (req, res) => {
  const codes = await Code.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(codes);
});

module.exports = router;

router.get("/get/:id", auth, async (req, res) => {
  const code = await Code.findById(req.params.id);
  res.json(code);
});
// 🗑️ Delete project
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    await Code.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting project" });
  }
});
// ✏️ Rename project
router.put("/rename/:id", auth, async (req, res) => {
  try {
    const { newName } = req.body;
    const code = await Code.findById(req.params.id);

    if (!code) return res.status(404).json({ message: "Project not found" });

    // Generate extension based on language
    let ext = ".txt";
    if (code.language === "Cpp") ext = ".cpp";
    if (code.language === "Java") ext = ".java";
    if (code.language === "Python") ext = ".py";

    code.filename = newName + ext;
    await code.save();

    res.json({ message: "Project renamed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error renaming project" });
  }
});

