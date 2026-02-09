"""
Test suite for Shopify and Carrier integrations (Colissimo/Chronopost)
Tests the new integration endpoints added to NEWSTAQ WMS
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestShopifyIntegration:
    """Tests for Shopify integration endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for tests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "admin123"
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        self.token = response.json()['token']
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_shopify_configure_endpoint_exists(self):
        """Test that /api/shopify/configure endpoint exists and accepts POST"""
        # Get an existing Shopify integration
        integrations_resp = requests.get(f"{BASE_URL}/api/integrations", headers=self.headers)
        assert integrations_resp.status_code == 200
        
        integrations = integrations_resp.json()
        shopify_integration = next((i for i in integrations if i['platform'] == 'shopify'), None)
        
        if shopify_integration:
            # Test configure endpoint with mock data
            response = requests.post(f"{BASE_URL}/api/shopify/configure", 
                headers=self.headers,
                json={
                    "integration_id": shopify_integration['id'],
                    "store_url": "test-store.myshopify.com",
                    "api_key": "test_api_key",
                    "api_secret": "test_api_secret",
                    "access_token": "test_access_token"
                }
            )
            # Should succeed (200) or fail with validation error (4xx), not 500
            assert response.status_code in [200, 400, 422], f"Unexpected status: {response.status_code} - {response.text}"
            print(f"SUCCESS: Shopify configure endpoint returned {response.status_code}")
        else:
            pytest.skip("No Shopify integration found to test")
    
    def test_shopify_sync_orders_endpoint_exists(self):
        """Test that /api/shopify/sync-orders endpoint exists"""
        # Get an existing Shopify integration
        integrations_resp = requests.get(f"{BASE_URL}/api/integrations", headers=self.headers)
        assert integrations_resp.status_code == 200
        
        integrations = integrations_resp.json()
        shopify_integration = next((i for i in integrations if i['platform'] == 'shopify'), None)
        
        if shopify_integration:
            response = requests.post(f"{BASE_URL}/api/shopify/sync-orders",
                headers=self.headers,
                json={"integration_id": shopify_integration['id']}
            )
            # Should return 400 if not configured, or 200 if configured
            # Should NOT return 404 (endpoint not found) or 500 (server error)
            assert response.status_code in [200, 400, 401], f"Unexpected status: {response.status_code} - {response.text}"
            print(f"SUCCESS: Shopify sync-orders endpoint returned {response.status_code}")
            
            # Verify response structure
            data = response.json()
            assert 'detail' in data or 'success' in data or 'message' in data
        else:
            pytest.skip("No Shopify integration found to test")


class TestCarrierIntegration:
    """Tests for Colissimo and Chronopost carrier endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for tests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "admin123"
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        self.token = response.json()['token']
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_carriers_list_endpoint(self):
        """Test GET /api/carriers returns list of carriers"""
        response = requests.get(f"{BASE_URL}/api/carriers", headers=self.headers)
        assert response.status_code == 200, f"Failed: {response.text}"
        
        carriers = response.json()
        assert isinstance(carriers, list)
        assert len(carriers) > 0, "No carriers found"
        
        # Check for Colissimo and Chronopost
        carrier_codes = [c['code'] for c in carriers]
        assert 'COLISSIMO' in carrier_codes, "Colissimo not found in carriers"
        assert 'CHRONOPOST' in carrier_codes, "Chronopost not found in carriers"
        print(f"SUCCESS: Found {len(carriers)} carriers including Colissimo and Chronopost")
    
    def test_carrier_rates_endpoint(self):
        """Test GET /api/carriers/rates returns shipping rates"""
        response = requests.get(f"{BASE_URL}/api/carriers/rates", 
            headers=self.headers,
            params={"weight": 1.0}
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        
        data = response.json()
        assert 'rates' in data, "Response missing 'rates' field"
        
        rates = data['rates']
        assert len(rates) > 0, "No rates returned"
        
        # Check for Colissimo and Chronopost rates
        colissimo_rates = [r for r in rates if 'Colissimo' in r['carrier']]
        chronopost_rates = [r for r in rates if 'Chronopost' in r['carrier']]
        
        assert len(colissimo_rates) > 0, "No Colissimo rates found"
        assert len(chronopost_rates) > 0, "No Chronopost rates found"
        
        # Verify rate structure
        for rate in rates:
            assert 'carrier' in rate
            assert 'service' in rate
            assert 'price' in rate
            assert 'estimatedDays' in rate
        
        print(f"SUCCESS: Got {len(colissimo_rates)} Colissimo rates and {len(chronopost_rates)} Chronopost rates")
    
    def test_create_shipment_demo_mode_colissimo(self):
        """Test creating a shipment with Colissimo in demo mode"""
        # First, get a 'packed' order that can be shipped
        orders_resp = requests.get(f"{BASE_URL}/api/orders", 
            headers=self.headers,
            params={"status": "packed"}
        )
        assert orders_resp.status_code == 200
        
        orders = orders_resp.json()
        # Find an order without tracking number
        order_to_ship = next((o for o in orders if not o.get('tracking_number')), None)
        
        if not order_to_ship:
            # Create a test order or use any packed order
            order_to_ship = next((o for o in orders), None)
            if not order_to_ship:
                pytest.skip("No packed orders available for shipment test")
        
        # Create shipment
        response = requests.post(f"{BASE_URL}/api/carriers/create-shipment",
            headers=self.headers,
            json={
                "order_id": order_to_ship['id'],
                "carrier": "colissimo",
                "service_type": "standard",
                "weight": 1.0
            }
        )
        
        # Should succeed in demo mode
        assert response.status_code == 200, f"Failed: {response.text}"
        
        data = response.json()
        assert data.get('success') == True, f"Shipment creation failed: {data}"
        assert 'trackingNumber' in data, "Missing tracking number"
        assert data['trackingNumber'].startswith('6A') or 'mode' in data, "Invalid Colissimo tracking format"
        
        print(f"SUCCESS: Created Colissimo shipment with tracking: {data['trackingNumber']}")
        return data['trackingNumber']
    
    def test_create_shipment_demo_mode_chronopost(self):
        """Test creating a shipment with Chronopost in demo mode"""
        # Get orders
        orders_resp = requests.get(f"{BASE_URL}/api/orders", headers=self.headers)
        assert orders_resp.status_code == 200
        
        orders = orders_resp.json()
        # Find a packed order without tracking
        packed_orders = [o for o in orders if o['status'] == 'packed' and not o.get('tracking_number')]
        
        if not packed_orders:
            pytest.skip("No packed orders without tracking available")
        
        order_to_ship = packed_orders[0]
        
        # Create shipment with Chronopost
        response = requests.post(f"{BASE_URL}/api/carriers/create-shipment",
            headers=self.headers,
            json={
                "order_id": order_to_ship['id'],
                "carrier": "chronopost",
                "service_type": "express",
                "weight": 0.5
            }
        )
        
        assert response.status_code == 200, f"Failed: {response.text}"
        
        data = response.json()
        assert data.get('success') == True
        assert 'trackingNumber' in data
        
        print(f"SUCCESS: Created Chronopost shipment with tracking: {data['trackingNumber']}")
    
    def test_carrier_configure_endpoint(self):
        """Test POST /api/carriers/configure endpoint"""
        response = requests.post(f"{BASE_URL}/api/carriers/configure",
            headers=self.headers,
            json={
                "carrier": "colissimo",
                "client_id": 1,
                "account_number": "TEST123456",
                "api_key": "test_api_key",
                "api_secret": "test_api_secret"
            }
        )
        
        # Should succeed or return validation error, not 500
        assert response.status_code in [200, 400, 422], f"Unexpected status: {response.status_code} - {response.text}"
        print(f"SUCCESS: Carrier configure endpoint returned {response.status_code}")


class TestIntegrationsPage:
    """Tests for the Integrations page API endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for tests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "admin123"
        })
        assert response.status_code == 200
        self.token = response.json()['token']
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_integrations_list(self):
        """Test GET /api/integrations returns list"""
        response = requests.get(f"{BASE_URL}/api/integrations", headers=self.headers)
        assert response.status_code == 200
        
        integrations = response.json()
        assert isinstance(integrations, list)
        print(f"SUCCESS: Found {len(integrations)} integrations")
    
    def test_available_platforms(self):
        """Test GET /api/integrations/available returns platform list"""
        response = requests.get(f"{BASE_URL}/api/integrations/available", headers=self.headers)
        assert response.status_code == 200
        
        platforms = response.json()
        assert isinstance(platforms, dict)
        
        # Should have cms, marketplace, and carrier categories
        assert 'cms' in platforms, "Missing CMS platforms"
        assert 'marketplace' in platforms, "Missing marketplace platforms"
        assert 'carrier' in platforms, "Missing carrier platforms"
        
        # Check for Shopify in CMS
        cms_ids = [p['id'] for p in platforms['cms']]
        assert 'shopify' in cms_ids, "Shopify not in CMS platforms"
        
        # Check for Colissimo and Chronopost in carriers
        carrier_ids = [p['id'] for p in platforms['carrier']]
        assert 'colissimo' in carrier_ids, "Colissimo not in carrier platforms"
        assert 'chronopost' in carrier_ids, "Chronopost not in carrier platforms"
        
        print(f"SUCCESS: Found {len(platforms['cms'])} CMS, {len(platforms['marketplace'])} marketplaces, {len(platforms['carrier'])} carriers")


class TestOrdersWithShipping:
    """Tests for Orders page with shipping functionality"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for tests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "admin123"
        })
        assert response.status_code == 200
        self.token = response.json()['token']
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_orders_list_with_tracking(self):
        """Test that orders list includes tracking information"""
        response = requests.get(f"{BASE_URL}/api/orders", headers=self.headers)
        assert response.status_code == 200
        
        orders = response.json()
        assert isinstance(orders, list)
        
        # Check for orders with tracking numbers
        shipped_orders = [o for o in orders if o.get('tracking_number')]
        print(f"SUCCESS: Found {len(orders)} orders, {len(shipped_orders)} with tracking numbers")
    
    def test_order_status_filter(self):
        """Test filtering orders by status"""
        for status in ['pending', 'picking', 'packed', 'shipped']:
            response = requests.get(f"{BASE_URL}/api/orders", 
                headers=self.headers,
                params={"status": status}
            )
            assert response.status_code == 200, f"Failed for status {status}"
            
            orders = response.json()
            # All returned orders should have the requested status
            for order in orders:
                assert order['status'] == status, f"Order {order['order_number']} has wrong status"
            
            print(f"SUCCESS: Status filter '{status}' returned {len(orders)} orders")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
