/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useRef } from 'react';
import { database } from '../../state/database';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { SkynetClient } from 'skynet-js';
import CropperComponent from '../../hooks/cropper';

export default function UserProfilePage() {
  let [cropSrc, setCropSrc] = useState('');
  let [mustCrop, setMustCrop] = useState(false);

  let [name, setName] = useState('');
  let [isEditingName, setIsEditingName] = useState(false);

  let [about, setAbout] = useState('');
  let [isEditingAbout, setIsEditingAbout] = useState(false);

  let [image, setImage] = useState('');
  let [isEditingImage, setIsEditingImage] = useState(false);
  let imageFileRef = useRef();

  let [uploadProgress, setUploadProgress] = useState(0);
  let [isProcessing, setIsProcessing] = useState(false);

  let [croppedImage, setCroppedImage] = useState();

  useEffect(() => {
    database.user().on((data, key) => {
      setName(data.userName);
      setAbout(data.userAbout);
      setImage(data.image);
    });

    return () => {};
  }, []);
  let onUploadProgress = (progress, { loaded, total }) => {
    console.log(progress * 100);

    if (progress * 100 === 100) {
      setIsProcessing(true);
      setUploadProgress(0);
    } else {
      setUploadProgress(progress * 100);
    }
  };

  let changeName = () => {
    database.user().get('userName').put(name);
  };

  let changeAbout = () => {
    database.user().get('userAbout').put(about);
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  let changeImage = async () => {
    let client = new SkynetClient('https://siasky.net/', {
      onUploadProgress,
    });

    var file = dataURLtoFile(croppedImage, 'profileImage.jpeg');

    client
      .uploadFile(file)
      .then(async (skylink) => {
        if (skylink) {
          setIsEditingImage(false);

          console.log('Upload successful - ' + skylink);

          const url = await client.getSkylinkUrl(skylink.split(':')[1]);

          if (url) {
            setIsProcessing(false);

            database.user().get('image').put(url);

            setImage(url);
          }
        }
      })
      .catch(console.log);
  };

  return (
    <>
      <CropperComponent
        cropSrc={cropSrc}
        mustCrop={mustCrop}
        onFinishedCropSrc={(src) => setCroppedImage(src)}
      />
      {mustCrop && (
        <div className="absolute w-full h-auto bottom-0 left-0 z-30">
          <div className="flex justify-between items-center shadow rounded-t-lg p-3 bg-gray-800">
            <div
              className="flex justify-center items-center px-6 py-2 rounded-md bg-blue-600 cursor-pointer"
              onClick={() => {
                setMustCrop(false);
              }}
            >
              Cancel
            </div>
            <div
              className="flex justify-center items-center px-6 py-2 rounded-md bg-blue-600 cursor-pointer"
              onClick={() => {
                setMustCrop(false);
                changeImage();
              }}
            >
              Continue
            </div>
          </div>
        </div>
      )}
      <div
        className="flex flex-none justify-center items-center w-60 h-60 bg-black rounded-full p-1"
        onMouseOver={() =>
          !isProcessing && uploadProgress === 0 && setIsEditingImage(true)
        }
        onMouseLeave={() =>
          !isProcessing && uploadProgress === 0 && setIsEditingImage(false)
        }
        onClick={() => {
          imageFileRef.current.click();
        }}
      >
        {isEditingImage && (
          <div className="absolute z-10 flex flex-col justify-center items-center w-60 h-60 transparent-black rounded-full space-y-2 cursor-pointer">
            <div className="text-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="flex flex-col items-center space-y-0">
              <p className="uppercase text-sm">Change</p>
              <p className="uppercase text-sm">Profile Image</p>
            </div>
          </div>
        )}

        {!isProcessing && uploadProgress > 0 && (
          <div className="absolute z-20 w-60 h-60 transparent-black rounded-full space-y-2 cursor-pointer">
            <CircularProgressbar
              value={uploadProgress}
              strokeWidth={1}
              className="w-full h-full"
              styles={buildStyles({
                pathColor: '#2563EB',
                trailColor: 'rgba(0,0,0,0)',
              })}
            />
          </div>
        )}

        {isProcessing && (
          <div className="absolute z-20 flex flex-col justify-center items-center w-60 h-60 transparent-black rounded-full space-y-2 cursor-pointer">
            Processing
          </div>
        )}

        <img
          className="object-cover relative rounded-full w-full h-full "
          src={
            image ||
            'https://skyportal.xyz/BADvbV9BumlWmiKc1EOxgNOj-zaRr-_TOlzBw1HQzq6Zdg'
          }
          alt=""
        />
        <input
          ref={imageFileRef}
          type="file"
          className="hidden"
          onChange={() => {
            if (imageFileRef.current.files.length > 0) {
              setMustCrop(true);

              console.log(imageFileRef.current.files);

              setCropSrc(URL.createObjectURL(imageFileRef.current.files[0]));
            }
            setIsEditingImage(false);
          }}
        />
      </div>
      <div className="flex flex-col w-72 space-y-2 h-auto shadow p-3">
        <div className="text-blue-600">Your Name</div>
        <div className="flex items-center w-full">
          <input
            className="py-1 bg-gray-800 w-full focus:outline-none disabled"
            placeholder="Type your name."
            disabled={!isEditingName}
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
          <div
            className="flex justify-center items-center w-10 h-10 text-gray-400 hover:text-blue-600 cursor-pointer"
            onClick={() => {
              setIsEditingName(!isEditingName);

              if (isEditingName) changeName();
            }}
          >
            {isEditingName ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            )}
          </div>
        </div>
        <div className="text-gray-400 text-xs">
          This is not your username, this name will be visible to your friends.
        </div>
      </div>
      <div className="flex flex-col w-72 space-y-2 h-auto shadow p-3">
        <div className="text-blue-600">Your About</div>
        <div className="flex items-center w-full">
          <input
            className="py-1 bg-gray-800 w-full focus:outline-none disabled"
            placeholder="Type your about."
            disabled={!isEditingAbout}
            value={about}
            onChange={({ target: { value } }) => setAbout(value)}
          />
          <div
            className="flex justify-center items-center w-10 h-10 text-gray-400 hover:text-blue-600 cursor-pointer"
            onClick={() => {
              setIsEditingAbout(!isEditingAbout);

              if (isEditingAbout) changeAbout();
            }}
          >
            {isEditingAbout ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
