import React, { useState, useEffect,useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import './TableUpload.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const TableUpload = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [tables, setTables] = useState([]);
  const [currentTableId, setCurrentTableId] = useState(null); // ID of the table being edited or viewed
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [isViewing, setIsViewing] = useState(false); // State to toggle viewing mode
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tables');
        setTables(response.data);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };
    fetchTables();
  }, []);

  const handleImportClick = () => {
    
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      console.error('No file selected');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setTableData(jsonData);
      setIsViewing(true); // Automatically enter viewing mode after file import
      setIsEditing(false); // Ensure editing is off initially
      setCurrentTableId(null); // Clear current table ID on new file import
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsArrayBuffer(file);
  };

  const saveTable = async () => {
    try {
      if (currentTableId) {
        // If editing, update the table
        const response = await axios.put('http://localhost:5000/api/tables/${currentTableId}', {
          name: fileName,
          data: tableData,
        });
        setTables(tables.map((table) => (table._id === currentTableId ? response.data : table)));
      } else {
        // If not editing, create a new table
        const response = await axios.post('http://localhost:5000/api/tables', {
          name: fileName,
          data: tableData,
        });
        setTables([...tables, response.data]);
      }
      setIsEditing(false); // Exit editing mode
      setIsViewing(true); // Stay in viewing mode after saving
      resetForm(); // Reset form after saving
    } catch (error) {
      console.error('Error saving table:', error);
    }
  };

  const enterEditMode = () => {
    setIsEditing(true);
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][colIndex] = value;
    setTableData(updatedTableData);
  };

  const resetForm = () => {
    setTableData([]);
    setFileName('');
    setCurrentTableId(null);
  };

  const deleteTable = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tables/${id}`);
      setTables(tables.filter((table) => table._id !== id));
      if (currentTableId === id) {
        resetForm(); // Clear view if the deleted table was being viewed
        setIsViewing(false); // Exit viewing mode
      }
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  const viewTable = (table) => {
    setTableData(table.data);
    setFileName(table.name);
    setCurrentTableId(table._id);
    setIsViewing(true); // Enter viewing mode
    setIsEditing(false); // Ensure not in editing mode
  };

  const closeTableView = () => {
    resetForm();
    setIsViewing(false);
  };

  return (
    
      <div style={{
        width: '60%',
        height: '65vh',
        backgroundColor: 'white',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'hidden'}}>
        <div className>
          <div className="input" >
            <svg
              
              onClick={() => navigate('/health-care/data-tables')}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 cursor-pointer text-gray-700 hover:text-gray-900"
            >
              <path d="M12 19l-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            <h1 className="text-xl font-semibold text-gray-800" style={{position:'relative',left:'30px',top:'-28px'}}>Data Tables</h1>
          </div>
          <div className="flex items-center space-x-4">
            <svg
            style={{position:'relative',right:'-680px',top:'-55px'}}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-gray-700 hover:text-gray-900"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <button
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
              onClick={() => navigate('/profile')}
              style={{position:'relative',right:'-700px',top:'-55px'}}
            >
              My Profile
            </button>
          </div>
        </div>
        <div >
          <h2 className="text-3xl font-bold ml-4 text-gray-800" style={{textAlign:'center',position:'relative',top:'-50px'}}>Health Care</h2>
        </div>
    <div className="table-upload-container">
      <div className="control-panel">
      <button onClick={() => handleImportClick()} style={{position:'relative',right:'-400px',top:'-55px'}}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 40 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 hover:text-gray-700"
                    >
                      <path d="M28.7 17c-.34-.33-.8-.51-1.28-.51s-.94.18-1.28.51L21.33 21.68V4.16c0-.46-.28-.89-.7-1.23-.42-.34-.87-.53-1.35-.53-.48 0-.93.19-1.35.53-.42.34-.7.77-.7 1.23v17.52l-5.8-4.68c-.34-.33-.8-.51-1.28-.51-.48 0-.94.18-1.28.51-.34.33-.52.78-.52 1.27.01.49.17.95.49 1.33l7.92 7.67 1.29 1.29 1.29-1.29 7.91-7.67c.33-.33.51-.78.51-1.27s-.17-.94-.51-1.27zM6.09 23.16c0-.23-.05-.46-.14-.67-.09-.21-.23-.41-.39-.58-.16-.17-.35-.31-.56-.41-.21-.1-.45-.16-.7-.16-.25 0-.49.05-.7.16-.21.1-.4.24-.56.41-.16.17-.3.37-.39.58-.09.21-.14.44-.14.67v7.72c0 1.26.45 2.45 1.28 3.35.84.89 2.08 1.38 3.33 1.38h24.4c1.26 0 2.49-.49 3.33-1.38.84-.89 1.28-2.09 1.28-3.35v-7.72c0-.23-.05-.46-.14-.67-.09-.21-.23-.41-.39-.58-.16-.17-.35-.31-.56-.41-.21-.1-.45-.16-.7-.16-.25 0-.49.05-.7.16-.21.1-.4.24-.56.41-.16.17-.3.37-.39.58-.09.21-.14.44-.14.67v7.72c0 .24-.07.48-.2.68-.13.2-.31.35-.55.45-.23.1-.48.16-.75.16H7.31c-.27 0-.52-.06-.75-.16-.23-.1-.42-.25-.55-.45-.13-.2-.2-.44-.2-.68v-7.72z" fill="black"/>
                    </svg>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
        <button className="button" onClick={enterEditMode} disabled={isEditing || !isViewing}>
        <svg
                      style={{position:'relative',right:'-350px',top:'-55px'}}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 hover:text-gray-700"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5l4 4L7 21l-4.5 1.5L5 17z"></path>
                    </svg>
                    

        </button>
        <button className="button" onClick={saveTable} disabled={!isViewing}>
          
          <svg 
          style={{position:'relative',right:'-390px',top:'-55px'}}
          width="24" 
          height="26" 
          viewBox="0 0 23 19" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg">
<path d="M14.5 18.5004H5.9C5.05992 18.5004 4.63988 18.5004 4.31901 18.3369C4.03677 18.1931 3.8073 17.9636 3.66349 17.6814C3.5 17.3605 3.5 16.9405 3.5 16.1004V6.9C3.5 6.05992 3.5 5.63988 3.66349 5.31901C3.8073 5.03677 4.03677 4.8073 4.31901 4.66349C4.63988 4.5 5.05992 4.5 5.9 4.5H8.47237C8.84808 4.5 9.03594 4.5 9.20646 4.55179C9.35741 4.59763 9.49785 4.6728 9.61972 4.77298C9.75739 4.88614 9.86159 5.04245 10.07 5.35507L10.93 6.64533C11.1384 6.95795 11.2426 7.11426 11.3803 7.22742C11.5022 7.3276 11.6426 7.40277 11.7935 7.44861C11.9641 7.5004 12.1519 7.5004 12.5276 7.5004H16.1C16.9401 7.5004 17.3601 7.5004 17.681 7.66389C17.9632 7.8077 18.1927 8.03717 18.3365 8.31942C18.5 8.64028 18.5 9.06032 18.5 9.9004V10.5" stroke="#2A4157" stroke-opacity="0.24" stroke-linecap="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.45298 11.6411L5.45298 11.6411L3.70199 16.894C3.46498 17.605 3.34648 17.9605 3.41754 18.2435C3.47974 18.4912 3.63435 18.7057 3.84968 18.8431C4.09567 19 4.4704 19 5.21988 19H16.2702C16.8922 19 17.2032 19 17.4679 18.8959C17.7016 18.804 17.9084 18.6549 18.0695 18.4622C18.252 18.2441 18.3503 17.949 18.547 17.3589L19.947 13.1589C20.3025 12.0924 20.4803 11.5592 20.3737 11.1347C20.2804 10.7631 20.0485 10.4414 19.7255 10.2353C19.3565 10 18.7944 10 17.6702 10H7.72982C7.10779 10 6.79677 10 6.53213 10.1041C6.29844 10.196 6.09156 10.3451 5.93047 10.5377C5.74804 10.7559 5.64969 11.0509 5.45298 11.6411ZM8.5 14C8.22386 14 8 14.2239 8 14.5C8 14.7761 8.22386 15 8.5 15H15.5C15.7761 15 16 14.7761 16 14.5C16 14.2239 15.7761 14 15.5 14H8.5Z" fill="#222222"/>
</svg>
        </button>
      </div>
</div>
      {isViewing && (
  <>
    <div className="table-container">
      <TableDisplay data={tableData} onCellChange={handleCellChange} isEditing={isEditing} />
    </div>
    <div className="actions-panel">
      <div className="edit-save-buttons">
        {isEditing ? (
          <button className="button" onClick={saveTable}>
          </button>
        ) : (
          <button className="button" onClick={enterEditMode}>
          </button>
        )}
      </div>
    </div>
  </>
)}
{tables.length > 0 && (
  <div style={{
    marginTop: '20px',
    width: '100%',
  }}>
    <h2 style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    }}>
      Saved Tables
    </h2>
    <div style={{
      maxHeight: '70px',
      overflow: 'auto',
      border: '1px solid #ddd',
      padding: '10px',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
    }}>
      {tables.map((table) => (
        <div key={table._id} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 0',
          borderBottom: '1px solid #eee',
        }}>
          <span style={{ flex: '1' }}>{table.name}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="button" onClick={() => viewTable(table)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="#33363F" strokeWidth="2"/>
                <path d="M20.188 10.9343C20.5762 11.4056 20.7703 11.6412 20.7703 12C20.7703 12.3588 20.5762 12.5944 20.188 13.0657C18.7679 14.7899 15.6357 18 12 18C8.36427 18 5.23206 14.7899 3.81197 13.0657C3.42381 12.5944 3.22973 12.3588 3.22973 12C3.22973 11.6412 3.42381 11.4056 3.81197 10.9343C5.23206 9.21014 8.36427 6 12 6C15.6357 6 18.7679 9.21014 20.188 10.9343Z" stroke="#33363F" strokeWidth="2"/>
              </svg>
            </button>
            <button className="button" onClick={() => deleteTable(table._id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 hover:text-gray-700"
              >
                <path d="M3 6h18"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
              </svg>
            </button>
            {isViewing && currentTableId === table._id && (
              <button className="button" onClick={closeTableView}>
                <svg 
                width="24"
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM7.64645 16.3536C7.45118 16.1583 7.45118 15.8417 7.64645 15.6464L11.2929 12L7.64645 8.35355C7.45118 8.15829 7.45118 7.84171 7.64645 7.64645C7.84171 7.45118 8.15829 7.45118 8.35355 7.64645L12 11.2929L15.6464 7.64645C15.8417 7.45118 16.1583 7.45118 16.3536 7.64645C16.5488 7.84171 16.5488 8.15829 16.3536 8.35355L12.7071 12L16.3536 15.6464C16.5488 15.8417 16.5488 16.1583 16.3536 16.3536C16.1583 16.5488 15.8417 16.5488 15.6464 16.3536L12 12.7071L8.35355 16.3536C8.15829 16.5488 7.84171 16.5488 7.64645 16.3536Z" fill="#222222"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

  </div>
  );
};

const TableDisplay = ({ data, onCellChange, isEditing }) => (
  <table>
    <thead>
      <tr>
        {data[0] && data[0].map((key, index) => <th key={index}>{key}</th>)}
      </tr>
    </thead>
    <tbody>
      {data.slice(1).map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((value, colIndex) => (
            <td key={colIndex}>
              {isEditing ? (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onCellChange(rowIndex + 1, colIndex, e.target.value)}
                />
              ) : (
                <span>{value}</span>
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default TableUpload;