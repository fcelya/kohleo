import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';

function Main() {
  const { entries, addEntry } = useAppContext();
  const navigate = useNavigate();

  const handleCreateNewEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      title: 'New Entry',
      date: new Date().toISOString().split('T')[0],
      content: ''
    };
    addEntry(newEntry);
    navigate(`/content/${newEntry.id}`);
  };

  return (
    <div className="container">
      <h1>My Journal</h1>
      <div className="card">
        <h2>Entries</h2>
        {entries.length === 0 ? (
          <p>No entries yet. Create your first entry!</p>
        ) : (
          <ul className="entry-list">
            {entries.map((entry) => (
              <li key={entry.id} className="entry-item">
                <Link to={`/content/${entry.id}`} className="entry-link">
                  <div className="entry-title">{entry.title}</div>
                  {entry.date && <div className="entry-date">{entry.date}</div>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={handleCreateNewEntry} className="btn btn-primary btn-floating">
        +
      </button>
    </div>
  );
}

export default Main;
