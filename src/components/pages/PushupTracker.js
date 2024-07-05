import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';

const PushupTracker = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [feedback, setFeedback] = useState('');
    const [count, setCount] = useState(0);
    const [landmarks, setLandmarks] = useState([]);
    const [imageHex, setImageHex] = useState('');

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
    const drawLandmarks = useCallback((imageHex) => {
        if (canvasRef.current && landmarks.length > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.src = `data:image/jpeg;base64,${imageHex}`;
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Draw landmarks
                landmarks.forEach(lm => {
                    const { x, y } = lm;
                    ctx.beginPath();
                    ctx.arc(x * canvas.width, y * canvas.height, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = '#FF0000';  // Set landmark color
                    ctx.fill();
                });

                // Draw connections
                const connections = [
                    [11, 13], [13, 15], [12, 14], [14, 16], // Arms
                    [11, 12], [23, 24], [24, 26], [26, 28], [23, 26], [24, 28], [25, 27], [27, 29], // Legs
                ];

                ctx.strokeStyle = '#00FF00';  // Set connection color
                ctx.lineWidth = 2;

                connections.forEach(([start, end]) => {
                    if (landmarks[start] && landmarks[end]) {
                        const [startX, startY] = [landmarks[start].x * canvas.width, landmarks[start].y * canvas.height];
                        const [endX, endY] = [landmarks[end].x * canvas.width, landmarks[end].y * canvas.height];
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(endX, endY);
                        ctx.stroke();
                    }
                });
            };
        }
    }, [landmarks]);

    // Capture function to fetch the frame from the webcam
    const capture = useCallback(async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                console.error('Failed to capture image from webcam.');
                return;
            }

            const formData = new FormData();
            formData.append('file', dataURLtoFile(imageSrc, 'image.jpg'));

            try {
                const response = await fetch('https://pushup-counter-backend.onrender.com/process', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setFeedback(data.feedback);
                setCount(data.count);
                setLandmarks(data.landmarks);
                setImageHex(data.image);

                // Call drawLandmarks function with new image
                drawLandmarks(data.image);

            } catch (error) {
                console.error('Error:', error);
            }
        }
    }, [drawLandmarks]);

    useEffect(() => {
        // Capture frames every 100ms
        const intervalId = setInterval(() => {
            capture();
        }, 100);

        return () => clearInterval(intervalId);  // Cleanup interval on component unmount
    }, [capture]);  // Capture function is a dependency

    useEffect(() => {
        drawLandmarks(imageHex);  // Draw landmarks whenever imageHex or landmarks change
    }, [imageHex, drawLandmarks]);

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