import React, { useEffect, useState } from 'react';
import { fetchSessionData } from '../api'; // Adjust the import path as needed
import './SessionHistoryPage.css'; // Import CSS for styling

const SessionHistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSessionData = async () => {
      try {
        const data = await fetchSessionData();
        setSessions(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getSessionData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading session data.</div>;

  return (
    <div>
      <h1>Session History</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time Spent</th>
            <th>Counter</th>
            <th>Type</th>
            <th>Calories Burnt</th>

          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr key={index}>
              <td>{session.date}</td>
              <td>{session.timeSpent}</td>
              <td>{session.noofpushupsdone}</td>
              <td>{session.type}</td>
              <td>{session.caloriesBurnt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionHistoryPage;
