import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

const PushupTracker = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [feedback, setFeedback] = useState('');
    const [count, setCount] = useState(0);
    const [landmarks, setLandmarks] = useState([]);
    const [imageHex, setImageHex] = useState('');
    const [clr, setClr] = useState('white');

    // Function to convert dataURL to File
    const dataURLtoFile = (dataurl, filename) => {
        if (!dataurl) {
            throw new Error('Data URL is null or undefined');
        }

        const [header, data] = dataurl.split(',');
        if (!header || !data) {
            throw new Error('Data URL format is invalid');
        }

        const mime = header.match(/:(.*?);/)[1];
        const bstr = atob(data);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    // Function to draw landmarks and connections
    const drawLandmarks = (imageHex) => {
        if (canvasRef.current && landmarks.length > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.src = `data:image/jpeg;base64,${imageHex}`;
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                console.log("Landmarks:", landmarks);  // Debugging: log landmarks

                const joints = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];

                // Draw landmarks
                joints.forEach((joint) => {
                    if (landmarks[joint]) {
                        const x = landmarks[joint].x * canvas.width;
                        const y = landmarks[joint].y * canvas.height;
                        console.log(`Drawing joint ${joint} at (${x}, ${y})`);  // Debugging: log coordinates
                        ctx.beginPath();
                        ctx.arc(x, y, 10, 0, 2 * Math.PI);
                        ctx.fillStyle = 'white';  // Set landmark color
                        ctx.fill();
                    } else {
                        console.warn(`Landmark ${joint} is not available`);
                    }
                });

                // Draw connections
                const connections = [
                    [11, 13], [13, 15], [12, 14], [14, 16], // Arms
                    [12, 24], [11, 23], [24, 26], [26, 28], [23, 25], [25, 27], // Legs
                ];

                ctx.lineWidth = 7;
                connections.forEach(([start, end]) => {
                    if (landmarks[start] && landmarks[end]) {
                        const startX = landmarks[start].x * canvas.width;
                        const startY = landmarks[start].y * canvas.height;
                        const endX = landmarks[end].x * canvas.width;
                        const endY = landmarks[end].y * canvas.height;
                        console.log(`Drawing connection from (${startX}, ${startY}) to (${endX}, ${endY})`);  // Debugging: log coordinates
                        ctx.beginPath();
                        ctx.lineWidth = 7;
                        ctx.strokeStyle = clr;  // Dynamic color based on feedback
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(endX, endY);
                        ctx.stroke();
                    } else {
                        console.warn(`Connection from ${start} to ${end} is not available`);
                    }
                });
            };
            img.onerror = () => {
                console.error("Failed to load image.");
            };
        } else {
            console.warn("No landmarks to draw or canvas is not available.");
        }
    };

    // Capture function to fetch the frame from the webcam
    const capture = async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                console.error('Failed to capture image from webcam.');
                return;
            }

            const formData = new FormData();
            formData.append('file', dataURLtoFile(imageSrc, 'image.jpg'));

            try {
                const response = await fetch('http://localhost:8000/process', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Response Data:", data);  // Debugging: log response data
                setFeedback(data.feedback);
                setCount(data.count);
                setLandmarks(data.landmarks);
                setImageHex(data.image);

                // Change color based on feedback
                if (data.feedback !== "Good form!") {
                    setClr("red");
                } else {
                    setClr('white');
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    useEffect(() => {
        // Capture frames every 100ms
        const intervalId = setInterval(() => {
            capture();
        }, 150);

        return () => clearInterval(intervalId);  // Cleanup interval on component unmount
    }, [capture]);  // Removed capture dependency

    useEffect(() => {
        drawLandmarks(imageHex);  // Draw landmarks whenever imageHex or landmarks change
    }, [imageHex, landmarks, clr,drawLandmarks]);  // Added landmarks and clr dependencies

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="640"
                height="480"
                style={{ position: 'absolute', zIndex: 9, width: '640px', height: '480px' }}
            />
            <canvas
                ref={canvasRef}
                width="640"
                height="480"
                style={{ position: 'absolute', zIndex: 10, width: '640px', height: '480px' }}
            />
            <div style={{ position: 'absolute', zIndex: 11, top: '500px', left: '20px', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px' }}>
                <h2>Push-Up Counter: {count}</h2>
                <p>{feedback}</p>
            </div>
        </div>
    );
};

export default PushupTracker;
