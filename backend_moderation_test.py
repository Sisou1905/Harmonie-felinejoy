#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class ModerationAPITester:
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

    def test_admin_pending_comments_unauthenticated(self):
        """Test admin pending comments endpoint without authentication (should return 401)"""
        try:
            response = self.session.get(f"{self.base_url}/admin/comments/pending", timeout=10)
            success = response.status_code == 401
            details = f"Status: {response.status_code} (Expected 401 for unauthenticated request)"
            self.log_test("Admin Pending Comments (Unauthenticated)", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Pending Comments (Unauthenticated)", False, f"Error: {str(e)}")
            return False

    def test_comment_moderation_endpoints_unauthenticated(self):
        """Test comment moderation endpoints without authentication"""
        fake_comment_id = "cmt_test123"
        
        endpoints = [
            (f"admin/comments/{fake_comment_id}/approve", "PUT", "Comment Approve"),
            (f"admin/comments/{fake_comment_id}/reject", "PUT", "Comment Reject"),
            (f"admin/comments/{fake_comment_id}", "DELETE", "Comment Delete")
        ]
        
        success_count = 0
        for endpoint, method, name in endpoints:
            try:
                if method == "PUT":
                    response = self.session.put(f"{self.base_url}/{endpoint}", timeout=10)
                elif method == "DELETE":
                    response = self.session.delete(f"{self.base_url}/{endpoint}", timeout=10)
                
                success = response.status_code == 401
                details = f"Status: {response.status_code} (Expected 401)"
                if success:
                    success_count += 1
                self.log_test(f"{name} (Unauthenticated)", success, details)
                
            except Exception as e:
                self.log_test(f"{name} (Unauthenticated)", False, f"Error: {str(e)}")
        
        return success_count == len(endpoints)

    def test_ai_generation_endpoint_unauthenticated(self):
        """Test AI article generation endpoint without authentication"""
        try:
            response = self.session.post(
                f"{self.base_url}/admin/articles/generate",
                json={"topic": "Test Topic", "category": "human", "tone": "informatif"},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            success = response.status_code == 401
            details = f"Status: {response.status_code} (Expected 401 for unauthenticated request)"
            self.log_test("AI Article Generation (Unauthenticated)", success, details)
            return success
        except Exception as e:
            self.log_test("AI Article Generation (Unauthenticated)", False, f"Error: {str(e)}")
            return False

    def test_admin_article_management_unauthenticated(self):
        """Test admin article management endpoints without authentication"""
        endpoints = [
            ("admin/articles", "POST", "Create Article"),
            ("admin/articles/test123", "PUT", "Update Article"),
            ("admin/articles/test123", "DELETE", "Delete Article")
        ]
        
        success_count = 0
        for endpoint, method, name in endpoints:
            try:
                if method == "POST":
                    response = self.session.post(
                        f"{self.base_url}/{endpoint}",
                        json={"title": "Test", "slug": "test", "excerpt": "Test", "content": "Test", "category": "human", "image_url": "http://test.com/test.jpg"},
                        headers={"Content-Type": "application/json"},
                        timeout=10
                    )
                elif method == "PUT":
                    response = self.session.put(
                        f"{self.base_url}/{endpoint}",
                        json={"title": "Test", "slug": "test", "excerpt": "Test", "content": "Test", "category": "human", "image_url": "http://test.com/test.jpg"},
                        headers={"Content-Type": "application/json"},
                        timeout=10
                    )
                elif method == "DELETE":
                    response = self.session.delete(f"{self.base_url}/{endpoint}", timeout=10)
                
                success = response.status_code == 401
                details = f"Status: {response.status_code} (Expected 401)"
                if success:
                    success_count += 1
                self.log_test(f"Admin {name} (Unauthenticated)", success, details)
                
            except Exception as e:
                self.log_test(f"Admin {name} (Unauthenticated)", False, f"Error: {str(e)}")
        
        return success_count == len(endpoints)

    def test_newsletter_management_unauthenticated(self):
        """Test newsletter management endpoints without authentication"""
        endpoints = [
            ("admin/newsletter/subscribers", "GET", "Get Subscribers"),
            ("admin/newsletter/campaigns", "GET", "Get Campaigns"),
            ("admin/newsletter/campaigns", "POST", "Create Campaign")
        ]
        
        success_count = 0
        for endpoint, method, name in endpoints:
            try:
                if method == "GET":
                    response = self.session.get(f"{self.base_url}/{endpoint}", timeout=10)
                elif method == "POST":
                    response = self.session.post(
                        f"{self.base_url}/{endpoint}",
                        json={"subject": "Test Campaign", "content": "Test content"},
                        headers={"Content-Type": "application/json"},
                        timeout=10
                    )
                
                success = response.status_code == 401
                details = f"Status: {response.status_code} (Expected 401)"
                if success:
                    success_count += 1
                self.log_test(f"Newsletter {name} (Unauthenticated)", success, details)
                
            except Exception as e:
                self.log_test(f"Newsletter {name} (Unauthenticated)", False, f"Error: {str(e)}")
        
        return success_count == len(endpoints)

    def test_comments_only_approved_returned(self):
        """Test that comments API returns only approved comments"""
        try:
            # First get an article to test with
            articles_response = self.session.get(f"{self.base_url}/articles", timeout=10)
            if articles_response.status_code != 200:
                self.log_test("Comments Filter Test", False, "Could not get articles")
                return False
            
            articles = articles_response.json()
            if not articles:
                self.log_test("Comments Filter Test", False, "No articles available")
                return False
            
            article_id = articles[0]['article_id']
            
            # Get comments for the article
            response = self.session.get(f"{self.base_url}/articles/{article_id}/comments", timeout=10)
            success = response.status_code == 200
            
            if success:
                comments = response.json()
                # Check that all returned comments have status "approved" if any exist
                all_approved = True
                if comments:
                    for comment in comments:
                        if comment.get('status') != 'approved':
                            all_approved = False
                            break
                    details = f"Status: 200, Comments: {len(comments)}, All approved: {all_approved}"
                else:
                    details = f"Status: 200, Comments: 0 (no comments to check status)"
                
                success = success and (len(comments) == 0 or all_approved)
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Comments Only Approved Returned", success, details)
            return success
            
        except Exception as e:
            self.log_test("Comments Only Approved Returned", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all moderation and admin API tests"""
        print(f"\n🔍 Testing Moderation & Admin APIs")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        
        # Test admin endpoints authentication
        self.test_admin_pending_comments_unauthenticated()
        self.test_comment_moderation_endpoints_unauthenticated()
        self.test_ai_generation_endpoint_unauthenticated()
        self.test_admin_article_management_unauthenticated()
        self.test_newsletter_management_unauthenticated()
        
        # Test comment filtering
        self.test_comments_only_approved_returned()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"Success rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All moderation tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} test(s) failed")
            return False

def main():
    tester = ModerationAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())