from .cv_models.squat_model import SquatModel

class CVTracker:
    def __init__(self):
        self.sessions = {}
        
    def start_session(self, session_id: str, exercise_type: str = 'squat'):
        self.sessions[session_id] = SquatModel()
        return {"status": "started", "exercise": "squat"}
        
    def process_frame(self, session_id, landmarks):
        """
        Process the frame landmarks using the active session model.
        """
        if session_id not in self.sessions:
            return {"error": "Session not found"}
            
        model = self.sessions[session_id]
        result = model.process(landmarks)
        return result
        
    def end_session(self, session_id):
        """
        End the tracking session.
        """
        if session_id in self.sessions:
            final_reps = self.sessions[session_id].counter
            del self.sessions[session_id]
            return {"status": "ended", "final_reps": final_reps}
        return {"error": "Session not found"}

# Global tracker instance
tracker = CVTracker()
