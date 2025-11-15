
import React from 'react';
import NoteCard from './NoteCard';

const NoteList = ({ notes }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Available Notes</h2>
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map(note => (
            // FIX: Wrap NoteCard in a React.Fragment and move the key prop to it.
            // This resolves a TypeScript error where the 'key' prop was being passed to NoteCard,
            // which was not expected in its props type. Using a fragment avoids adding an unnecessary div to the DOM.
            <React.Fragment key={note.id}>
              <NoteCard note={note} />
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-500 dark:text-gray-400">No notes have been uploaded yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Be the first to share!</p>
        </div>
      )}
    </div>
  );
};

export default NoteList;