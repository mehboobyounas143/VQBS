import React, { useState } from 'react';
import { toast } from 'react-toastify';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      toast.error('Please enter your feedback.');
      return;
    }

    const student = JSON.parse(localStorage.getItem('student'));

    if (!student || !student._id) {
      toast.error('You must be logged in to submit feedback.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: feedback,
          userId: student._id,
          name: student.name,
          email: student.email,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit feedback.');
      }

      setFeedback('');
      toast.success('Thank you for your feedback!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">We value your feedback</h2>

      <textarea
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        rows="5"
        placeholder="Write your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        disabled={submitting}
        required
      />

      <button
        type="submit"
        className={`mt-4 w-full py-3 text-white font-semibold rounded bg-green-600 hover:bg-green-700 transition ${
          submitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;
