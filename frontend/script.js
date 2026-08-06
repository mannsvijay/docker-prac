async function loadMessage() {
    const response = await fetch("http://localhost:5000/api/message");
    const data = await response.json();

    document.getElementById("message").innerText = data.message;
}