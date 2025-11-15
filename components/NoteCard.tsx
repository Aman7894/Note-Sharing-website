import React, { useState } from 'react';
import { DocumentIcon } from './icons/DocumentIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

const NoteCard = ({ note }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
    
  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadError(null);

    // Simulate a network request for the download
    setTimeout(() => {
      // Randomly fail 30% of the time to demonstrate error handling
      if (Math.random() < 0.3) {
        setDownloadError('Download failed. Please try again.');
        setIsDownloading(false);
      } else {
        // --- REAL DOWNLOAD LOGIC STARTS HERE ---
        // In a real app, you would fetch the file from a server API.
        // For this example, we'll create a dummy file in the browser.
        try {
          // Create placeholder content for the file.
          const fileContent = `This is a dummy file for "${note.title}".\n\nSubject: ${note.subject}\nDescription: ${note.description}`;
          
          // Create a Blob (Binary Large Object) from the content.
          const blob = new Blob([fileContent], { type: 'text/plain' });
          
          // Create a URL for the blob.
          const url = window.URL.createObjectURL(blob);
          
          // Create a temporary anchor (<a>) element to trigger the download.
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', note.fileName); // Set the download filename
          
          // Append the link to the body, click it, and then remove it.
          document.body.appendChild(link);
          link.click();
          
          // Clean up by revoking the object URL and removing the link.
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error creating download file:", error);
            setDownloadError('An error occurred during download.');
        } finally {
            setIsDownloading(false);
        }
        // --- REAL DOWNLOAD LOGIC ENDS HERE ---
      }
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col justify-between">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">{note.subject}</div>
            <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{note.title}</h3>
          </div>
          <div className="ml-4 flex-shrink-0 flex flex-col items-center">
            <DocumentIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">{note.fileType}</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{note.description}</p>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
         <div className="flex items-center justify-between">
             <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded: {note.uploadDate}</p>
            <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center justify-center w-36 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
                {isDownloading ? (
                  <>
                    <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    <span>{downloadError ? 'Retry Download' : 'Download'}</span>
                  </>
                )}
            </button>
         </div>
         {downloadError && (
          <p className="text-xs text-red-500 mt-2 text-right">{downloadError}</p>
        )}
      </div>
    </div>
  );
};

export default NoteCard;