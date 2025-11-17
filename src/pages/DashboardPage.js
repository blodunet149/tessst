import React from 'react';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Welcome, {user?.name}!</h5>
          <p className="card-text">This is your dashboard. Here you can see your activity and manage your account.</p>
          
          <div className="row">
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Profile</h5>
                  <p className="card-text">Manage your profile information</p>
                  <a href="/profile" className="btn btn-primary">Go to Profile</a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Settings</h5>
                  <p className="card-text">Adjust your account settings</p>
                  <a href="#" className="btn btn-primary">Settings</a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Activity</h5>
                  <p className="card-text">View your recent activity</p>
                  <a href="#" className="btn btn-primary">View Activity</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;