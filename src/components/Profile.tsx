import React, { useState } from "react";
import "./Profile.css";

interface ProfileProps {
  user: {
    displayName: string;
    email: string;
    photoURL: string;
  };
  onUpdateProfile: (updatedData: {
    displayName: string;
    email: string;
  }) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateProfile }) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdateProfile({ displayName, email });
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-photo-section">
        <img
          src={
            user.photoURL ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt="Profile"
          className="profile-photo"
        />
      </div>
      <div className="profile-info">
        {isEditing ? (
          <>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="profile-input"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="profile-input"
            />
            <button onClick={handleSave} className="save-button">
              Save
            </button>
          </>
        ) : (
          <>
            <h2>{displayName}</h2>
            <p>{email}</p>
            <button onClick={() => setIsEditing(true)} className="edit-button">
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
