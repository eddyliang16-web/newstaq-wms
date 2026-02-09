import requests
import sys
import json
from datetime import datetime

class WMSAPITester:
    def __init__(self, base_url="https://supply-stack.preview.emergentagent.com"):
        self.base_url = base_url
        self.admin_token = None
        self.client_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, token=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.text else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test API health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"username": "admin", "password": "admin123"}
        )
        if success and 'token' in response:
            self.admin_token = response['token']
            print(f"   Admin user: {response.get('user', {}).get('name', 'N/A')}")
            return True
        return False

    def test_client_login(self):
        """Test client login"""
        success, response = self.run_test(
            "Client Login (techstore)",
            "POST",
            "auth/login",
            200,
            data={"username": "techstore", "password": "client123"}
        )
        if success and 'token' in response:
            self.client_token = response['token']
            print(f"   Client user: {response.get('user', {}).get('name', 'N/A')}")
            print(f"   Client ID: {response.get('user', {}).get('client_id', 'N/A')}")
            return True
        return False

    def test_invalid_login(self):
        """Test invalid login credentials"""
        return self.run_test(
            "Invalid Login",
            "POST",
            "auth/login",
            401,
            data={"username": "invalid", "password": "wrong"}
        )

    def test_admin_endpoints(self):
        """Test admin-specific endpoints"""
        if not self.admin_token:
            print("❌ Admin token not available, skipping admin tests")
            return False

        # Test clients endpoint
        success, clients = self.run_test("Get Clients", "GET", "clients", 200, token=self.admin_token)
        if success:
            print(f"   Found {len(clients)} clients")

        # Test dashboard stats
        success, stats = self.run_test("Dashboard Stats", "GET", "dashboard/stats", 200, token=self.admin_token)
        if success:
            print(f"   Products: {stats.get('stock', {}).get('total_products', 0)}")
            print(f"   Orders: {stats.get('orders', {}).get('total_orders', 0)}")

        # Test integrations
        success, integrations = self.run_test("Get Integrations", "GET", "integrations", 200, token=self.admin_token)
        if success:
            print(f"   Found {len(integrations)} integrations")

        # Test available platforms
        success, platforms = self.run_test("Available Platforms", "GET", "integrations/available", 200, token=self.admin_token)
        if success:
            cms_count = len(platforms.get('cms', []))
            marketplace_count = len(platforms.get('marketplace', []))
            carrier_count = len(platforms.get('carrier', []))
            print(f"   CMS: {cms_count}, Marketplaces: {marketplace_count}, Carriers: {carrier_count}")

        return True

    def test_client_endpoints(self):
        """Test client-specific endpoints"""
        if not self.client_token:
            print("❌ Client token not available, skipping client tests")
            return False

        # Test client portal summary
        success, summary = self.run_test("Client Portal Summary", "GET", "client-portal/summary", 200, token=self.client_token)
        if success:
            client_name = summary.get('client', {}).get('name', 'N/A')
            product_count = summary.get('products', {}).get('product_count', 0)
            print(f"   Client: {client_name}")
            print(f"   Products: {product_count}")

        # Test client products
        success, products = self.run_test("Client Products", "GET", "products", 200, token=self.client_token)
        if success:
            print(f"   Found {len(products)} products for client")

        # Test client orders
        success, orders = self.run_test("Client Orders", "GET", "orders", 200, token=self.client_token)
        if success:
            print(f"   Found {len(orders)} orders for client")

        # Test client receipts
        success, receipts = self.run_test("Client Receipts", "GET", "receipts", 200, token=self.client_token)
        if success:
            print(f"   Found {len(receipts)} receipts for client")

        # Test client invoices
        success, invoices = self.run_test("Client Invoices", "GET", "billing/invoices", 200, token=self.client_token)
        if success:
            print(f"   Found {len(invoices)} invoices for client")

        return True

    def test_crud_operations(self):
        """Test CRUD operations for orders, receipts, inventory counts"""
        if not self.admin_token:
            print("❌ Admin token not available, skipping CRUD tests")
            return False

        # Test create order
        order_data = {
            "client_id": 1,
            "customer_name": "Test Customer",
            "customer_email": "test@example.com",
            "shipping_address": "123 Test Street, Test City",
            "due_date": "2026-03-01",
            "priority": "medium",
            "notes": "Test order creation"
        }
        success, order_response = self.run_test("Create Order", "POST", "orders", 200, data=order_data, token=self.admin_token)
        order_id = None
        if success and 'id' in order_response:
            order_id = order_response['id']
            print(f"   Created order ID: {order_id}")

        # Test update order status
        if order_id:
            update_data = {"status": "picking", "notes": "Updated to picking status"}
            self.run_test(f"Update Order {order_id}", "PUT", f"orders/{order_id}", 200, data=update_data, token=self.admin_token)

        # Test create receipt
        receipt_data = {
            "client_id": 1,
            "supplier_name": "Test Supplier",
            "expected_date": "2026-03-01",
            "notes": "Test receipt creation"
        }
        success, receipt_response = self.run_test("Create Receipt", "POST", "receipts", 200, data=receipt_data, token=self.admin_token)
        receipt_id = None
        if success and 'id' in receipt_response:
            receipt_id = receipt_response['id']
            print(f"   Created receipt ID: {receipt_id}")

        # Test update receipt
        if receipt_id:
            update_data = {"status": "in_progress", "notes": "Updated receipt status"}
            self.run_test(f"Update Receipt {receipt_id}", "PUT", f"receipts/{receipt_id}", 200, data=update_data, token=self.admin_token)

        # Test create inventory count
        count_data = {
            "client_id": 1,
            "count_date": "2026-03-01"
        }
        success, count_response = self.run_test("Create Inventory Count", "POST", "inventory-counts", 200, data=count_data, token=self.admin_token)
        if success and 'id' in count_response:
            print(f"   Created inventory count ID: {count_response['id']}")

        return True

    def test_billing_operations(self):
        """Test billing and invoice operations"""
        if not self.admin_token:
            print("❌ Admin token not available, skipping billing tests")
            return False

        # Test get default pricing
        success, pricing = self.run_test("Get Default Pricing", "GET", "billing/default-pricing", 200, token=self.admin_token)
        if success:
            print(f"   Storage per pallet: €{pricing.get('storage_per_pallet', 0)}")
            print(f"   Reception per pallet: €{pricing.get('reception_per_pallet', 0)}")

        # Test get revenue stats
        success, revenue = self.run_test("Get Revenue Stats", "GET", "billing/revenue", 200, token=self.admin_token)
        if success:
            print(f"   Found {len(revenue)} client revenue records")

        # Test generate invoice
        invoice_data = {
            "client_id": 1,
            "start_date": "2026-01-01",
            "end_date": "2026-01-31"
        }
        success, invoice_response = self.run_test("Generate Invoice", "POST", "billing/invoices/generate", 200, data=invoice_data, token=self.admin_token)
        if success:
            print(f"   Generated invoice: {invoice_response.get('invoiceNumber', 'N/A')}")
            print(f"   Total amount: €{invoice_response.get('total', 0)}")

        return True

    def test_notifications(self):
        """Test notifications system"""
        if not self.admin_token:
            print("❌ Admin token not available, skipping notifications tests")
            return False

        # Test get notification history
        success, history = self.run_test("Get Notification History", "GET", "notifications/history", 200, token=self.admin_token)
        if success:
            print(f"   Found {len(history)} notifications in history")

        # Test check alerts
        success, alerts_response = self.run_test("Check Low Stock Alerts", "POST", "notifications/check-alerts", 200, token=self.admin_token)
        if success:
            alerts_sent = alerts_response.get('alertsSent', 0)
            print(f"   Alerts sent: {alerts_sent}")

        return True

    def test_products_count(self):
        """Test that we have 75 products total as per spec"""
        if not self.admin_token:
            print("❌ Admin token not available, skipping products count test")
            return False

        success, products = self.run_test("Get All Products", "GET", "products", 200, token=self.admin_token)
        if success:
            total_products = len(products)
            print(f"   Total products found: {total_products}")
            
            # Count by client
            client_counts = {}
            for product in products:
                client_name = product.get('client_name', 'Unknown')
                client_counts[client_name] = client_counts.get(client_name, 0) + 1
            
            for client, count in client_counts.items():
                print(f"   {client}: {count} products")
            
            # Check if we have the expected 75 products
            if total_products == 75:
                print("   ✅ Correct number of products (75 as per spec)")
            else:
                print(f"   ⚠️ Expected 75 products, found {total_products}")
        
        return True

    def test_unauthorized_access(self):
        """Test endpoints without authentication"""
        # Should fail without token
        self.run_test("Unauthorized Clients Access", "GET", "clients", 401)
        self.run_test("Unauthorized Products Access", "GET", "products", 401)
        return True

def main():
    print("🚀 Starting NEWSTAQ WMS API Testing...")
    print("=" * 50)
    
    tester = WMSAPITester()
    
    # Basic connectivity
    if not tester.test_health_check()[0]:
        print("❌ Health check failed, stopping tests")
        return 1

    # Authentication tests
    print("\n📋 Testing Authentication...")
    admin_login_success = tester.test_admin_login()
    client_login_success = tester.test_client_login()
    tester.test_invalid_login()

    # Admin functionality tests
    if admin_login_success:
        print("\n👑 Testing Admin Endpoints...")
        tester.test_admin_endpoints()
        
        print("\n📊 Testing Products Count (75 expected)...")
        tester.test_products_count()
        
        print("\n🔧 Testing CRUD Operations...")
        tester.test_crud_operations()
        
        print("\n💰 Testing Billing Operations...")
        tester.test_billing_operations()
        
        print("\n🔔 Testing Notifications...")
        tester.test_notifications()

    # Client functionality tests
    if client_login_success:
        print("\n👤 Testing Client Portal Endpoints...")
        tester.test_client_endpoints()

    # Security tests
    print("\n🔒 Testing Security...")
    tester.test_unauthorized_access()

    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for test in tester.failed_tests:
            if 'error' in test:
                print(f"   - {test['name']}: {test['error']}")
            else:
                print(f"   - {test['name']}: Expected {test.get('expected')}, got {test.get('actual')}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n✅ Success Rate: {success_rate:.1f}%")
    
    return 0 if success_rate >= 80 else 1

if __name__ == "__main__":
    sys.exit(main())