
import React, { useState } from 'react';
import Header from './components/Header';
import NoteUploadForm from './components/NoteUploadForm';
import NoteList from './components/NoteList';

const initialNotes = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    subject: 'Computer Science',
    description: 'Comprehensive notes covering useState, useEffect, useContext, and custom hooks with examples.',
    fileName: 'react_hooks_intro.pdf',
    fileType: 'PDF',
    uploadDate: '2023-10-26',
  },
  {
    id: '2',
    title: 'The Citric Acid Cycle',
    subject: 'Biology',
    description: 'Detailed diagrams and explanations of the Krebs cycle, its enzymes, and its role in cellular respiration.',
    fileName: 'citric_acid_cycle.docx',
    fileType: 'DOCX',
    uploadDate: '2023-10-25',
  },
  {
    id: '3',
    title: 'Calculus I - Limits and Derivatives',
    subject: 'Mathematics',
    description: 'A complete set of notes for first-semester calculus, focusing on the fundamental concepts of limits and derivatives.',
    fileName: 'calculus_I_notes.pdf',
    fileType: 'PDF',
    uploadDate: '2023-10-24',
  },
   {
    id: '4',
    title: 'World War II: European Theatre',
    subject: 'History',
    description: 'In-depth analysis of major battles, strategies, and key figures in the European Theatre of WWII.',
    fileName: 'wwii_europe.pdf',
    fileType: 'PDF',
    uploadDate: '2023-10-22',
  },
];


const App = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadNote = (newNoteData) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newNote = {
        ...newNoteData,
        id: new Date().getTime().toString(),
        uploadDate: new Date().toISOString().split('T')[0],
      };
      setNotes(prevNotes => [newNote, ...prevNotes]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <NoteUploadForm onUpload={handleUploadNote} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-8">
            <NoteList notes={notes} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;