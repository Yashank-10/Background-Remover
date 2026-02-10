const imageInput = document.getElementById("imageInput");
const uploadArea = document.getElementById("uploadArea");
const previewImage = document.getElementById("previewImage");
const resultImage = document.getElementById("resultImage");
const removeBtn = document.getElementById("removeBtn");
const downloadBtn = document.getElementById("downloadBtn");
const loader = document.getElementById("loader");
const btnText = document.getElementById("btnText");
const noBefore = document.getElementById("noBefore");
const noAfter = document.getElementById("noAfter");

let currentImageBlob = null;

// Drag and drop handling
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("dragover");
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    imageInput.files = files;
    handleImageSelected();
  }
});

// Click to browse
uploadArea.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", handleImageSelected);

function handleImageSelected() {
  const file = imageInput.files[0];
  if (!file) return;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    noBefore.style.display = "none";
  };
  reader.readAsDataURL(file);
}

removeBtn.addEventListener("click", async () => {
  const file = imageInput.files[0];

  if (!file) {
    alert("Please select an image first!");
    return;
  }

  // Show loading state
  removeBtn.disabled = true;
  loader.classList.add("show");
  btnText.classList.add("hide");
  noAfter.textContent = "Processing...";
  resultImage.src = "";

  try {
    const formData = new FormData();
    formData.append("file", file);

    // Use production URL on Render, localhost for development
    const apiUrl = window.location.hostname === 'localhost' 
      ? "http://localhost:8000/remove-bg"
      : "https://your-app-name.onrender.com/remove-bg";

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const blob = await response.blob();
    currentImageBlob = blob;

    const imageUrl = URL.createObjectURL(blob);
    resultImage.src = imageUrl;
    noAfter.style.display = "none";
    downloadBtn.style.display = "flex";

    // Update download link
    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = "result.png";
    downloadBtn.onclick = () => downloadLink.click();

  } catch (error) {
    alert("Error: " + error.message);
    console.error("Error:", error);
    noAfter.textContent = "Error processing image";
    noAfter.style.display = "block";
  } finally {
    removeBtn.disabled = false;
    loader.classList.remove("show");
    btnText.classList.remove("hide");
  }
});