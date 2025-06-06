import React, { useRef, useState } from "react";
import './photoframe.css';

function Photframe() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraStarted(true);
          setCapturedImage(null); // Reset captured image when starting camera
        })
        .catch((err) => {
          console.error("Error accessing camera: ", err);
        });
    } else {
      alert("getUserMedia not supported in this browser.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      alert("Camera is not started");
      return;
    }

    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    const ctx = canvasRef.current.getContext("2d");

    const frameImg = new Image();
    frameImg.src = "/images/inde.jpg";
    frameImg.onload = () => {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      ctx.drawImage(frameImg, 0, 0, width, height);
      const dataURL = canvasRef.current.toDataURL("image/png");
      setCapturedImage(dataURL);
      setCameraStarted(false);

      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      videoRef.current.srcObject = null;
    };
  };

  const downloadPhoto = () => {
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = "YaticorpAI.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Capture Photo with Frame Overlay</h2>

      {/* Video or Captured Image with frame overlay */}
      <div className="frame">
        {capturedImage ? (
          <>
            <img src={capturedImage} alt="Captured" className="framevideo" />
            <img src="/images/inde.jpg" alt="frame" className="frameimg" draggable={false} />
          </>
        ) : (
          <>
            <video ref={videoRef} className="framevideo" autoPlay playsInline></video>
            <img src="/images/inde.jpg" alt="frame" className="frameimg" draggable={false} />
          </>
        )}
      </div>

      <br />

      {!capturedImage && (
        <>
          <button onClick={startCamera}>Start Camera</button>
          <button onClick={capturePhoto} style={{ marginLeft: "10px" }} disabled={!cameraStarted}>
            Capture Photo
          </button>
        </>
      )}

      {capturedImage && (
        <>
          <button onClick={downloadPhoto} style={{ marginTop: "10px", marginRight: "10px" }}>
            Download Photo
          </button>
          <button onClick={retakePhoto} style={{ marginTop: "10px" }}>
            Retake Photo
          </button>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

export default Photframe;
