#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class WellnessBlogAPITester:
    def __init__(self):
        self.base_url = "https://wellness-hub-693.preview.emergentagent.com/api"
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def test_health_check(self):
        """Test API health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                details += f", Response: {response.json()}"
            self.log_test("Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("Health Check", False, f"Error: {str(e)}")
            return False

    def test_root_endpoint(self):
        """Test API root endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message: {data.get('message', 'No message')}"
            self.log_test("Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Root Endpoint", False, f"Error: {str(e)}")
            return False

    def test_seed_data(self):
        """Test seeding initial data"""
        try:
            response = self.session.post(f"{self.base_url}/seed", timeout=15)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Response: {data.get('message', 'Unknown')}"
            self.log_test("Seed Data", success, details)
            return success
        except Exception as e:
            self.log_test("Seed Data", False, f"Error: {str(e)}")
            return False

    def test_get_articles(self):
        """Test getting all articles"""
        try:
            response = self.session.get(f"{self.base_url}/articles", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                articles = response.json()
                details += f", Articles count: {len(articles)}"
                if len(articles) > 0:
                    details += f", First article: {articles[0].get('title', 'No title')[:30]}..."
            self.log_test("Get Articles", success, details)
            return success, response.json() if success else []
        except Exception as e:
            self.log_test("Get Articles", False, f"Error: {str(e)}")
            return False, []

    def test_get_articles_by_category(self):
        """Test getting articles by category"""
        categories = ["human", "animal", "connection"]
        success_count = 0
        
        for category in categories:
            try:
                response = self.session.get(f"{self.base_url}/articles?category={category}", timeout=10)
                success = response.status_code == 200
                details = f"Status: {response.status_code}, Category: {category}"
                if success:
                    articles = response.json()
                    details += f", Count: {len(articles)}"
                    success_count += 1
                self.log_test(f"Get Articles - {category.title()}", success, details)
            except Exception as e:
                self.log_test(f"Get Articles - {category.title()}", False, f"Error: {str(e)}")
        
        return success_count == len(categories)

    def test_get_article_by_slug(self, articles):
        """Test getting single article by slug"""
        if not articles:
            self.log_test("Get Article by Slug", False, "No articles available to test")
            return False
        
        # Test with the first article
        test_article = articles[0]
        slug = test_article.get('slug')
        if not slug:
            self.log_test("Get Article by Slug", False, "No slug found in first article")
            return False
        
        try:
            response = self.session.get(f"{self.base_url}/articles/{slug}", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}, Slug: {slug}"
            if success:
                article = response.json()
                details += f", Title: {article.get('title', 'No title')[:30]}..."
            self.log_test("Get Article by Slug", success, details)
            return success, response.json() if success else None
        except Exception as e:
            self.log_test("Get Article by Slug", False, f"Error: {str(e)}")
            return False, None

    def test_newsletter_subscription(self):
        """Test newsletter subscription"""
        test_email = f"test_{int(datetime.now().timestamp())}@example.com"
        
        try:
            response = self.session.post(
                f"{self.base_url}/newsletter",
                json={"email": test_email},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}, Email: {test_email}"
            if success:
                data = response.json()
                details += f", Response: {data.get('message', 'No message')}"
            self.log_test("Newsletter Subscription", success, details)
            return success
        except Exception as e:
            self.log_test("Newsletter Subscription", False, f"Error: {str(e)}")
            return False

    def test_auth_endpoints_without_session(self):
        """Test auth endpoints that should work without authentication"""
        try:
            # Test /auth/me endpoint without session (should return 401)
            response = self.session.get(f"{self.base_url}/auth/me", timeout=10)
            success = response.status_code == 401
            details = f"Status: {response.status_code} (expected 401)"
            self.log_test("Auth Me (No Session)", success, details)
            
            return success
        except Exception as e:
            self.log_test("Auth Me (No Session)", False, f"Error: {str(e)}")
            return False

    def test_like_bookmark_status_without_auth(self, article):
        """Test like/bookmark status endpoints without authentication"""
        if not article:
            self.log_test("Like/Bookmark Status (No Auth)", False, "No article provided")
            return False
        
        article_id = article.get('article_id')
        if not article_id:
            self.log_test("Like/Bookmark Status (No Auth)", False, "No article_id found")
            return False
        
        success_count = 0
        endpoints = [
            (f"articles/{article_id}/like-status", "Like Status"),
            (f"articles/{article_id}/bookmark-status", "Bookmark Status")
        ]
        
        for endpoint, name in endpoints:
            try:
                response = self.session.get(f"{self.base_url}/{endpoint}", timeout=10)
                success = response.status_code == 200
                details = f"Status: {response.status_code}"
                if success:
                    data = response.json()
                    details += f", Response: {data}"
                    success_count += 1
                self.log_test(f"{name} (No Auth)", success, details)
            except Exception as e:
                self.log_test(f"{name} (No Auth)", False, f"Error: {str(e)}")
        
        return success_count == len(endpoints)

    def test_comments_endpoint(self, article):
        """Test comments endpoint"""
        if not article:
            self.log_test("Get Comments", False, "No article provided")
            return False
        
        article_id = article.get('article_id')
        if not article_id:
            self.log_test("Get Comments", False, "No article_id found")
            return False
        
        try:
            response = self.session.get(f"{self.base_url}/articles/{article_id}/comments", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}, Article ID: {article_id}"
            if success:
                comments = response.json()
                details += f", Comments count: {len(comments)}"
            self.log_test("Get Comments", success, details)
            return success
        except Exception as e:
            self.log_test("Get Comments", False, f"Error: {str(e)}")
            return False

    def test_search_api(self):
        """Test search API with different queries and filters"""
        test_cases = [
            {"q": "méditation", "description": "Search for 'méditation'"},
            {"q": "chat", "description": "Search for 'chat'"},
            {"category": "human", "description": "Filter by human category"},
            {"category": "animal", "description": "Filter by animal category"},
            {"category": "connection", "description": "Filter by connection category"},
            {"tags": "méditation,bien-être", "description": "Filter by tags"}
        ]
        
        success_count = 0
        for case in test_cases:
            try:
                params = {k: v for k, v in case.items() if k != 'description'}
                response = self.session.get(f"{self.base_url}/search", params=params, timeout=10)
                success = response.status_code == 200
                details = f"Status: {response.status_code}, {case['description']}"
                
                if success:
                    results = response.json()
                    details += f", Results: {len(results)}"
                    success_count += 1
                    
                self.log_test(f"Search API - {case['description']}", success, details)
                
            except Exception as e:
                self.log_test(f"Search API - {case['description']}", False, f"Error: {str(e)}")
        
        return success_count > 0

    def test_tags_api(self):
        """Test tags API to get all available tags with counts"""
        try:
            response = self.session.get(f"{self.base_url}/tags", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                tags = response.json()
                details += f", Tags count: {len(tags)}"
                
                # Check structure
                if tags and len(tags) > 0:
                    first_tag = tags[0]
                    if 'tag' in first_tag and 'count' in first_tag:
                        details += f", Sample tag: {first_tag['tag']} ({first_tag['count']})"
                    else:
                        success = False
                        details += ", Missing tag/count structure"
                        
            self.log_test("Tags API", success, details)
            return success
            
        except Exception as e:
            self.log_test("Tags API", False, f"Error: {str(e)}")
            return False

    def test_landing_pages_api(self):
        """Test landing pages API for SEO pages"""
        # Test specific landing pages mentioned in requirements
        test_slugs = [
            "meditation-debutant",
            "sante-chat-senior", 
            "zootherapie-bienfaits"
        ]
        
        success_count = 0
        for slug in test_slugs:
            try:
                response = self.session.get(f"{self.base_url}/landing-pages/{slug}", timeout=10)
                success = response.status_code == 200
                details = f"Status: {response.status_code}, Slug: {slug}"
                
                if success:
                    page = response.json()
                    # Check required fields
                    required_fields = ['title', 'meta_title', 'content_blocks', 'related_articles']
                    has_fields = all(field in page for field in required_fields)
                    
                    if has_fields:
                        details += f", Related articles: {len(page.get('related_articles', []))}"
                        success_count += 1
                    else:
                        success = False
                        details += ", Missing required fields"
                        
                self.log_test(f"Landing Page - {slug}", success, details)
                
            except Exception as e:
                self.log_test(f"Landing Page - {slug}", False, f"Error: {str(e)}")
        
        return success_count == len(test_slugs)

    def test_admin_stats_unauthenticated(self):
        """Test admin stats API without authentication (should return 401)"""
        try:
            response = self.session.get(f"{self.base_url}/admin/stats", timeout=10)
            # Should be 401 unauthorized
            success = response.status_code == 401
            details = f"Status: {response.status_code} (Expected 401 for unauthenticated request)"
            self.log_test("Admin Stats (Unauthenticated)", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Stats (Unauthenticated)", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print(f"\n🔍 Testing Wellness Blog Backend API")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        
        # Test basic connectivity
        if not self.test_health_check():
            print("\n❌ Health check failed - API may be down")
            return False
        
        if not self.test_root_endpoint():
            print("\n❌ Root endpoint failed")
            return False
        
        # Test data seeding
        self.test_seed_data()
        
        # Test article endpoints
        success, articles = self.test_get_articles()
        if not success:
            print("\n❌ Failed to get articles - stopping article tests")
            return False
        
        self.test_get_articles_by_category()
        
        success, article = self.test_get_article_by_slug(articles)
        
        # Test newsletter
        self.test_newsletter_subscription()
        
        # Test auth endpoints
        self.test_auth_endpoints_without_session()
        
        # Test interaction endpoints
        if article:
            self.test_like_bookmark_status_without_auth(article)
            self.test_comments_endpoint(article)
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"Success rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} test(s) failed")
            return False

def main():
    tester = WellnessBlogAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'total_tests': tester.tests_run,
                'passed_tests': tester.tests_passed,
                'success_rate': (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0,
                'timestamp': datetime.now().isoformat()
            },
            'detailed_results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())