import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';

export default function CropperComponent({
  cropSrc,
  mustCrop,
  onFinishedCropSrc,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  let canvasRef = useRef();
  const [pixels, setPixels] = useState({});

  const drawImage = async (pixels) => {
    if (canvasRef.current instanceof HTMLCanvasElement) {
      let canvas = canvasRef.current;
      let ctx = canvasRef.current.getContext('2d');

      canvas.width = pixels.width;
      canvas.height = pixels.height;

      let blob = document.querySelector('.reactEasyCrop_Image').src;

      let response = await fetch(blob);

      console.log(response);

      var image = new Image();

      console.log(pixels);

      image.onload = function () {
        ctx.drawImage(
          image,
          0,
          0,
          pixels.width,
          pixels.height,
          pixels.x,
          pixels.y,
          pixels.width,
          pixels.height
        );

        let image64 = canvas.toDataURL('image/jpeg');

        onFinishedCropSrc(image64);
      };

      let blobImage = await response.blob();

      image.src = URL.createObjectURL(blobImage);
    }
  };

  const onCropComplete = useCallback(async (area, pixels) => {
    setPixels(pixels);
    if (canvasRef) drawImage(pixels);
  }, []);

  return (
    <>
      {mustCrop && (
        <Cropper
          image={cropSrc}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          classes={{ containerClassName: 'absolute w-screen h-screen z-20' }}
        />
      )}
      <canvas
        ref={(canvas) => {
          canvasRef.current = canvas;
        }}
        width={pixels.width}
        height={pixels.height}
        style={{ display: 'none' }}
      />
    </>
  );
}
