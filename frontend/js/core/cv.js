let cvCamera = null;
let cvPose = null;
let cvWs = null;
let isCVRunning = false;
let currentExercise = 'squat';
let cvTimerInterval = null;
let cvTimeRemaining = 0;
let mediaRecorder = null;
let recordedChunks = [];
let sessionDuration = 0;
let sessionStartTime = 0;

function initCV() {
    const videoElement = document.getElementById('cvVideo');
    const canvasElement = document.getElementById('cvCanvas');
    if (!videoElement || !canvasElement) return;

    const canvasCtx = canvasElement.getContext('2d');
    
    cvPose = new Pose({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }});
    
    cvPose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    
    cvPose.onResults((results) => {
        // Draw the skeleton
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        
        if (results.poseLandmarks) {
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                           {color: '#00FF00', lineWidth: 4});
            drawLandmarks(canvasCtx, results.poseLandmarks,
                          {color: '#FF0000', lineWidth: 2});
                          
            // Send landmarks to WebSocket if running
            if (isCVRunning && cvWs && cvWs.readyState === WebSocket.OPEN) {
                // Visual feedback for Squat (Target line at knee level)
                if (currentExercise === 'squat') {
                    const hipNode = results.poseLandmarks[24];
                    const kneeNode = results.poseLandmarks[26];
                    if (hipNode && kneeNode) {
                        const kneeY = kneeNode.y * canvasElement.height;
                        const hipY = hipNode.y * canvasElement.height;
                        
                        // Draw target line at knee level
                        canvasCtx.beginPath();
                        canvasCtx.moveTo(0, kneeY);
                        canvasCtx.lineTo(canvasElement.width, kneeY);
                        canvasCtx.lineWidth = 3;
                        
                        // If hip is lower than knee (squat is deep enough), line is green, else red
                        if (hipY > kneeY - 20) {
                            canvasCtx.strokeStyle = '#00FF00'; // Green (Target Reached)
                        } else {
                            canvasCtx.strokeStyle = '#FF0000'; // Red (Go Lower)
                        }
                        
                        canvasCtx.setLineDash([10, 10]);
                        canvasCtx.stroke();
                        canvasCtx.setLineDash([]);
                    }
                }
                // Convert landmarks to dict for Python
                const landmarksDict = {};
                results.poseLandmarks.forEach((lm, index) => {
                    landmarksDict[index.toString()] = {
                        x: lm.x, 
                        y: lm.y, 
                        visibility: lm.visibility !== undefined ? lm.visibility : 1.0
                    };
                });
                
                cvWs.send(JSON.stringify({
                    action: "process",
                    landmarks: landmarksDict
                }));
            }
        }
        canvasCtx.restore();
    });
    
    cvCamera = new Camera(videoElement, {
        onFrame: async () => {
            await cvPose.send({image: videoElement});
        },
        width: 640,
        height: 480
    });
}

function startCVTest() {
    currentExercise = document.getElementById('exerciseSelect').value;
    const timerVal = parseInt(document.getElementById('timerSelect').value) || 0;
    const btn = document.getElementById('startCVBtn');
    const timerDisplay = document.getElementById('cvTimerCount');
    
    if (isCVRunning) {
        // Stop it
        isCVRunning = false;
        if (cvCamera) cvCamera.stop();
        if (cvWs) {
            cvWs.send(JSON.stringify({action: "stop"}));
            cvWs.close();
        }
        if (cvTimerInterval) {
            clearInterval(cvTimerInterval);
            cvTimerInterval = null;
        }
        
        sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }
        
        btn.innerText = "ابدأ الاختبار";
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-primary');
        document.getElementById('cvFeedback').innerText = "تم إنهاء الاختبار (جاري رفع النتيجة...)";
        return;
    }
    
    // Start it
    isCVRunning = true;
    btn.innerText = "إنهاء الاختبار";
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-danger');
    document.getElementById('cvRepCount').innerText = "0";
    document.getElementById('cvFeedback').innerText = "جاري التحميل...";
    
    // Initialize Camera and Pose if not done
    if (!cvCamera) {
        initCV();
    }
    
    // Connect WebSocket
    const token = localStorage.getItem('token'); // or client id
    let clientId = "guest";
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) clientId = user.id.toString();
    } catch(e) {}
    
    cvWs = new WebSocket(`ws://localhost:8000/ws/cv/${clientId}`);
    
    cvWs.onopen = () => {
        cvWs.send(JSON.stringify({
            action: "start",
            exercise: currentExercise
        }));
        cvCamera.start();
        document.getElementById('cvFeedback').innerText = "استعد لبدء التمرين...";
        
        // Start Timer if selected
        if (timerVal > 0) {
            cvTimeRemaining = timerVal;
            updateTimerDisplay();
            cvTimerInterval = setInterval(() => {
                cvTimeRemaining--;
                updateTimerDisplay();
                if (cvTimeRemaining <= 0) {
                    clearInterval(cvTimerInterval);
                    startCVTest(); // This will act as a Stop since isCVRunning is true
                    showCustomAlert("وقتك خلص يا بطل! ⏱️", "عاش جداً، مجهود خرافي! استريح شوية واستعد للتمرين اللي بعده.");
                }
            }, 1000);
        } else {
            timerDisplay.innerText = "00:00";
        }
        
        // Start Video Recording
        try {
            const canvasElement = document.getElementById('cvCanvas');
            const stream = canvasElement.captureStream(30);
            recordedChunks = [];
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) recordedChunks.push(e.data);
            };
            mediaRecorder.onstop = uploadCVSessionVideo;
            mediaRecorder.start();
            sessionStartTime = Date.now();
        } catch (e) {
            console.error("Failed to start MediaRecorder", e);
        }
    };
    
function updateTimerDisplay() {
    const m = Math.floor(cvTimeRemaining / 60).toString().padStart(2, '0');
    const s = (cvTimeRemaining % 60).toString().padStart(2, '0');
    document.getElementById('cvTimerCount').innerText = `${m}:${s}`;
}

function showCustomAlert(title, message) {
    let alertBox = document.getElementById('cvCustomAlert');
    if (!alertBox) {
        alertBox = document.createElement('div');
        alertBox.id = 'cvCustomAlert';
        alertBox.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); transition: 0.3s;">
                <div style="background: #1a1a1a; padding: 40px; border-radius: 20px; border: 1px solid rgba(189,255,0,0.3); text-align: center; max-width: 450px; width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(189,255,0,0.1); transform: scale(0.9); animation: popIn 0.3s forwards;">
                    <style>@keyframes popIn { to { transform: scale(1); } }</style>
                    <div style="font-size: 50px; margin-bottom: 15px;">🎉</div>
                    <h2 id="cvAlertTitle" style="color: var(--primary); margin-bottom: 15px; font-weight: bold;"></h2>
                    <p id="cvAlertMsg" style="color: #ddd; font-size: 18px; margin-bottom: 30px; line-height: 1.5;"></p>
                    <button onclick="document.getElementById('cvCustomAlert').style.display='none'" class="btn btn-primary" style="width: 100%; font-size: 18px; padding: 12px; border-radius: 10px;">عاش جداً، شكراً!</button>
                </div>
            </div>
        `;
        document.body.appendChild(alertBox);
    }
    document.getElementById('cvAlertTitle').innerText = title;
    document.getElementById('cvAlertMsg').innerText = message;
    alertBox.style.display = 'block';
}
    
    cvWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.reps !== undefined) {
            document.getElementById('cvRepCount').innerText = data.reps;
        }
        if (data.feedback) {
            document.getElementById('cvFeedback').innerText = data.feedback;
        }
        if (data.angle !== undefined) {
            // We can show the angle in the UI if needed
            // document.getElementById('cvFeedback').innerText += ` (Angle: ${data.angle})`;
        }
    };
    
    cvWs.onclose = () => {
        isCVRunning = false;
    };
}

async function uploadCVSessionVideo() {
    if (recordedChunks.length === 0) return;
    
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const reps = document.getElementById('cvRepCount').innerText || 0;
    
    const formData = new FormData();
    formData.append('video', blob, 'session.webm');
    formData.append('reps', reps);
    formData.append('duration', sessionDuration);
    formData.append('exercise', currentExercise);
    
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/api/fitness_tests/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (res.ok) {
            document.getElementById('cvFeedback').innerText = "تم رفع النتيجة بنجاح!";
        } else {
            document.getElementById('cvFeedback').innerText = "فشل رفع النتيجة.";
        }
    } catch(e) {
        console.error("Upload error", e);
        document.getElementById('cvFeedback').innerText = "فشل الاتصال بالسيرفر لرفع النتيجة.";
    }
}
