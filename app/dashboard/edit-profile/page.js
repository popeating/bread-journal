'use client';
import { useState, useEffect } from 'react';
import { auth, storage, db } from '../../firebase/config';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import {
  isDisplayNameAvailable,
  updateUserProfile,
} from '../../firebase/database';
import Image from 'next/image';

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setDisplayName(data.displayName || '');
          setDescription(data.description || '');
          setAvatarPreview(data.photoURL || null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        await fetchUserData(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      let photoURL = userData?.photoURL || null;

      // Upload new avatar if selected
      if (avatarFile) {
        const avatarRef = ref(
          storage,
          `avatars/${user.uid}/${avatarFile.name}`
        );
        await uploadBytes(avatarRef, avatarFile);
        photoURL = await getDownloadURL(avatarRef);
      }

      // Check if display name is available (if changed)
      if (displayName !== userData?.displayName) {
        const isAvailable = await isDisplayNameAvailable(displayName);
        if (!isAvailable) {
          setError('This display name is already taken.');
          setSaving(false);
          return;
        }
      }

      // Update auth profile
      await updateProfile(user, {
        displayName,
        photoURL,
      });

      // Update Firestore document
      await updateUserProfile(user.uid, {
        displayName,
        photoURL,
        description,
      });

      setSuccess('Profile updated successfully!');
      // Update local user data
      setUserData((prev) => ({ ...prev, displayName, photoURL, description }));
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-base-200">
        <div className="animate-pulse">
          <div className="h-8 bg-base-300 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-base-300 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-200">
      <h1 className="text-3xl font-bold text-base-content mb-6">
        Edit Profile
      </h1>

      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success mb-4">
                <span>{success}</span>
              </div>
            )}

            <div className="flex flex-col items-center mb-6">
              <div className="avatar mb-4">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Profile preview"
                      width={96}
                      height={96}
                      className="rounded-full"
                      priority
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center">
                      <UserCircleIcon className="w-16 h-16 text-base-content/70" />
                    </div>
                  )}
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="file-input file-input-bordered w-full max-w-xs"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Display Name</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input input-bordered"
                placeholder="Your display name"
                required
              />
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">About Me</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered h-24"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="form-control">
              <button
                type="submit"
                className={`btn btn-primary ${saving ? 'loading' : ''}`}
                disabled={saving}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
