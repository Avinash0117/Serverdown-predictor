import random
import time
from datetime import datetime
from typing import Optional

class MetricsSimulator:
    def __init__(self):
        self.base_cpu = 30.0
        self.base_ram = 45.0
        self.base_response_time = 150.0
        self.base_error_rate = 0.5
        self.base_db_latency = 25.0
        self.last_update = time.time()
        self.spike_active = False
        self.spike_end_time = 0
        
    def _generate_smooth_value(self, base: float, min_val: float, max_val: float, variation: float = 0.1) -> float:
        """Generate smoothly varying values"""
        change = random.uniform(-variation, variation) * base
        new_base = base + change
        new_base = max(min_val, min(max_val, new_base))
        return round(new_base, 2)
    
    def _check_spike(self) -> bool:
        """Randomly trigger spikes"""
        current_time = time.time()
        if not self.spike_active and random.random() < 0.05:  # 5% chance
            self.spike_active = True
            self.spike_end_time = current_time + random.uniform(10, 30)  # 10-30 seconds
            return True
        if self.spike_active and current_time > self.spike_end_time:
            self.spike_active = False
        return self.spike_active
    
    def generate_metrics(self, maintenance_enabled: bool = False) -> dict:
        """Generate simulated metrics"""
        if maintenance_enabled:
            return {
                "status": "maintenance",
                "cpu": round(random.uniform(10, 30), 2),
                "ram": round(random.uniform(20, 40), 2),
                "response_time": round(random.uniform(200, 500), 2),
                "error_rate": round(random.uniform(0, 2), 2),
                "db_latency": round(random.uniform(30, 60), 2),
                "timestamp": datetime.utcnow()
            }
        
        spike = self._check_spike()
        
        # Update base values smoothly
        self.base_cpu = self._generate_smooth_value(self.base_cpu, 10, 90, 0.15)
        self.base_ram = self._generate_smooth_value(self.base_ram, 20, 85, 0.12)
        self.base_response_time = self._generate_smooth_value(self.base_response_time, 50, 2000, 0.2)
        self.base_error_rate = self._generate_smooth_value(self.base_error_rate, 0, 20, 0.25)
        self.base_db_latency = self._generate_smooth_value(self.base_db_latency, 10, 200, 0.15)
        
        # Apply spike if active
        if spike:
            cpu = min(95, self.base_cpu * random.uniform(1.5, 2.5))
            ram = min(90, self.base_ram * random.uniform(1.3, 1.8))
            response_time = min(2000, self.base_response_time * random.uniform(2, 4))
            error_rate = min(20, self.base_error_rate * random.uniform(3, 6))
            db_latency = min(200, self.base_db_latency * random.uniform(2, 3))
        else:
            cpu = self.base_cpu
            ram = self.base_ram
            response_time = self.base_response_time
            error_rate = self.base_error_rate
            db_latency = self.base_db_latency
        
        # Determine status
        if error_rate > 15 or response_time > 2000:
            status = "down"
        elif error_rate > 5 or response_time > 1200:
            status = "degraded"
        else:
            status = "operational"
        
        return {
            "status": status,
            "cpu": round(cpu, 2),
            "ram": round(ram, 2),
            "response_time": round(response_time, 2),
            "error_rate": round(error_rate, 2),
            "db_latency": round(db_latency, 2),
            "timestamp": datetime.utcnow()
        }
