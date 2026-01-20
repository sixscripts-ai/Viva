import requests
import sys
import json
from datetime import datetime, timedelta

class DieselMediaAPITester:
    def __init__(self, base_url="https://diesel-media-hub.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.admin_token = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json() if response.text else {}
                except:
                    response_data = {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                response_data = {}

            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": response_data
            })

            return success, response_data

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_create_booking(self):
        """Test creating a booking"""
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        booking_data = {
            "client_name": "John Doe",
            "client_email": "john@example.com",
            "client_phone": "5551234567",
            "service_type": "wedding",
            "booking_date": tomorrow,
            "booking_time": "10:00 AM",
            "message": "Test booking message"
        }
        success, response = self.run_test("Create Booking", "POST", "bookings", 200, data=booking_data)
        return response.get('id') if success else None

    def test_get_bookings(self):
        """Test getting all bookings"""
        success, response = self.run_test("Get All Bookings", "GET", "bookings", 200)
        return success

    def test_get_booking_by_id(self, booking_id):
        """Test getting a specific booking"""
        if not booking_id:
            print("⚠️ Skipping get booking by ID - no booking ID available")
            return False
        success, _ = self.run_test("Get Booking by ID", "GET", f"bookings/{booking_id}", 200)
        return success

    def test_update_booking_status(self, booking_id):
        """Test updating booking status"""
        if not booking_id:
            print("⚠️ Skipping update booking status - no booking ID available")
            return False
        update_data = {"status": "confirmed"}
        success, _ = self.run_test("Update Booking Status", "PATCH", f"bookings/{booking_id}", 200, data=update_data)
        return success

    def test_create_contact_message(self):
        """Test creating a contact message"""
        message_data = {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "message": "This is a test contact message for the videography services."
        }
        success, response = self.run_test("Create Contact Message", "POST", "contact", 200, data=message_data)
        return response.get('id') if success else None

    def test_get_contact_messages(self):
        """Test getting all contact messages"""
        success, response = self.run_test("Get Contact Messages", "GET", "contact", 200)
        return success

    def test_get_available_times(self):
        """Test getting available times for a date"""
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        success, response = self.run_test("Get Available Times", "GET", "available-times", 200, params={"date": tomorrow})
        return success

    def test_delete_booking(self, booking_id):
        """Test deleting a booking"""
        if not booking_id:
            print("⚠️ Skipping delete booking - no booking ID available")
            return False
        success, _ = self.run_test("Delete Booking", "DELETE", f"bookings/{booking_id}", 200)
        return success

def main():
    print("🚀 Starting Diesel Media API Tests...")
    tester = DieselMediaAPITester()

    # Test root endpoint
    tester.test_root_endpoint()

    # Test booking flow
    booking_id = tester.test_create_booking()
    tester.test_get_bookings()
    tester.test_get_booking_by_id(booking_id)
    tester.test_update_booking_status(booking_id)

    # Test contact messages
    message_id = tester.test_create_contact_message()
    tester.test_get_contact_messages()

    # Test available times
    tester.test_get_available_times()

    # Test delete booking (cleanup)
    tester.test_delete_booking(booking_id)

    # Print results
    print(f"\n📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "summary": {
                "total_tests": tester.tests_run,
                "passed_tests": tester.tests_passed,
                "failed_tests": tester.tests_run - tester.tests_passed,
                "success_rate": f"{(tester.tests_passed/tester.tests_run)*100:.1f}%"
            },
            "detailed_results": tester.test_results
        }, f, indent=2)

    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())