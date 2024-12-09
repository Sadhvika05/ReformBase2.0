import React, { useState, useEffect,useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from '../api/axios';
import './TableUpload.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ProfileModal from '../components/ProfileModal';

const TableUpload = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [tables, setTables] = useState([]);
  const [currentTableId, setCurrentTableId] = useState(null); // ID of the table being edited or viewed
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [isViewing, setIsViewing] = useState(false); // State to toggle viewing mode
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const fileInputRef = useRef(null);
  const { groupname } = useParams();
  const [rows, setRows] = useState(""); // Default number of rows
  const [columns, setColumns] = useState(""); // Default number of columns
  const [showTable, setShowTable] = useState(false);
  const [tablesData, setTablesData] = useState([]); // State to hold table data
  const [tableName, setTableName] = useState(""); // Name for the table
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingTable, setViewingTable] = useState(null);
  const [lastRowDataByTable, setLastRowDataByTable] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupTableName, setPopupTableName] = useState(null);
  const { name } = useParams();
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  // Modal component, defined inside the same file
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // If modal is not open, don't render anything

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          {/* Close button to revert back */}
          <button className="modal-close"onClick={onClose}>Close</button>
          {children}
        </div>
      </div>
    );
  };

  const handleViewTable = (table) => {
    setViewingTable(table);
    viewTable(table); // Original view function logic
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(`/${encodeURIComponent(name)}/${encodeURIComponent(groupname)}/tables`);
        setTables(response.data);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };
    fetchTables();
  }, [groupname]);

  useEffect(() => {
    console.log("Current Table Data:", tableData); // Log current table data
}, [tableData]);

  

  const handleImportClick = () => {
    
    fileInputRef.current.click();
  };

  const exportToCSV = (data, filename) => {
    // Convert the data array to a CSV string
    const csvContent = data.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to handle row input change
  const handleRowChange = (e) => {
    setRows(parseInt(e.target.value)); // Convert to integer
  };

  // Function to handle column input change
  const handleColumnChange = (e) => {
    setColumns(parseInt(e.target.value)); // Convert to integer
  };

  const handleShowPopup = (tableName) => {
    setPopupTableName(tableName);
    setIsPopupVisible(true);
  };

  // Function to close the pop-up
  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setPopupTableName(null);
  };

  const handleAddRow = () => {
    if (isEditing) {
      const newRow = Array(tableData[0]?.length).fill(''); // Create a new row with empty cells
      setTableData([...tableData, newRow]); // Update the table data with the new row
    }
  };

  const handleAddColumn = () => {
    if (isEditing) {
      const updatedData = tableData.map(row => [...row, '']); // Add an empty cell to each row
      setTableData(updatedData); // Update the table data with the new column
    }
  };

  const handleInputChange = (rowIndex, colIndex, value) => {
    const newData = [...tablesData];
    newData[rowIndex][colIndex] = value;
    setTablesData(newData);
  };

  const createTable = () => {
    if(!isViewing && !isEditing){
    const initialData = Array.from({ length: rows }, () => Array(columns).fill(''));
    setTablesData(initialData);
    setShowTable(true);
    }
  };

  const handleCloseTable = () => {
    setShowTable(false);
    setRows(0);
    setColumns(0);
  };

  const saveTables = async () => {
    try {
    const tableContent = { name: tableName, data: tablesData };

    await axios.post(`/${encodeURIComponent(name)}/${encodeURIComponent(groupname)}/tables/save-table`, tableContent);

      alert('Table saved successfully!');
    } catch (error) {
      console.error('Error saving table:', error);
      alert('Failed to save the table');
    }
    const response = await axios.post(`${name}/${groupname}/tables`, {
      name: tableName,
      data: tablesData,
    });
    setTables([...tables, response.data]);
    setIsEditing(false);
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
      let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Remove empty rows
      jsonData = jsonData.filter(row => row.some(cell => cell !== null && cell !== ""));
  
      // Remove empty columns
      const nonEmptyColumnIndices = [];
      jsonData.forEach(row => {
        row.forEach((cell, idx) => {
          if (cell !== null && cell !== "") {
            if (!nonEmptyColumnIndices.includes(idx)) {
              nonEmptyColumnIndices.push(idx);
            }
          }
        });
      });
  
      // Keep only non-empty columns
      jsonData = jsonData.map(row => nonEmptyColumnIndices.map(idx => row[idx]));
  
      if (jsonData.length === 0) {
        console.warn('No valid data found in the file.');
        return;
      }
  
      // Check the last row for specific condition (only data in the first column)
      const lastRowIndex = jsonData.length - 1;
      const lastRow = jsonData[lastRowIndex];
  
      let lastRowData = null; // To store removed last row data
  
      if (lastRow && lastRow[0] && lastRow.slice(1).every(cell => !cell)) {
        // Store data from the first column in lastRowData and remove the last row
        lastRowData = lastRow[0];
        jsonData.pop(); // Remove the last row from the table data
      }
  
      // Update the table-specific last row data
      setLastRowDataByTable(prev => ({
        ...prev,
        [file.name]: lastRowData  // Use file name or another unique identifier for the table
      }));
  
      // Set table data and update states
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
        const response = await axios.put(`/${encodeURIComponent(name)}/${encodeURIComponent(groupname)}/tables/${currentTableId}`, {
          name: fileName,
          data: tableData,
        });
        setTables(tables.map((table) => (table._id === currentTableId ? response.data : table)));
      } else {
        // If not editing, create a new table
        const response = await axios.post(`${name}/${groupname}/tables`, {
          name: fileName,
          data: tableData,
        });
        setTables([...tables, response.data]);
      }
      setIsEditing(false); // Exit editing mode
      setIsViewing(false); // Stay in viewing mode after saving
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
      await axios.delete(`/${encodeURIComponent(name)}/${encodeURIComponent(groupname)}/tables/${id}`);
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredTableList = filteredTables.filter(table => table.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'white',
        padding: '17rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        overflow:'hidden'}}>
        <div className>
          <div className="input" >
            <svg
              style={{position:'fixed',marginRight:'-5px',marginTop:'-100px'}}
              onClick={() => navigate(`/${encodeURIComponent(name)}/data-tables`)}
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
            <h1 className="text-xl font-semibold text-gray-800"></h1>
          </div>
          <div className="flex items-center space-x-4">
            <svg
            style={{position:'fixed',marginLeft:'1200px',marginTop:'-190px'}}
            onClick={() => navigate('/')}
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
              onClick={() => setIsModalOpen(true)}
              style={{position:'fixed',marginLeft:'1250px',marginTop:'-190px'}}
            >
              My Profile
            </button>
            <ProfileModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
          </div>
        </div>
        
        <div >
          <h2 className="text-3xl font-bold ml-4 text-gray-800" style={{position:'fixed',marginTop:'-110px',marginLeft:'570px'}}>{groupname}</h2>
        </div>
        <div style={{backgroundColor: '#fff',marginLeft:'1100px',marginTop:'-10px',position:'fixed'}}>
          <label>Rows: </label>
          <input
            type="number"
            value={rows}
            onChange={handleRowChange}
            min="1"
            style={{ padding: '1px',fontSize: '14px',width: '45px', border: '1px solid black',textAlign:'center', marginLeft:'2px'}}
          />
        </div>
        <div style={{backgroundColor: '#fff',position:'fixed',marginTop:'-10px',marginLeft:'1200px'}}>
          <label>Columns: </label>
          <input
            type="number"
            value={columns}
            onChange={handleColumnChange}
            min="1"
            style={{ padding: '1px',fontSize: '14px',width: '45px', border: '1px solid black',marginLeft:'2px',textAlign:'center'}}
          />
        </div>      
    <div className="table-upload-container">
      <div className="control-panel">
      <button onClick={() => handleImportClick()} style={{position:'fixed',marginLeft:'1090px',marginTop:'-45px', cursor: 'pointer'}}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.29289 9.70711L11.2929 14.7071L12 15.4142L12.7071 14.7071L17.7071 9.70711L16.2929 8.29289L13 11.5858V4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H11L11 11.5858L7.70711 8.29289L6.29289 9.70711Z" fill="#222222"/>
</svg>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
        <button className="button" onClick={enterEditMode} disabled={isEditing || !isViewing} style={{position:'fixed',marginLeft:'1127px',marginTop:'-47px', cursor: 'pointer'}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.204 10.796L19 9C19.5453 8.45475 19.8179 8.18213 19.9636 7.88803C20.2409 7.32848 20.2409 6.67152 19.9636 6.11197C19.8179 5.81788 19.5453 5.54525 19 5C18.4548 4.45475 18.1821 4.18213 17.888 4.03639C17.3285 3.75911 16.6715 3.75911 16.112 4.03639C15.8179 4.18213 15.5453 4.45475 15 5L13.1814 6.81866C14.1452 8.46926 15.5314 9.84482 17.204 10.796ZM11.7269 8.27311L4.8564 15.1436C4.43134 15.5687 4.21881 15.7812 4.07907 16.0423C3.93934 16.3034 3.88039 16.5981 3.7625 17.1876L3.1471 20.2646C3.08058 20.5972 3.04732 20.7635 3.14193 20.8581C3.23654 20.9527 3.40284 20.9194 3.73545 20.8529L6.81243 20.2375C7.40189 20.1196 7.69661 20.0607 7.95771 19.9209C8.21881 19.7812 8.43134 19.5687 8.8564 19.1436L15.7458 12.2542C14.1241 11.2386 12.7524 9.87627 11.7269 8.27311Z" fill="#222222"/>
</svg>
        </button>
        <button className="button" onClick={saveTable} disabled={!isViewing} style={{position:'fixed',marginLeft:'1240px',marginTop:'-47px', cursor: 'pointer'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.8 8H3V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.0799 20 6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V11.2C21 10.0799 21 9.51984 20.782 9.09202C20.5903 8.71569 20.2843 8.40973 19.908 8.21799C19.4802 8 18.9201 8 17.8 8ZM14.7929 10.2929L10.5 14.5858L8.70711 12.7929L7.29289 14.2071L9.79289 16.7071L10.5 17.4142L11.2071 16.7071L16.2071 11.7071L14.7929 10.2929Z" fill="#222222"/>
<path d="M3 8C3 7.06812 3 6.60218 3.15224 6.23463C3.35523 5.74458 3.74458 5.35523 4.23463 5.15224C4.60218 5 5.06812 5 6 5H8.34315C9.16065 5 9.5694 5 9.93694 5.15224C10.3045 5.30448 10.5935 5.59351 11.1716 6.17157L13 8H3Z" fill="#222222"/>
</svg>

</button>

<button className="button" onClick={createTable} 
style={{position:'fixed',border:'none',backgroundColor:'#fff',marginLeft:'1200px',marginTop:'-47px'}}>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7 3C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V7C21 4.79086 19.2091 3 17 3H7ZM11 7V11L7 11V13H11V17H13V13H17V11H13V7H11Z" fill="#222222"/>
</svg>

        </button>
        <button className="button" onClick={closeTableView} style={{position:'fixed',marginLeft:'1160px',marginTop:'-47px',border:'none',backgroundColor:'#fff'}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM6.58579 16L7.29289 15.2929L10.5858 12L7.29289 8.70711L6.58579 8L8 6.58579L8.70711 7.29289L12 10.5858L15.2929 7.29289L16 6.58579L17.4142 8L16.7071 8.70711L13.4142 12L16.7071 15.2929L17.4142 16L16 17.4142L15.2929 16.7071L12 13.4142L8.70711 16.7071L8 17.4142L6.58579 16Z" fill="#222222"/>
</svg>
        </button>
        <button onClick={() => exportToCSV(tableData, tableName)} style={{position:'fixed',marginLeft:'1280px',marginTop:'-47px',border:'none',backgroundColor:'#fff'}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 10L12 5M12 5L17 10M12 5L12 11.5" stroke="#222222" stroke-width="2"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M11 13V16.5C11 17.0523 11.4477 17.5 12 17.5C12.5523 17.5 13 17.0523 13 16.5V13H18C19.1046 13 20 13.8954 20 15V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V15C4 13.8954 4.89543 13 6 13H11Z" fill="#222222"/>
          </svg>
          </button>
        </div>
    </div>
    
    {showTable && (
  <div style={{marginTop: '50px',position:'fixed',marginLeft:'170px'}}>
    <input
  type="text"
  value={tableName}
  onChange={(e) => setTableName(e.target.value)} // Capture the name input
  placeholder="Enter table name"
  style={{marginTop:'-60px',position:'fixed',marginLeft:'430px',font:'20px',border: '1px solid black',textAlign:'center'}}
/>
    <div style={{width: '1000px',height: '350px',overflow: 'auto',border: '1px solid black',padding: '2px',}}>
      <table border="1" style={{borderCollapse: 'collapse',width: '100%'}}>
        <tbody>
          {tablesData.map((rowData, rowIndex) => (
            <tr key={rowIndex}>
              {rowData.map((cellData, colIndex) => (
                <td key={colIndex} style={{textAlign: 'center'}}>
                  <input
                    type="text"
                    value={cellData}
                    onChange={(e) =>
                      handleInputChange(rowIndex, colIndex, e.target.value)
                    }
                    style={{width: '90%',padding: '7px',fontSize: '13px',border:'none'}}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <button onClick={saveTables} style={{ position:'relative', cursor: 'pointer',fontSize:'15px', left:'950px',bottom:'-3px' }}>Save</button>
    <button
            onClick={handleCloseTable}
             style={{ position:'relative', cursor: 'pointer',fontSize:'15px', left:'970px',bottom:'-3px' }}
          >
            Close
          </button>
  </div>
  
)}


      {isViewing && (
  <>
    <div className="table-container">
    
      <TableDisplay data={tableData} onCellChange={handleCellChange} isEditing={isEditing}  handleAddRow={handleAddRow}
        handleAddColumn={handleAddColumn} />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        
        <table>
          <thead>
            <tr>
              {tableData[0].map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((col, colIndex) => (
                  <td key={colIndex}>{col}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
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
<button
        style={{
          position: 'fixed',
          marginTop: '-50px',
          marginLeft: isPanelOpen ? '305px' : '-15px',
          visibility: 'visible !important',
          zIndex: 2000,
          width: '50px',
          height: '50px',
        }}
        
        onClick={togglePanel}
      >
        {isPanelOpen ? (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 7H19" stroke="#33363F" stroke-width="2" stroke-linecap="round"/>
<path d="M5 12H19" stroke="#33363F" stroke-width="2" stroke-linecap="round"/>
<path d="M5 17H19" stroke="#33363F" stroke-width="2" stroke-linecap="round"/>
</svg>

) : (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 7H19" stroke="#33363F" stroke-width="2" stroke-linecap="round"/>
  <path d="M5 12H19" stroke="#33363F" stroke-width="2" stroke-linecap="round"/>
  <path d="M5 17H19" stroke="#33363F" stroke-width="2" stroke-linecap="round"/>
  </svg>
  
  
  )}
      </button>
      <button onClick={() => setViewingTable(null)}></button>

      {/* Sliding panel */}
      <div
        style={{
          position: 'fixed',
          marginTop: '-55px',
          marginLeft: isPanelOpen ? '-12px' : '-320px',
          width: '312px',
          height: '100%',
          backgroundColor: '#f9f9f9',
          transition: 'left 0.3s ease',
          boxShadow: isPanelOpen ? '2px 0px 2px rgba(0,0,0,0.2)' : 'none',
          zIndex: '999',
          padding: '10px',
        }}
      >
        {/* Search bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search tables..."
          style={{
            width: '100%',
            padding: '5px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
          }}
        />
        {viewingTable && isViewing && currentTableId === viewingTable._id && (
                    <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="button" onClick={() => deleteTable(viewingTable._id)}>
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

                  <button className="button" onClick={closeTableView}>
                  {/* Close table view */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" fill="white" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM7.64645 16.3536C7.45118 16.1583 7.45118 15.8417 7.64645 15.6464L11.2929 12L7.64645 8.35355C7.45118 8.15829 7.45118 7.84171 7.64645 7.64645C7.84171 7.45118 8.15829 7.45118 8.35355 7.64645L12 11.2929L15.6464 7.64645C15.8417 7.45118 16.1583 7.45118 16.3536 7.64645C16.5488 7.84171 16.5488 8.15829 16.3536 8.35355L12.7071 12L15.6464 15.6464C16.5488 15.8417 16.5488 16.1583 16.3536 16.3536C16.1583 16.5488 15.8417 16.5488 15.6464 16.3536L12 12.7071L8.35355 16.3536C8.15829 16.5488 7.84171 16.5488 7.64645 16.3536Z" fill="#222222" />
                  </svg>
                </button>
                <button onClick={openModal} isViewing>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 20V21H21V20H20ZM15.7071 14.2929C15.3166 13.9024 14.6834 13.9024 14.2929 14.2929C13.9024 14.6834 13.9024 15.3166 14.2929 15.7071L15.7071 14.2929ZM19 14V20H21V14H19ZM20 19H14V21H20V19ZM20.7071 19.2929L15.7071 14.2929L14.2929 15.7071L19.2929 20.7071L20.7071 19.2929Z" fill="#33363F"/>
              <path d="M4 20H3V21H4V20ZM9.70711 15.7071C10.0976 15.3166 10.0976 14.6834 9.70711 14.2929C9.31658 13.9024 8.68342 13.9024 8.29289 14.2929L9.70711 15.7071ZM3 14V20H5V14H3ZM4 21H10V19H4V21ZM4.70711 20.7071L9.70711 15.7071L8.29289 14.2929L3.29289 19.2929L4.70711 20.7071Z" fill="#33363F"/>
              <path d="M20 4H21V3H20V4ZM14.2929 8.29289C13.9024 8.68342 13.9024 9.31658 14.2929 9.70711C14.6834 10.0976 15.3166 10.0976 15.7071 9.70711L14.2929 8.29289ZM21 10V4H19V10H21ZM20 3H14V5H20V3ZM19.2929 3.29289L14.2929 8.29289L15.7071 9.70711L20.7071 4.70711L19.2929 3.29289Z" fill="#33363F"/>
              <path d="M4 4V3H3V4H4ZM8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L8.29289 9.70711ZM5 10V4H3V10H5ZM4 5H10V3H4V5ZM3.29289 4.70711L8.29289 9.70711L9.70711 8.29289L4.70711 3.29289L3.29289 4.70711Z" fill="#33363F"/>
              </svg>
                    </button>
                    
        <button onClick={() => handleShowPopup(fileName)}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.58579 2.58579C3 3.17157 3 4.11438 3 6V16C3 18.8284 3 20.2426 3.87868 21.1213C4.51998 21.7626 5.44655 21.9359 7 21.9827V19C7 18.4477 7.44772 18 8 18C8.55228 18 9 18.4477 9 19L9 22H15V19C15 18.4477 15.4477 18 16 18C16.5523 18 17 18.4477 17 19L17 21.9827C18.5534 21.9359 19.48 21.7626 20.1213 21.1213C21 20.2426 21 18.8284 21 16V6C21 4.11438 21 3.17157 20.4142 2.58579C19.8284 2 18.8856 2 17 2H7C5.11438 2 4.17157 2 3.58579 2.58579ZM8 8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10H16C16.5523 10 17 9.55228 17 9C17 8.44772 16.5523 8 16 8H8ZM8 14L16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12L8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" fill="#222222"/>
        </svg></button>
        {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h3>Last Row Data for {popupTableName}</h3>
            <p>{lastRowDataByTable[popupTableName] || 'No data available'}</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}

                    </div>
                    </div>
                  )}

        {/* Saved tables list */}
        <div style={{
          maxHeight: '85vh',
          overflow: 'auto',
          border: '1px solid #ddd',
          padding: '5px',
          borderRadius: '5px',
          backgroundColor: '#fff',
        }}>
          {filteredTableList.length > 0 ? (
            filteredTableList.map((table) => (
              <div key={table._id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid black',
              }}>
                <span style={{ flex: '1' }}>{table.name}</span>
                <button onClick={() => handleViewTable(table)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="3" stroke="#33363F" strokeWidth="2" />
                      <path d="M20.188 10.9343C20.5762 11.4056 20.7703 11.6412 20.7703 12C20.7703 12.3588 20.5762 12.5944 20.188 13.0657C18.7679 14.7899 15.6357 18 12 18C8.36427 18 5.23206 14.7899 3.81197 13.0657C3.42381 12.5944 3.22973 12.3588 3.22973 12C3.22973 11.6412 3.42381 11.4056 3.81197 10.9343C5.23206 9.21014 8.36427 6 12 6C15.6357 6 18.7679 9.21014 20.188 10.9343Z" stroke="#33363F" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
            ))
          ) : (
            <p>No saved tables found.</p>
          )}
        </div>
      </div>
   </div>
   );
 };

const TableDisplay = ({ data, onCellChange, isEditing, handleAddRow, handleAddColumn}) => (
  <div>
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
  {isEditing && (
        <div>
          <button onClick={handleAddRow} style={{position:'relative',right:'-10px'}}>Add Row</button>
          <button onClick={handleAddColumn} style={{position:'relative',right:'-30px'}}>Add Column</button>
        </div>
      )}
  </div>
     
);

export default TableUpload;
