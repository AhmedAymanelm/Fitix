from .base_model import BaseModel

class SquatModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.counter = 0
        self.stage = "Up"
        self.feedback = ""
        
    def process(self, landmarks):
        """
        Process the pose landmarks based on the user's provided logic.
        """
        keys = ["23", "25", "27", "24", "26", "28", "11", "12"]
        if not self.check_visibility(landmarks, keys):
            return {"reps": self.counter, "feedback": "أظهر جسمك بالكامل للكاميرا (Low visibility)", "angle": 0}
            
        # Left side
        left_hip = (landmarks["23"]["x"], landmarks["23"]["y"])
        left_knee = (landmarks["25"]["x"], landmarks["25"]["y"])
        left_heel = (landmarks["27"]["x"], landmarks["27"]["y"]) # Or ankle
        left_shoulder = (landmarks["11"]["x"], landmarks["11"]["y"])
        
        # Right side
        right_hip = (landmarks["24"]["x"], landmarks["24"]["y"])
        right_knee = (landmarks["26"]["x"], landmarks["26"]["y"])
        right_heel = (landmarks["28"]["x"], landmarks["28"]["y"])
        right_shoulder = (landmarks["12"]["x"], landmarks["12"]["y"])

        # Plausibility Check: Prevent MediaPipe from mapping arms as legs when sitting!
        # In a real standing squat, the heels must be near the bottom half of the screen (y > 0.5)
        # And the hips must be below the shoulders (y is higher value)
        if left_heel[1] < 0.5 or right_heel[1] < 0.5:
            return {"reps": self.counter, "feedback": "ارجع لورا، الكاميرا قريبة جداً (Too close)", "angle": 0}
            
        if left_hip[1] < left_shoulder[1] or right_hip[1] < right_shoulder[1]:
            return {"reps": self.counter, "feedback": "قف بشكل معتدل", "angle": 0}

        # Anatomical Plausibility Check:
        # A human torso (shoulder to hip) should be reasonably long compared to shoulder width.
        # If it's very short, MediaPipe has mistakenly mapped the hips to the biceps/elbows.
        shoulder_width = self.calculate_distance(left_shoulder, right_shoulder)
        left_torso = self.calculate_distance(left_shoulder, left_hip)
        right_torso = self.calculate_distance(right_shoulder, right_hip)
        avg_torso = (left_torso + right_torso) / 2
        
        # If torso is less than 60% of shoulder width, it's a false skeleton
        if avg_torso < (shoulder_width * 0.6):
            return {"reps": self.counter, "feedback": "أظهر جسمك بالكامل (False tracking)", "angle": 0}

        left_angle = self.calculate_angle(left_hip, left_knee, left_heel)
        right_angle = self.calculate_angle(right_hip, right_knee, right_heel)
        
        # Use average angle for more stable counting (prevents one leg from breaking the count)
        avg_angle = int((left_angle + right_angle) / 2)
        
        # POSE CHECKING 1: Knees bending inwards
        shoulder_dist = abs(left_shoulder[0] - right_shoulder[0])
        knee_dist = abs(left_knee[0] - right_knee[0])

        if shoulder_dist - knee_dist > 0.04:
            self.feedback = "افتح ركبتك لمستوى كتفك (Knees inwards!)"
        else:
            self.feedback = ""

        # standing up (150 degrees is usually enough to indicate standing straight for most people)
        if avg_angle > 150:
            self.stage = "Up"
            
        if avg_angle < 140:
            if not self.feedback:
                self.feedback = "انزل كمان شوية لتحت"
            
        # Squat down threshold (115 is a moderate squat, easy enough to hit but still a squat)
        if avg_angle < 115 and self.stage == "Up":
            self.stage = "Down"
            self.counter += 1
            
        if self.stage == "Down":
            self.feedback = "عاش يا بطل! عدة صحيحة"
            
        return {
            "reps": self.counter,
            "feedback": self.feedback,
            "angle": avg_angle
        }
