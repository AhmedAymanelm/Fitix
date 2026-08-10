from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import sys
import os

# Add Ai folder to path if not already present
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from Ai.cv_tracker import tracker

router = APIRouter()

@router.websocket("/ws/cv/{client_id}")
async def cv_websocket(websocket: WebSocket, client_id: str):
    await websocket.accept()
    session_id = f"client_{client_id}"
    
    try:
        while True:
            data_str = await websocket.receive_text()
            data = json.loads(data_str)
            
            action = data.get("action")
            
            if action == "start":
                exercise = data.get("exercise", "squat")
                res = tracker.start_session(session_id, exercise)
                await websocket.send_json(res)
                
            elif action == "process":
                landmarks = data.get("landmarks", {})
                res = tracker.process_frame(session_id, landmarks)
                await websocket.send_json(res)
                
            elif action == "stop":
                res = tracker.end_session(session_id)
                await websocket.send_json(res)
                break
                
    except WebSocketDisconnect:
        tracker.end_session(session_id)
        print(f"Client {client_id} disconnected from CV tracker")
