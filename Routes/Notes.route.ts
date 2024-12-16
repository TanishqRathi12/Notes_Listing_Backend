import { Router } from "express";
const verifyToken = require('../Middleware/Auth.middleware')
const { addNotesToStudent, getNotesOfStudent, deleteNote } = require('../Controllers/Notes.Controller');

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