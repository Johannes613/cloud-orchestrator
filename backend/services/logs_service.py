from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import json
import os
from models.logs import LogEntry, LogEntryCreate, LogFilter

class LogsService:
    def __init__(self):
        self.logs = []
        self.data_file = "data/logs.json"
        self._load_data()

    def _load_data(self):
        """Load logs from JSON file"""
        try:
            if os.path.exists(self.data_file):
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        self.logs = data
                    else:
                        self.logs = []
        except Exception as e:
            print(f"Error loading logs: {e}")
            self.logs = []

    def _save_data(self):
        """Save logs to JSON file"""
        try:
            os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
            with open(self.data_file, 'w') as f:
                json.dump(self.logs, f, indent=2)
        except Exception as e:
            print(f"Error saving logs: {e}")

    async def get_logs(self, log_filter: Optional[LogFilter] = None) -> List[LogEntry]:
        """Get logs with optional filtering"""
        try:
            filtered_logs = self.logs.copy()
            
            if log_filter:
                # Apply filters
                if log_filter.level:
                    filtered_logs = [log for log in filtered_logs if log.get('level') == log_filter.level]
                
                if log_filter.source:
                    filtered_logs = [log for log in filtered_logs if log.get('source') == log_filter.source]
                
                if log_filter.application_id:
                    filtered_logs = [log for log in filtered_logs if log.get('application_id') == log_filter.application_id]
                
                if log_filter.deployment_id:
                    filtered_logs = [log for log in filtered_logs if log.get('deployment_id') == log_filter.deployment_id]
                
                if log_filter.start_time:
                    filtered_logs = [log for log in filtered_logs if log.get('timestamp') >= log_filter.start_time]
                
                if log_filter.end_time:
                    filtered_logs = [log for log in filtered_logs if log.get('timestamp') <= log_filter.end_time]
                
                # Apply limit
                if log_filter.limit:
                    filtered_logs = filtered_logs[-log_filter.limit:]
            
            return [LogEntry(**log_data) for log_data in filtered_logs]
        except Exception as e:
            print(f"Error fetching logs: {e}")
            return []

    async def get_log_by_id(self, log_id: str) -> Optional[LogEntry]:
        """Get a specific log entry by ID"""
        try:
            for log_data in self.logs:
                if log_data.get('id') == log_id:
                    return LogEntry(**log_data)
            return None
        except Exception as e:
            print(f"Error fetching log {log_id}: {e}")
            return None

    async def create_log(self, log_data: LogEntryCreate) -> Optional[LogEntry]:
        """Create a new log entry"""
        try:
            log_id = str(uuid.uuid4())
            current_time = datetime.now().isoformat()
            
            log_entry = {
                "id": log_id,
                "timestamp": current_time,
                "level": log_data.level,
                "message": log_data.message,
                "source": log_data.source,
                "details": log_data.details,
                "application_id": log_data.application_id,
                "deployment_id": log_data.deployment_id
            }
            
            self.logs.append(log_entry)
            
            # Keep only last 10000 logs to prevent memory issues
            if len(self.logs) > 10000:
                self.logs = self.logs[-10000:]
            
            self._save_data()
            
            return LogEntry(**log_entry)
        except Exception as e:
            print(f"Error creating log: {e}")
            return None

    async def delete_log(self, log_id: str) -> bool:
        """Delete a log entry"""
        try:
            for i, log_data in enumerate(self.logs):
                if log_data.get('id') == log_id:
                    del self.logs[i]
                    self._save_data()
                    return True
            return False
        except Exception as e:
            print(f"Error deleting log {log_id}: {e}")
            return False

    async def clear_logs(self, log_filter: Optional[LogFilter] = None) -> bool:
        """Clear logs with optional filtering"""
        try:
            if log_filter:
                # Apply same filtering logic as get_logs
                filtered_logs = self.logs.copy()
                
                if log_filter.level:
                    filtered_logs = [log for log in filtered_logs if log.get('level') != log_filter.level]
                
                if log_filter.source:
                    filtered_logs = [log for log in filtered_logs if log.get('source') != log_filter.source]
                
                if log_filter.application_id:
                    filtered_logs = [log for log in filtered_logs if log.get('application_id') != log_filter.application_id]
                
                if log_filter.deployment_id:
                    filtered_logs = [log for log in filtered_logs if log.get('deployment_id') != log_filter.deployment_id]
                
                self.logs = filtered_logs
            else:
                self.logs = []
            
            self._save_data()
            return True
        except Exception as e:
            print(f"Error clearing logs: {e}")
            return False 