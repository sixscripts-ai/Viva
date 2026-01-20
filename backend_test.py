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

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        # Add auth header if required and token available
        if auth_required and self.admin_token:
            headers['Authorization'] = f'Bearer {self.admin_token}'

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

    def test_admin_login_success(self):
        """Test admin login with correct credentials"""
        login_data = {
            "email": "aschtion2@gmail.com",
            "password": "Dieselmedia"
        }
        success, response = self.run_test("Admin Login (Valid)", "POST", "auth/login", 200, data=login_data)
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"🔑 Admin token obtained: {self.admin_token[:20]}...")
            return True
        return False

    def test_admin_login_invalid_email(self):
        """Test admin login with invalid email"""
        login_data = {
            "email": "wrong@email.com",
            "password": "Dieselmedia"
        }
        success, _ = self.run_test("Admin Login (Invalid Email)", "POST", "auth/login", 401, data=login_data)
        return success

    def test_admin_login_invalid_password(self):
        """Test admin login with invalid password"""
        login_data = {
            "email": "aschtion2@gmail.com",
            "password": "wrongpassword"
        }
        success, _ = self.run_test("Admin Login (Invalid Password)", "POST", "auth/login", 401, data=login_data)
        return success

    def test_auth_verify(self):
        """Test auth verification endpoint"""
        if not self.admin_token:
            print("⚠️ Skipping auth verify - no admin token available")
            return False
        success, _ = self.run_test("Auth Verify", "GET", "auth/verify", 200, auth_required=True)
        return success

    def test_create_booking(self):
        """Test creating a booking (public endpoint)"""
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
        success, response = self.run_test("Create Booking (Public)", "POST", "bookings", 200, data=booking_data)
        return response.get('id') if success else None

    def test_get_bookings_protected(self):
        """Test getting all bookings (protected endpoint)"""
        if not self.admin_token:
            print("⚠️ Skipping protected get bookings - no admin token available")
            return False
        success, response = self.run_test("Get All Bookings (Protected)", "GET", "bookings", 200, auth_required=True)
        return success

    def test_get_bookings_unauthorized(self):
        """Test getting all bookings without auth (should fail)"""
        success, _ = self.run_test("Get All Bookings (Unauthorized)", "GET", "bookings", 403)
        return success

    def test_get_booking_by_id_protected(self, booking_id):
        """Test getting a specific booking (protected endpoint)"""
        if not booking_id:
            print("⚠️ Skipping get booking by ID - no booking ID available")
            return False
        if not self.admin_token:
            print("⚠️ Skipping protected get booking by ID - no admin token available")
            return False
        success, _ = self.run_test("Get Booking by ID (Protected)", "GET", f"bookings/{booking_id}", 200, auth_required=True)
        return success

    def test_update_booking_status_protected(self, booking_id):
        """Test updating booking status (protected endpoint)"""
        if not booking_id:
            print("⚠️ Skipping update booking status - no booking ID available")
            return False
        if not self.admin_token:
            print("⚠️ Skipping protected update booking status - no admin token available")
            return False
        update_data = {"status": "confirmed"}
        success, _ = self.run_test("Update Booking Status (Protected)", "PATCH", f"bookings/{booking_id}", 200, data=update_data, auth_required=True)
        return success

    def test_update_booking_unauthorized(self, booking_id):
        """Test updating booking status without auth (should fail)"""
        if not booking_id:
            print("⚠️ Skipping unauthorized update booking - no booking ID available")
            return False
        update_data = {"status": "confirmed"}
        success, _ = self.run_test("Update Booking (Unauthorized)", "PATCH", f"bookings/{booking_id}", 403, data=update_data)
        return success

    def test_create_contact_message(self):
        """Test creating a contact message (public endpoint)"""
        message_data = {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "message": "This is a test contact message for the videography services."
        }
        success, response = self.run_test("Create Contact Message (Public)", "POST", "contact", 200, data=message_data)
        return response.get('id') if success else None

    def test_get_contact_messages_protected(self):
        """Test getting all contact messages (protected endpoint)"""
        if not self.admin_token:
            print("⚠️ Skipping protected get contact messages - no admin token available")
            return False
        success, response = self.run_test("Get Contact Messages (Protected)", "GET", "contact", 200, auth_required=True)
        return success

    def test_get_contact_messages_unauthorized(self):
        """Test getting contact messages without auth (should fail)"""
        success, _ = self.run_test("Get Contact Messages (Unauthorized)", "GET", "contact", 401)
        return success

    def test_get_available_times(self):
        """Test getting available times for a date"""
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        success, response = self.run_test("Get Available Times", "GET", "available-times", 200, params={"date": tomorrow})
        return success

    def test_delete_booking_protected(self, booking_id):
        """Test deleting a booking (protected endpoint)"""
        if not booking_id:
            print("⚠️ Skipping delete booking - no booking ID available")
            return False
        if not self.admin_token:
            print("⚠️ Skipping protected delete booking - no admin token available")
            return False
        success, _ = self.run_test("Delete Booking (Protected)", "DELETE", f"bookings/{booking_id}", 200, auth_required=True)
        return success

    def test_delete_booking_unauthorized(self, booking_id):
        """Test deleting a booking without auth (should fail)"""
        if not booking_id:
            print("⚠️ Skipping unauthorized delete booking - no booking ID available")
            return False
        success, _ = self.run_test("Delete Booking (Unauthorized)", "DELETE", f"bookings/{booking_id}", 401)
        return success

def main():
    print("🚀 Starting Diesel Media API Tests with Authentication...")
    tester = DieselMediaAPITester()

    # Test root endpoint
    tester.test_root_endpoint()

    # Test authentication
    print("\n🔐 Testing Authentication...")
    tester.test_admin_login_invalid_email()
    tester.test_admin_login_invalid_password()
    tester.test_admin_login_success()
    tester.test_auth_verify()

    # Test public endpoints (should work without auth)
    print("\n🌐 Testing Public Endpoints...")
    booking_id = tester.test_create_booking()
    message_id = tester.test_create_contact_message()
    tester.test_get_available_times()

    # Test unauthorized access to protected endpoints
    print("\n🚫 Testing Unauthorized Access...")
    tester.test_get_bookings_unauthorized()
    tester.test_get_contact_messages_unauthorized()
    tester.test_update_booking_unauthorized(booking_id)
    tester.test_delete_booking_unauthorized(booking_id)

    # Test protected endpoints with auth
    print("\n🔒 Testing Protected Endpoints...")
    tester.test_get_bookings_protected()
    tester.test_get_booking_by_id_protected(booking_id)
    tester.test_update_booking_status_protected(booking_id)
    tester.test_get_contact_messages_protected()

    # Test delete booking (cleanup) - protected
    tester.test_delete_booking_protected(booking_id)

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