import noteContext from "./noteContext";
import { useState } from "react";
const NoteState = (props) => {
  const host="http://localhost:5000";
  const notesInitial = [];
  const [notes, setnotes] = useState(notesInitial);
  
  const addNote = async (title, description, tag) => {
    const response=await fetch(`${host}/api/notes/addnote`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'auth-token':localStorage.getItem('token')
      },
      body:JSON.stringify({title,description,tag})
    });
    let note=await response.json();
    setnotes(notes.concat(note));
  };

  const getNotes = async () => {
    const response=await fetch(`${host}/api/notes/fetchallnotes`,{
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'auth-token':localStorage.getItem('token')
      }
    });
    const json=await response.json();
    console.log(json);
    setnotes(json);
  }

  const deleteNote = async (id) => {
    const response=await fetch(`${host}/api/notes/deletenote/${id}`,{
      method:'DELETE',
      headers:{
        'Content-Type':'application/json',
        'auth-token':localStorage.getItem('token')
      }
    });
    const json=response.json();
    console.log("deleting note" + id,json);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setnotes(newNotes);
  };
  const editNote = async (id,title,description,tag) => {
    const response=await fetch(`${host}/api/notes/updatenote/${id}`,{
      method:'PUT',
      headers:{
        'Content-Type':'application/json',
        'auth-token':localStorage.getItem('token')
      },
      body:JSON.stringify({title,description,tag})
    });
    const json= response.json();
    console.log(json);
    let newNotes=JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNotes.length; index++) {
      let element = newNotes[index];
      if(element._id===id){
        newNotes[index].title=title;
        newNotes[index].description=description;
        newNotes[index].tag=tag;
        break;
      }
    }
    setnotes(newNotes);
  };
  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote,getNotes }}>
      {props.children}
    </noteContext.Provider>
  );
};
export default NoteState;
