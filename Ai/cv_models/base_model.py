import math

class BaseModel:
    def __init__(self):
        pass

    def check_visibility(self, landmarks, keys, threshold=0.5):
        """
        Check if the required landmarks are visible enough and within the camera frame.
        """
        for k in keys:
            if k not in landmarks:
                return False
            
            # 1. Check visibility score (confidence)
            if landmarks[k].get("visibility", 1.0) < threshold:
                return False
                
            # 2. Check if it is physically inside the frame (0.0 to 1.0)
            # MediaPipe often guesses coordinates outside the frame (e.g. y=1.5) when legs are hidden
            x = landmarks[k].get("x", 0)
            y = landmarks[k].get("y", 0)
            if not (-0.1 <= x <= 1.1) or not (-0.1 <= y <= 1.1):
                return False
                
        return True

    def calculate_angle(self, a, b, c):
        """
        Calculate the angle between three points.
        a, b, c are tuples or lists of (x, y).
        Returns the angle in degrees between 0 and 180.
        """
        radians = math.atan2(c[1] - b[1], c[0] - b[0]) - math.atan2(a[1] - b[1], a[0] - b[0])
        angle = abs(radians * 180.0 / math.pi)
        
        if angle > 180.0:
            angle = 360 - angle
            
        return angle

    def calculate_distance(self, p1, p2):
        """
        Calculate Euclidean distance between two points (x, y).
        """
        return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)
