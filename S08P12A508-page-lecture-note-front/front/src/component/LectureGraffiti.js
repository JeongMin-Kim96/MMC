import React, { useEffect, useRef, useState } from "react";

const socket = new WebSocket(`ws://localhost:8000`);

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

let lastColor = "black";
let savedStates = [];
let check = false;

function updatePicture(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

const LectureGraffiti = () => {
  if (!check) {
    check = true;
    socket.send(updatePicture("first", ""));
  }
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [thickness, setThickness] = useState(2);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    socket.addEventListener("message", (msg) => {
      const message = JSON.parse(msg.data);
      const Data2Array = JSON.parse(message.payload);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      const Data2 = new ImageData(new Uint8ClampedArray(Data2Array), canvas.width, canvas.height);

      context.putImageData(Data2, 0, 0);
    });
  }, []);

  const startDrawing = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    savedStates.push(context.getImageData(0, 0, canvas.width, canvas.height));
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    setLastX(event.clientX - rect.left);
    setLastY(event.clientY - rect.top);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const Data1 = context.getImageData(0, 0, canvas.width, canvas.height);
    const Data1Array = Array.from(Data1.data);
    const Data1JSON = JSON.stringify(Data1Array);
    socket.send(updatePicture("picture", Data1JSON));
  };

  const drawing = (event) => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.lineWidth = thickness;
    context.lineCap = "round";
    context.strokeStyle = color;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();
    setLastX(x);
    setLastY(y);
  };

  const draw = () => {
    setColor(lastColor);
  };

  const erase = () => {
    lastColor = color;
    setColor("white");
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.clearRect(0, 0, canvas.width, canvas.height);
    const Data1 = context.getImageData(0, 0, canvas.width, canvas.height);
    const Data1Array = Array.from(Data1.data);
    const Data1JSON = JSON.stringify(Data1Array);
    socket.send(updatePicture("picture", Data1JSON));
  };

  const restore = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (savedStates.length > 0) {
      context.putImageData(savedStates.pop(), 0, 0);
    }
    const Data1 = context.getImageData(0, 0, canvas.width, canvas.height);
    const Data1Array = Array.from(Data1.data);
    const Data1JSON = JSON.stringify(Data1Array);
    socket.send(updatePicture("picture", Data1JSON));
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={startDrawing}
        onMouseMove={drawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div>
        <label htmlFor="color">Color:</label>
        <select id="color" value={color} onChange={(event) => setColor(event.target.value)}>
          <option value="black">Black</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>
        <label htmlFor="thickness">Thickness:</label>
        <input
          type="number"
          id="thickness"
          value={thickness}
          onChange={(event) => setThickness(event.target.value)}
        />
        <button onClick={draw}>Draw</button>
        <button onClick={erase}>Erase</button>
        <button onClick={clear}>Clear</button>
        <button onClick={restore}>Restore</button>
      </div>
    </div>
  );
};

export default LectureGraffiti;