import React from 'react';
import CasualTaskCreator from '@/components/CasualTaskCreator';
import { useNavigate } from 'react-router-dom';

const AddMission = () => {
  const navigate = useNavigate();

  const handleCreateTask = (task) => {
    console.log('Mission created:', task);
    navigate('/'); // Redirect to the homepage or dashboard after creation
  };

  const handleCancel = () => {
    navigate('/'); // Redirect to the homepage or dashboard on cancel
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Mission</h1>
      <CasualTaskCreator onCreateTask={handleCreateTask} onCancel={handleCancel} />
    </div>
  );
};

export default AddMission;
