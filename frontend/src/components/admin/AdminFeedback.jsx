import React, { useEffect, useState } from 'react';

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/feedback`);
        if (!res.ok) throw new Error('Failed to fetch feedbacks');
        const data = await res.json();
        setFeedbacks(data.feedbacks || []);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setError('Could not load feedbacks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">User Feedbacks</h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && feedbacks.length === 0 && (
        <p className="text-gray-500">No feedbacks submitted yet.</p>
      )}

      {!loading && !error && feedbacks.length > 0 && (
        <div className="space-y-4">
          {feedbacks.map((fb) => {
            const user = fb.userId;
            return (
              <div key={fb._id} className="bg-white shadow border-l-4 border-green-500 rounded-md p-4">
                <p className="text-gray-800">{fb.message}</p>
                <p className="text-sm text-gray-600 mt-2">
                  From: {user && user.email ? user.email : 'Unknown User (No email)'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Submitted: {fb.submittedAt ? new Date(fb.submittedAt).toLocaleString() : 'Unknown date'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminFeedbacks;
