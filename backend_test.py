"""
Comprehensive backend API testing for Human & Natural Environment Society website
Tests all public and admin endpoints
"""
import requests
import sys
from datetime import datetime

class NGOBackendTester:
    def __init__(self, base_url="https://green-community-ngo.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.admin_email = "hnes2016@gmail.com"
        self.admin_password = "HNES@321"

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, check_response=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        req_headers = {'Content-Type': 'application/json'}
        if headers:
            req_headers.update(headers)
        if self.token and 'Authorization' not in req_headers:
            req_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        print(f"   {method} {endpoint}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=req_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=req_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=req_headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=req_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=req_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                # Additional response validation if provided
                if check_response:
                    try:
                        response_data = response.json() if response.text else {}
                        validation_result = check_response(response_data)
                        if not validation_result:
                            success = False
                            print(f"   ❌ Response validation failed")
                            self.failed_tests.append(f"{name}: Response validation failed")
                    except Exception as e:
                        success = False
                        print(f"   ❌ Response validation error: {str(e)}")
                        self.failed_tests.append(f"{name}: {str(e)}")
                
                if success:
                    self.tests_passed += 1
                    print(f"   ✅ PASSED - Status: {response.status_code}")
                    return True, response.json() if response.text else {}
            else:
                print(f"   ❌ FAILED - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append(f"{name}: Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            print(f"   ❌ FAILED - Error: {str(e)}")
            self.failed_tests.append(f"{name}: {str(e)}")
            return False, {}

    def test_public_endpoints(self):
        """Test all public endpoints"""
        print("\n" + "="*60)
        print("TESTING PUBLIC ENDPOINTS")
        print("="*60)

        # Root endpoint
        self.run_test("Root API", "GET", "", 200, 
                     check_response=lambda r: r.get('status') == 'ok')

        # Settings
        self.run_test("Get site settings", "GET", "settings", 200,
                     check_response=lambda r: 'org' in r and 'impact_stats' in r)

        # Programs
        success, programs = self.run_test("List programs", "GET", "programs", 200,
                                         check_response=lambda r: isinstance(r, list) and len(r) >= 5)
        
        if success and programs:
            # Test program detail
            first_program = programs[0]
            self.run_test(f"Get program detail: {first_program.get('slug')}", 
                         "GET", f"programs/{first_program.get('slug')}", 200,
                         check_response=lambda r: r.get('slug') == first_program.get('slug'))

        # Blog
        self.run_test("List blog posts", "GET", "blog?limit=10", 200,
                     check_response=lambda r: 'posts' in r and 'total' in r)
        
        self.run_test("Blog with search", "GET", "blog?search=plantation", 200,
                     check_response=lambda r: 'posts' in r)
        
        self.run_test("Blog with category", "GET", "blog?category=Plantation Drives", 200,
                     check_response=lambda r: 'posts' in r)
        
        self.run_test("Blog categories", "GET", "blog/categories", 200,
                     check_response=lambda r: isinstance(r, list))

        # Get first blog post for detail test
        success, blog_data = self.run_test("Get blog posts for detail test", "GET", "blog?limit=1", 200)
        if success and blog_data.get('posts'):
            first_post = blog_data['posts'][0]
            self.run_test(f"Get blog post detail: {first_post.get('slug')}", 
                         "GET", f"blog/{first_post.get('slug')}", 200,
                         check_response=lambda r: 'post' in r and 'related' in r)

        # Gallery
        self.run_test("List gallery items", "GET", "gallery", 200,
                     check_response=lambda r: 'items' in r and 'categories' in r)
        
        self.run_test("Gallery with category filter", "GET", "gallery?category=Plantation Drives", 200,
                     check_response=lambda r: 'items' in r)

        # Team
        self.run_test("List team members", "GET", "team", 200,
                     check_response=lambda r: isinstance(r, list) and len(r) >= 6)

        # Testimonials
        self.run_test("List testimonials", "GET", "testimonials", 200,
                     check_response=lambda r: isinstance(r, list) and len(r) >= 4)

        # Milestones
        self.run_test("List milestones", "GET", "milestones", 200,
                     check_response=lambda r: isinstance(r, list) and len(r) >= 8)

        # Careers
        self.run_test("List careers", "GET", "careers", 200,
                     check_response=lambda r: isinstance(r, list) and len(r) >= 3)

    def test_form_submissions(self):
        """Test form submission endpoints"""
        print("\n" + "="*60)
        print("TESTING FORM SUBMISSIONS")
        print("="*60)

        # Contact submission
        contact_data = {
            "type": "contact",
            "name": "Test User",
            "email": "test@example.com",
            "phone": "9876543210",
            "subject": "Test inquiry",
            "message": "This is a test message"
        }
        self.run_test("Submit contact form", "POST", "submissions", 200, data=contact_data,
                     check_response=lambda r: r.get('success') == True)

        # Volunteer submission
        volunteer_data = {
            "type": "volunteer",
            "name": "Test Volunteer",
            "email": "volunteer@example.com",
            "phone": "9876543210",
            "city": "Delhi",
            "interest": "Tree Plantation & Greening",
            "message": "I want to volunteer"
        }
        self.run_test("Submit volunteer form", "POST", "submissions", 200, data=volunteer_data,
                     check_response=lambda r: r.get('success') == True)

        # Partner submission
        partner_data = {
            "type": "partner",
            "name": "Test Partner",
            "email": "partner@example.com",
            "phone": "9876543210",
            "organization": "Test Corp",
            "message": "CSR partnership inquiry"
        }
        self.run_test("Submit partner form", "POST", "submissions", 200, data=partner_data,
                     check_response=lambda r: r.get('success') == True)

        # Honeypot test - should silently accept
        honeypot_data = {
            "type": "contact",
            "name": "Bot User",
            "email": "bot@example.com",
            "website": "http://spam.com",  # Honeypot field
            "message": "Spam message"
        }
        self.run_test("Honeypot field test (should accept silently)", "POST", "submissions", 200, 
                     data=honeypot_data,
                     check_response=lambda r: r.get('success') == True)

    def test_newsletter(self):
        """Test newsletter subscription"""
        print("\n" + "="*60)
        print("TESTING NEWSLETTER")
        print("="*60)

        newsletter_data = {
            "email": f"test{datetime.now().timestamp()}@example.com"
        }
        self.run_test("Subscribe to newsletter", "POST", "newsletter", 200, data=newsletter_data,
                     check_response=lambda r: r.get('success') == True)

        # Test duplicate subscription
        self.run_test("Duplicate newsletter subscription", "POST", "newsletter", 200, 
                     data=newsletter_data,
                     check_response=lambda r: r.get('success') == True and 'already subscribed' in r.get('message', '').lower())

    def test_donations(self):
        """Test donation endpoint (MOCK mode)"""
        print("\n" + "="*60)
        print("TESTING DONATIONS (MOCK MODE)")
        print("="*60)

        donation_data = {
            "donor_name": "Test Donor",
            "email": "donor@example.com",
            "phone": "9876543210",
            "amount": 1000,
            "frequency": "one_time",
            "note": "Test donation"
        }
        success, response = self.run_test("Create donation (one-time)", "POST", "donations", 200, 
                                         data=donation_data,
                                         check_response=lambda r: r.get('success') == True and r.get('mock') == True and r.get('reference', '').startswith('MOCK-'))
        
        if success:
            print(f"   📝 Mock reference: {response.get('reference')}")

        # Monthly donation
        monthly_data = donation_data.copy()
        monthly_data['frequency'] = 'monthly'
        monthly_data['amount'] = 500
        self.run_test("Create donation (monthly)", "POST", "donations", 200, 
                     data=monthly_data,
                     check_response=lambda r: r.get('success') == True and r.get('mock') == True)

    def test_admin_login(self):
        """Test admin login"""
        print("\n" + "="*60)
        print("TESTING ADMIN AUTHENTICATION")
        print("="*60)

        # Correct credentials
        login_data = {
            "email": self.admin_email,
            "password": self.admin_password
        }
        success, response = self.run_test("Admin login (correct credentials)", "POST", "admin/login", 200, 
                                         data=login_data,
                                         check_response=lambda r: 'token' in r and r.get('email') == self.admin_email)
        
        if success:
            self.token = response.get('token')
            print(f"   🔑 Token obtained")

        # Wrong password
        wrong_login = {
            "email": self.admin_email,
            "password": "WrongPassword123"
        }
        self.run_test("Admin login (wrong password)", "POST", "admin/login", 401, data=wrong_login)

    def test_admin_endpoints_without_auth(self):
        """Test that admin endpoints reject requests without token"""
        print("\n" + "="*60)
        print("TESTING ADMIN ENDPOINTS WITHOUT AUTH")
        print("="*60)

        # Temporarily clear token
        temp_token = self.token
        self.token = None

        self.run_test("Dashboard without auth", "GET", "admin/dashboard", 401)
        self.run_test("Settings without auth", "GET", "admin/settings", 401)
        self.run_test("Content list without auth", "GET", "admin/content/programs", 401)

        # Restore token
        self.token = temp_token

    def test_admin_dashboard(self):
        """Test admin dashboard"""
        print("\n" + "="*60)
        print("TESTING ADMIN DASHBOARD")
        print("="*60)

        self.run_test("Get dashboard stats", "GET", "admin/dashboard", 200,
                     check_response=lambda r: 'totals' in r and 'recent_submissions' in r and 'email_configured' in r)

    def test_admin_content_crud(self):
        """Test admin content CRUD operations"""
        print("\n" + "="*60)
        print("TESTING ADMIN CONTENT CRUD")
        print("="*60)

        # Test for each content type
        content_types = ['programs', 'blog', 'gallery', 'team', 'testimonials', 'milestones', 'careers']
        
        for ctype in content_types:
            # List
            self.run_test(f"List {ctype}", "GET", f"admin/content/{ctype}", 200,
                         check_response=lambda r: isinstance(r, list))

        # Create a test program
        new_program = {
            "title": "Test Program for Testing",
            "category": "Test",
            "summary": "This is a test program created by automated testing",
            "description": "Test description",
            "image_url": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
            "featured": False,
            "order": 99
        }
        success, created = self.run_test("Create test program", "POST", "admin/content/programs", 200,
                                        data=new_program,
                                        check_response=lambda r: 'id' in r and 'slug' in r)
        
        if success and created.get('id'):
            program_id = created['id']
            print(f"   📝 Created program ID: {program_id}")

            # Update
            updated_program = {
                "title": "Updated Test Program",
                "category": "Test",
                "summary": "Updated summary",
                "description": "Updated description",
                "image_url": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
                "featured": False,
                "order": 99
            }
            self.run_test("Update test program", "PUT", f"admin/content/programs/{program_id}", 200,
                         data=updated_program,
                         check_response=lambda r: r.get('title') == "Updated Test Program")

            # Delete
            self.run_test("Delete test program", "DELETE", f"admin/content/programs/{program_id}", 200,
                         check_response=lambda r: r.get('success') == True)

    def test_admin_settings(self):
        """Test admin settings endpoints"""
        print("\n" + "="*60)
        print("TESTING ADMIN SETTINGS")
        print("="*60)

        # Get settings
        success, settings = self.run_test("Get admin settings", "GET", "admin/settings", 200,
                                         check_response=lambda r: 'org' in r and 'impact_stats' in r)

        if success:
            # Update settings (just update a small field)
            settings['org']['tagline'] = "Test tagline update"
            self.run_test("Update settings", "PUT", "admin/settings", 200, data=settings,
                         check_response=lambda r: r.get('org', {}).get('tagline') == "Test tagline update")

    def test_admin_submissions(self):
        """Test admin submissions management"""
        print("\n" + "="*60)
        print("TESTING ADMIN SUBMISSIONS MANAGEMENT")
        print("="*60)

        # List all submissions
        success, submissions = self.run_test("List all submissions", "GET", "admin/submissions", 200,
                                            check_response=lambda r: isinstance(r, list))

        # Filter by type
        self.run_test("List contact submissions", "GET", "admin/submissions?type=contact", 200,
                     check_response=lambda r: isinstance(r, list))
        
        self.run_test("List volunteer submissions", "GET", "admin/submissions?type=volunteer", 200,
                     check_response=lambda r: isinstance(r, list))

        # Update status if we have submissions
        if success and submissions and len(submissions) > 0:
            first_submission = submissions[0]
            submission_id = first_submission.get('id')
            
            self.run_test("Update submission status", "PATCH", f"admin/submissions/{submission_id}", 200,
                         data={"status": "read"},
                         check_response=lambda r: r.get('success') == True)

    def test_admin_donations(self):
        """Test admin donations list"""
        print("\n" + "="*60)
        print("TESTING ADMIN DONATIONS")
        print("="*60)

        self.run_test("List donations", "GET", "admin/donations", 200,
                     check_response=lambda r: isinstance(r, list))

    def test_admin_subscribers(self):
        """Test admin newsletter subscribers"""
        print("\n" + "="*60)
        print("TESTING ADMIN SUBSCRIBERS")
        print("="*60)

        self.run_test("List newsletter subscribers", "GET", "admin/subscribers", 200,
                     check_response=lambda r: isinstance(r, list))

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        print(f"Total tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed / self.tests_run * 100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for i, test in enumerate(self.failed_tests, 1):
                print(f"   {i}. {test}")
        else:
            print("\n✅ ALL TESTS PASSED!")
        
        return 0 if len(self.failed_tests) == 0 else 1

def main():
    tester = NGOBackendTester()
    
    # Run all test suites
    tester.test_public_endpoints()
    tester.test_form_submissions()
    tester.test_newsletter()
    tester.test_donations()
    tester.test_admin_login()
    
    if tester.token:
        tester.test_admin_endpoints_without_auth()
        tester.test_admin_dashboard()
        tester.test_admin_content_crud()
        tester.test_admin_settings()
        tester.test_admin_submissions()
        tester.test_admin_donations()
        tester.test_admin_subscribers()
    else:
        print("\n⚠️  Skipping admin tests - login failed")
    
    return tester.print_summary()

if __name__ == "__main__":
    sys.exit(main())
