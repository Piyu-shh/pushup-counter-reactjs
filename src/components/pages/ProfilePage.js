// src/ProfilePage.js

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ProfilePage.css';
import { getUserProfile, setUserProfile } from '../getAndPost';

const ProfilePage = () => {
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState(new Date());
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(8);
  const [weight, setWeight] = useState(70);
  const [weightUnit, setWeightUnit] = useState('kg');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        if (profileData) {
          setGender(profileData.gender || 'Male');
          setDob(new Date(profileData.dob) || new Date());
          setHeightFeet(profileData.height_feet || 5);
          setHeightInches(profileData.height_inches || 8);
          setWeight(profileData.weight || 70);
          setWeightUnit(profileData.weight_unit || 'kg');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleGenderChange = (e) => setGender(e.target.value);
  const handleDobChange = (date) => setDob(date);
  const handleHeightFeetChange = (e) => setHeightFeet(parseInt(e.target.value, 10) || 0);
  const handleHeightInchesChange = (e) => setHeightInches(parseInt(e.target.value, 10) || 0);
  const handleWeightChange = (e) => setWeight(parseInt(e.target.value, 10) || 0);
  const handleWeightUnitChange = (e) => setWeightUnit(e.target.value);

  const calculateAge = (dob) => {
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const age = calculateAge(dob);

  const handleSave = async () => {
    const profileData = {
      gender,
      dob: dob.toISOString(),
      height_feet: heightFeet,
      height_inches: heightInches,
      weight,
      weight_unit: weightUnit,
    };

    try {
      const response = await setUserProfile(profileData);
      if (response) {
        console.log('Profile Data:', response);
      } else {
        console.error('Failed to set profile data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="profile-box">
        <h1 className="profile-heading">PROFILE</h1>
        <div className="form-row">
          <label className="label">Gender:</label>
          <select className="select" value={gender} onChange={handleGenderChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-row">
          <label className="label">DOB:</label>
          <DatePicker
            selected={dob}
            onChange={handleDobChange}
            maxDate={new Date()}
            className="date-picker"
          />
          <span className="age-display">Age: {age}</span>
        </div>
        <div className="form-row">
          <label className="label">Height:</label>
          <div className="height-container">
            <input
              className="height-input height-feet"
              type="number"
              value={heightFeet}
              onChange={handleHeightFeetChange}
              placeholder="Feet"
            />
            <label className="height-label height-feet-label">ft</label>
            <input
              className="height-input height-inches"
              type="number"
              value={heightInches}
              onChange={handleHeightInchesChange}
              placeholder="Inches"
            />
            <label className="height-label height-inches-label">in</label>
          </div>
        </div>
        <div className="form-row">
          <label className="label">Weight:</label>
          <div className="weight-container">
            <input
              className="weight-input"
              type="number"
              value={weight}
              onChange={handleWeightChange}
            />
            <select className="select" value={weightUnit} onChange={handleWeightUnitChange}>
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>
        <div className="form-row button-container">
          <button className="save-button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
