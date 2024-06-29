import React, { useRef, useEffect, useState } from 'react';
import '../../App.css'
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { calculateAngle } from '../calculateAngle'; // Ensure this path is correct

const PushupTracker = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [counter, setCounter] = useState(0);
  const [stage, setStage] = useState('down');
  const [backAngle, setBackAngle] = useState('yes');

  useEffect(() => {
    const onResults = (results) => {
      if (!results.poseLandmarks) {
        return;
      }

      const image = results.image;
      const landmarks = results.poseLandmarks;

      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;

      const getCoordinates = (landmark) => [
        landmark.x * width,
        landmark.y * height
      ];

      const r1 = getCoordinates(landmarks[11]);
      const r2 = getCoordinates(landmarks[13]);
      const r3 = getCoordinates(landmarks[15]);
      const l1 = getCoordinates(landmarks[12]);
      const l2 = getCoordinates(landmarks[14]);
      const l3 = getCoordinates(landmarks[16]);
      const r4 = getCoordinates(landmarks[23]);
      const r5 = getCoordinates(landmarks[25]);
      const r6 = getCoordinates(landmarks[27]);
      const l4 = getCoordinates(landmarks[24]);
      const l5 = getCoordinates(landmarks[26]);
      const l6 = getCoordinates(landmarks[28]);
      const rpalm = getCoordinates(landmarks[17]);
      const lpalm = getCoordinates(landmarks[18]);

      const angleR = calculateAngle(r1, r2, r3);
      const angleL = calculateAngle(l1, l2, l3);
      const backAngleR = calculateAngle(r1, r4, r5);
      const backAngleL = calculateAngle(l1, l4, l5);
      const palmsDistance = Math.hypot(rpalm[0] - lpalm[0], rpalm[1] - lpalm[1]);
      const shoulderDiff = Math.abs(r1[1] - l1[1]);
      const hipDiff = Math.abs(r4[1] - l4[1]);
      const alignmentThreshold = 50;

      let hasError = false;
      setBackAngle('yes');
      let upperBodyColor = 'white';
      let lowerBodyColor = 'white';

      if (angleR <= 50 || angleL <= 50) {
        upperBodyColor = 'red';
      }
      if (backAngleR <= 120 || backAngleL <= 120) {
        lowerBodyColor = 'red';
        setBackAngle('no');
        hasError = true;
      }
      if (palmsDistance < 50) {
        upperBodyColor = 'red';
      }
      if (shoulderDiff > alignmentThreshold || hipDiff > alignmentThreshold) {
        upperBodyColor = 'red';
        lowerBodyColor = 'red';
      }

      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      drawLine(ctx, r1, r2, upperBodyColor);
      drawLine(ctx, r2, r3, upperBodyColor);
      drawLine(ctx, l1, l2, upperBodyColor);
      drawLine(ctx, l2, l3, upperBodyColor);
      drawLine(ctx, r1, l1, upperBodyColor);
      drawLine(ctx, r4, r5, lowerBodyColor);
      drawLine(ctx, r5, r6, lowerBodyColor);
      drawLine(ctx, l4, l5, lowerBodyColor);
      drawLine(ctx, l5, l6, lowerBodyColor);
      drawLine(ctx, r1, r4, lowerBodyColor);
      drawLine(ctx, l1, l4, lowerBodyColor);

      [r1, r2, r3, l1, l2, l3, r4, r5, r6, l4, l5, l6].forEach(joint => drawCircle(ctx, joint));

      if (!hasError) {
        if (angleL > 160 && angleR > 160) {
          if (stage === 'down') {
            setCounter(prevCounter => prevCounter + 0.5);
            setStage('up');
          }
        }
        if (angleL < 90 && angleR < 90) {
          if (stage === 'up') {
            setCounter(prevCounter => prevCounter + 0.5);
            setStage('down');
          }
        }
      }
    };

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults(onResults);

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current });
        },
        width: 640,
        height: 480
      });
      camera.start();
    }
  }, [counter, stage]);

  const drawLine = (ctx, start, end, color) => {
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();
  };

  const drawCircle = (ctx, joint) => {
    ctx.beginPath();
    ctx.arc(joint[0], joint[1], 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
  };

  return (
    <div>
      <h1>Push-up Counter: {counter}</h1>
      <h1>{backAngle}</h1>
      <video ref={videoRef} width="640" height="480" style={{ display: 'none' }} />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default PushupTracker;