const Notes = require("../Models/User");
import { Request, Response } from "express";

interface CustomRequest extends Request {
  user?: any;
}

export const fetchUser = async (req: CustomRequest, res: Response) => {
  return req.user;
};

export const addNotesToStudent = async (req: Request, res: Response) => {
    const { note } = req.body;
    const studentId = await fetchUser(req, res); 
  
    try {
      if (!studentId || !note) {
        return res.status(400).send("Student ID and note are required");
      }
      const student = await Notes.findOne({ _id: studentId });
  
      if (!student) {
        return res.status(404).send("Student not found");
      }
  
      if (student.notes.includes(note)) {
        return res.status(400).send("This note already exists for the student");
      }
  
      student.notes.push(note);
      await student.save();
      return res.status(200).json({ message: "Note added successfully", notes: student.notes });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
  };
  

export const getNotesOfStudent = async (req: Request, res: Response) => {
  const studentId = await fetchUser(req, res);

  try {
    if (!studentId) {
      return res.status(400).send("Student ID is required");
    }

    const student = await Notes.findOne({ _id: studentId });

    if (!student) {
      return res.status(404).send("Student not found");
    }

    return res
      .status(200)
      .json({ notes: student.notes, name: student.name, email: student.email });
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  const { note } = req.body;
  const studentId = await fetchUser(req, res);
  console.log(studentId);
  try {
    if (!studentId || !note) {
      return res.status(400).send("Student ID and Note ID are required");
    }

    const student = await Notes.findOne({ _id: studentId });

    if (!student) {
      return res.status(404).send("Student not found");
    }

    const updatedNotes = student.notes.filter((existingNote: string) => existingNote !== note);

    const updatedStudent = await Notes.findOneAndUpdate(
      { _id: studentId },
      { notes: updatedNotes },
      { new: true }
    );

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    return res.status(500).send("Server error");
  }
};
