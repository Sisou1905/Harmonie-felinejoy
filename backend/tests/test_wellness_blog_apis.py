"""
Backend API Tests for Harmonie Féline & Humaine Blog
Tests the core endpoints: health, articles, newsletter, landing pages
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://wellness-hub-693.preview.emergentagent.com')

class TestHealthEndpoint:
    """Health check endpoint tests"""
    
    def test_health_check(self):
        """Test that the health endpoint returns status healthy"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("SUCCESS: Health check returned healthy status")

    def test_root_endpoint(self):
        """Test that the root API endpoint returns message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"SUCCESS: Root endpoint returned: {data['message']}")


class TestArticlesAPI:
    """Article CRUD endpoint tests"""
    
    def test_get_all_articles(self):
        """Test fetching all articles"""
        response = requests.get(f"{BASE_URL}/api/articles")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"SUCCESS: Retrieved {len(data)} articles")
        
        # Verify article structure if articles exist
        if len(data) > 0:
            article = data[0]
            assert "article_id" in article
            assert "title" in article
            assert "slug" in article
            assert "category" in article
            print(f"SUCCESS: Article structure verified - first article: {article['title'][:50]}...")

    def test_get_articles_by_category_human(self):
        """Test fetching articles filtered by human category"""
        response = requests.get(f"{BASE_URL}/api/articles?category=human")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Verify all returned articles are human category
        for article in data:
            assert article["category"] == "human"
        print(f"SUCCESS: Retrieved {len(data)} human wellness articles")

    def test_get_articles_by_category_animal(self):
        """Test fetching articles filtered by animal category"""
        response = requests.get(f"{BASE_URL}/api/articles?category=animal")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for article in data:
            assert article["category"] == "animal"
        print(f"SUCCESS: Retrieved {len(data)} animal wellness articles")

    def test_get_articles_by_category_connection(self):
        """Test fetching articles filtered by connection category"""
        response = requests.get(f"{BASE_URL}/api/articles?category=connection")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for article in data:
            assert article["category"] == "connection"
        print(f"SUCCESS: Retrieved {len(data)} connection articles")

    def test_get_single_article_by_slug(self):
        """Test fetching single article by slug"""
        # First get all articles to find a valid slug
        articles_response = requests.get(f"{BASE_URL}/api/articles")
        articles = articles_response.json()
        
        if len(articles) > 0:
            slug = articles[0]["slug"]
            response = requests.get(f"{BASE_URL}/api/articles/{slug}")
            assert response.status_code == 200
            data = response.json()
            assert data["slug"] == slug
            print(f"SUCCESS: Retrieved article by slug: {slug}")
        else:
            pytest.skip("No articles available for testing")

    def test_get_nonexistent_article(self):
        """Test 404 response for non-existent article"""
        response = requests.get(f"{BASE_URL}/api/articles/nonexistent-article-slug-xyz123")
        assert response.status_code == 404
        print("SUCCESS: Non-existent article returns 404")


class TestNewsletterAPI:
    """Newsletter subscription endpoint tests"""
    
    def test_subscribe_newsletter_success(self):
        """Test successful newsletter subscription"""
        test_email = f"test_newsletter_{os.urandom(4).hex()}@example.com"
        response = requests.post(
            f"{BASE_URL}/api/newsletter",
            json={"email": test_email},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["email"] == test_email
        print(f"SUCCESS: Newsletter subscription worked for {test_email}")

    def test_subscribe_newsletter_duplicate(self):
        """Test duplicate newsletter subscription returns already subscribed"""
        test_email = "duplicate_test@example.com"
        
        # First subscription
        requests.post(
            f"{BASE_URL}/api/newsletter",
            json={"email": test_email},
            headers={"Content-Type": "application/json"}
        )
        
        # Second subscription (duplicate)
        response = requests.post(
            f"{BASE_URL}/api/newsletter",
            json={"email": test_email},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "Already subscribed" in data.get("message", "")
        print("SUCCESS: Duplicate subscription handled correctly")

    def test_subscribe_newsletter_invalid_email(self):
        """Test newsletter subscription with invalid email"""
        response = requests.post(
            f"{BASE_URL}/api/newsletter",
            json={"email": "not-an-email"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422  # Validation error
        print("SUCCESS: Invalid email rejected with 422")


class TestLandingPagesAPI:
    """Landing pages SEO endpoint tests"""
    
    def test_get_all_landing_pages(self):
        """Test fetching all landing pages"""
        response = requests.get(f"{BASE_URL}/api/landing-pages")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        print(f"SUCCESS: Retrieved {len(data)} landing pages")

    def test_get_meditation_landing_page(self):
        """Test fetching meditation debutant landing page"""
        response = requests.get(f"{BASE_URL}/api/landing-pages/meditation-debutant")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == "meditation-debutant"
        assert "meta_title" in data
        assert "meta_description" in data
        assert "content_blocks" in data
        print(f"SUCCESS: Meditation landing page retrieved - title: {data['meta_title'][:50]}...")

    def test_get_chat_senior_landing_page(self):
        """Test fetching sante chat senior landing page"""
        response = requests.get(f"{BASE_URL}/api/landing-pages/sante-chat-senior")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == "sante-chat-senior"
        assert "hero_title" in data
        assert "hero_subtitle" in data
        print(f"SUCCESS: Chat senior landing page retrieved")

    def test_get_zootherapie_landing_page(self):
        """Test fetching zootherapie bienfaits landing page"""
        response = requests.get(f"{BASE_URL}/api/landing-pages/zootherapie-bienfaits")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == "zootherapie-bienfaits"
        print(f"SUCCESS: Zootherapie landing page retrieved")

    def test_get_nonexistent_landing_page(self):
        """Test 404 for non-existent landing page"""
        response = requests.get(f"{BASE_URL}/api/landing-pages/nonexistent-page")
        assert response.status_code == 404
        print("SUCCESS: Non-existent landing page returns 404")


class TestSearchAPI:
    """Search endpoint tests"""
    
    def test_search_articles(self):
        """Test article search functionality"""
        response = requests.get(f"{BASE_URL}/api/search?q=meditation")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"SUCCESS: Search returned {len(data)} results for 'meditation'")

    def test_search_with_category_filter(self):
        """Test search with category filter"""
        response = requests.get(f"{BASE_URL}/api/search?category=human")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for article in data:
            assert article["category"] == "human"
        print(f"SUCCESS: Search with category filter returned {len(data)} human articles")


class TestTagsAPI:
    """Tags endpoint tests"""
    
    def test_get_all_tags(self):
        """Test fetching all tags"""
        response = requests.get(f"{BASE_URL}/api/tags")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            assert "tag" in data[0]
            assert "count" in data[0]
        print(f"SUCCESS: Retrieved {len(data)} tags")


class TestAuthProtectedEndpoints:
    """Test that protected endpoints require authentication"""
    
    def test_admin_stats_requires_auth(self):
        """Test admin stats endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 401
        print("SUCCESS: Admin stats protected with 401")

    def test_admin_subscribers_requires_auth(self):
        """Test admin newsletter subscribers requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/newsletter/subscribers")
        assert response.status_code == 401
        print("SUCCESS: Admin newsletter subscribers protected with 401")

    def test_admin_pending_comments_requires_auth(self):
        """Test admin pending comments requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/comments/pending")
        assert response.status_code == 401
        print("SUCCESS: Admin pending comments protected with 401")

    def test_create_comment_requires_auth(self):
        """Test creating comment requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/comments",
            json={"article_id": "test", "content": "test comment"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 401
        print("SUCCESS: Comment creation protected with 401")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
