const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Note = require("../models/Note");

// ROUTE 1: get all the notes using get: api/notes/fetchAllNotes
router.get("/fetchAllNotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error occured");
  }
});

// ROUTE 2: add a note using post: api/notes/addNote
router.post(
  "/addNote",
  fetchuser,
  [
    // accepting the name email and password from the user
    body("title", "enter a valid ttile").isLength({ min: 3 }),
    body("description", "description must be atleast five characters").isLength(
      { min: 5 },
      body("tag", "enter a valid tag").isLength({ min: 3 }),
    ),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json({ savedNote });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error occured");
    }
  }
);

// ROUTE 3: updated the existing note using put:  api/notes/updateNote  login required
router.put("/updateNote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  // create new note object
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  // find the note to be updated and update it
  let note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).send("not found");
  }

  // checking whether the user of node is same as the logged user ==>if(note's user !== logged user)
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("not allowed to update");
  }

  note = await Note.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json({ note });
});

// ROUTE 4: delete the note using delete: api/notes/deleteNote login required
router.delete("/deleteNote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }

    // checking whether the user of node is same as the logged user ==>if(note's user !== logged user)
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("deletion not allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "success note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error occured");
  }
});

module.exports = router;
