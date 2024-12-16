const Author = require("../Models/Auth");
import { Request, Response } from "express";

interface CustomRequest extends Request {
  user?: any;
}

export const fetchUser = async (req: CustomRequest, res: Response) => {
  return req.user;
};

export const addAuthorToStudent = async (req: Request, res: Response) => {
    const { note } = req.body;
    const studentId = await fetchUser(req, res); 
  
    try {
      if (!studentId || !note) {
        return res.status(400).send("Student ID and note are required");
      }
      const student = await Author.findOne({ _id: studentId });
  
      if (!student) {
        return res.status(404).send("Student not found");
      }
  
      if (student.Author.includes(note)) {
        return res.status(400).send("This note already exists for the student");
      }
  
      student.Author.push(note);
      await student.save();
      return res.status(200).json({ message: "Note added successfully", Author: student.Author });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
  };
  

export const getAuthorOfStudent = async (req: Request, res: Response) => {
  const studentId = await fetchUser(req, res);

  try {
    if (!studentId) {
      return res.status(400).send("Student ID is required");
    }

    const student = await Author.findOne({ _id: studentId });

    if (!student) {
      return res.status(404).send("Student not found");
    }

    return res
      .status(200)
      .json({ Author: student.Author, name: student.name, email: student.email });
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

    const student = await Author.findOne({ _id: studentId });

    if (!student) {
      return res.status(404).send("Student not found");
    }

    const updatedAuthor = student.Author.filter((existingNote: string) => existingNote !== note);

    const updatedStudent = await Author.findOneAndUpdate(
      { _id: studentId },
      { Author: updatedAuthor },
      { new: true }
    );

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    return res.status(500).send("Server error");
  }
};
