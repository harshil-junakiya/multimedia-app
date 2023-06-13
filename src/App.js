import React, { useState, useEffect } from 'react';
import { data } from './data';
import { Header } from "./components/Header";
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function App() {
  const [myFiles, setMyFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePath, setFilePath] = useState("/file-server/");
  const [showChartModal, setShowChartModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);

  useEffect(() => {
    setMyFiles(data);
  }, []);

  useEffect(() => {
    // Filter files based on search criteria
    const filtered = myFiles.filter(file =>
      file.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [myFiles, searchText]);

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Files Breakdown',
      },
    },
  };

  const deleteFile = (file) => {
    const updatedFiles = myFiles.filter((f) => f.id !== file.id);
    setMyFiles(updatedFiles);
    setSelectedFile(null);
  };

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    // Assuming the uploaded files have a unique ID
    const uploadedFiles = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      path: URL.createObjectURL(file),
      type: getFileType(file),
    }));
    setMyFiles([...myFiles, ...uploadedFiles]);
  };

  const getFileType = (file) => {
    const fileType = file.type.split('/')[0];
    switch (fileType) {
      case 'video':
        return 'video';
      case 'audio':
        return 'audio';
      case 'image':
        return 'image';
      default:
        return 'document';
    }
  };


  const renameFile = (file) => {
    const newFileName = prompt("Enter the new file name", file.name);
    if (newFileName) {
      const updatedFiles = myFiles.map((f) =>
        f.id === file.id ? { ...f, name: newFileName } : f
      );
      setMyFiles(updatedFiles);
    }
  };

  const searchFiles = () => {
    // Filter the myFiles state based on the search criteria
    const filtered = myFiles.filter(file =>
      file.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredFiles(filtered);
  };

  return (
    <>
      {showChartModal && (
        /* Chart modal content */
        <div>Chart Model</div>
      )}
      <div className="App">
        <Header />
        <div style={styles.container}>
          {/* Search functionality */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              style={styles.searchInput}
              placeholder="Search files"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button style={styles.searchButton} onClick={styles.searchButton}>
              Search
            </button>
          </div>
          <div style={styles.controlTools}>
            {/* File upload */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="file-upload" style={styles.uploadButton}>
                Upload File
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                multiple
              />
            </div>
            <button
              style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  renameFile(selectedFile);
                  setSelectedFile(null);
                }
              }}
            >
              Rename
            </button>
            <button
              style={styles.controlButton}
              onClick={() => setShowChartModal(true)}
            >
              Files Breakdown
            </button>
            <button
              style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  window.open(selectedFile.path, '_blank');
                }
              }}
            >
              Download
            </button>
            <button
              style={styles.controlButton}
              onClick={() => deleteFile(selectedFile)}
            >
              Delete
            </button>
          </div>
          <div style={styles.fileContainer}>
            <div style={{ width: '100%', padding: 10 }}>
              {/* Render filteredFiles instead of myFiles */}
              {filteredFiles.map((file) => {
                if (file.path.slice(0, filePath.length) === filePath) {
                  return (
                    <div
                      style={{
                        ...styles.file,
                        backgroundColor:
                          selectedFile && selectedFile.id === file.id
                            ? '#ccc'
                            : '#eee',
                      }}
                      className="files"
                      key={file.id}
                      onClick={() => {
                        if (
                          selectedFile &&
                          selectedFile.id === file.id
                        ) {
                          setSelectedFile(null);
                          return;
                        }
                        setSelectedFile(file);
                      }}
                    >
                      <p>{file.name}</p>
                    </div>
                  );
                }
              })}
            </div>
            {selectedFile && (
              <div style={styles.fileViewer}>
                {/* File viewer content */}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
const styles = {
  container: {
    backgroundColor: '#fff',
    color: '#000',
    display: 'flex',
    flexDirection: 'column',
  },
  fileContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  file: {
    backgroundColor: '#eee',
    padding: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    width: '100%',
  },
  fileViewer: {
    padding: '10px',
    margin: '10px',
    width: '30vw',
    height: '100vh',
    cursor: 'pointer',
    borderLeft: '1px solid #000',
  },
  controlTools: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '10px',
  },
  controlButton: {
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  uploadButton: {
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#eee',
  },
  // Search bar styles
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: '10px',
  },
  searchInput: {
    marginRight: '10px',
    padding: '5px',
    width: '200px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  searchButton: {
    padding: '8px 15px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  searchBar: {
    marginRight: '10px',
    padding: '5px 10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  controlTools: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '10px',
  },
};
