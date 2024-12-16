import { Router } from "express";
const verifyToken = require('../Middleware/Auth.middleware')
import { addNotesToStudent } from "../Controllers/Notes.Controller";
import { getNotesOfStudent } from "../Controllers/Notes.Controller";
import { deleteNote } from "../Controllers/Notes.Controller";

const NotesRouter = Router();

NotesRouter.get('/health',(_,res)=>{
    res.send('Ok!');
});

NotesRouter.post('/addNotes', verifyToken,(req, res) => {
    addNotesToStudent(req, res);
});

NotesRouter.get('/getNotes',verifyToken,(req,res)=>{
    getNotesOfStudent(req,res);
});

NotesRouter.delete('/deleteNote',verifyToken,(req,res)=>{
    deleteNote(req,res);
});



export default NotesRouter;