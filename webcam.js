const video = document.querySelector("#videoElement");
const canvas = document.querySelector("#canvas");
const capturedImage = document.querySelector("#capturedImage");
const status = document.querySelector("#status");
const captureBtn = document.querySelector("#captureBtn");
const submitBtn = document.querySelector("#submitBtn");
const googleForm = document.querySelector("#googleForm");
let stream = null;

// Start webcam
async function startCamera() {
    try {
        status.textContent = "Attempting to access camera...";

        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            throw new Error("Camera access requires HTTPS or localhost");
        }

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 500 },
                height: { ideal: 375 }
            }
        });

        video.srcObject = stream;
        await video.play();
        status.textContent = "Camera ready! Click 'Capture Image' when ready.";
        captureBtn.disabled = false;

    } catch (error) {
        console.error("Camera access error:", error);
        status.textContent = `Error: ${error.message}`;
    }
}

// Capture image from webcam
function captureImage() {
    if (!stream) {
        status.textContent = "Camera not ready!";
        return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 and show preview
    const imageData = canvas.toDataURL('image/jpeg');
    capturedImage.src = imageData;
    capturedImage.style.display = 'block';

    // Store in form
    document.getElementById('imageData').value = imageData;
    
    status.textContent = "Image captured! Click 'Submit to Form' to send.";
    submitBtn.disabled = false;
}

// Submit to Google Form
function submitToForm() {
    const imageData = document.getElementById('imageData').value;
    if (!imageData) {
        status.textContent = "Please capture an image first!";
        return;
    }

    try {
        googleForm.submit();
        status.textContent = "Image submitted to form successfully!";
    } catch (error) {
        status.textContent = "Error submitting to form: " + error.message;
    }
}

// Event listeners
captureBtn.addEventListener('click', captureImage);
submitBtn.addEventListener('click', submitToForm);
document.addEventListener('DOMContentLoaded', startCamera);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});

// Initial setup
captureBtn.disabled = true;
submitBtn.disabled = true;
