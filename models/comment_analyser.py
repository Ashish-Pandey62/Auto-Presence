from typing import Dict, List, Tuple
from dataclasses import dataclass
import re
from transformers import pipeline

@dataclass
class CommentAnalysis:
    category: str
    sentiment: str
    is_question: bool
    confidence: float
    context_mentions: Dict[str, List[str]]

class CommentAnalyzer:
    def __init__(self):
        self.sentiment_classifier = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
            device=-1  # Force CPU usage
        )
        self.category_classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",
            device=-1  # Force CPU usage
        )
        
        self.categories = ["price", "quality", "other"]
        self.sentiments = ["positive", "negative", "neutral"]
        
        # Context keywords for each category
        self.context_keywords = {
            "price": ["price", "cost", "expensive", "cheap", "worth", "value", "money", "afford", "dollars", "pricing"],
            "quality": ["quality", "durability", "performance", "reliable", "broke", "works", "working", "broken", "condition", "build"],
            "shipping": ["shipping", "delivery", "shipment", "arrived", "package", "tracking"],
            "service": ["service", "customer service", "support", "help", "response", "contact"],
            "features": ["feature", "specification", "specs", "capabilities", "functions", "options"]
        }
        
        self.reset_counters()

    def reset_counters(self):
        """Reset all counters to initial state"""
        self.category_sentiment_counts = {
            category: {sentiment: 0 for sentiment in self.sentiments}
            for category in self.categories
        }
        self.total_sentiment_counts = {sentiment: 0 for sentiment in self.sentiments}
        self.question_counts = {
            "total": 0,
            "categories": {category: 0 for category in self.categories}
        }
        self.context_counts = {
            context: {"mentions": 0, "examples": []} 
            for context in self.context_keywords.keys()
        }
    
    def detect_question(self, text: str) -> bool:
        """
        Detect if the text is a question/inquiry
        """
        # Check for question marks
        if "?" in text:
            return True
        
        # Check for question words at the start
        question_starters = ["what", "when", "where", "who", "why", "how", "can", "could", "would", "is", "are", "does"]
        words = text.lower().split()
        if words and words[0] in question_starters:
            return True
            
        return False

    def get_context_snippet(self, words: List[str], keyword_index: int) -> str:
        """Extract context snippet around the keyword"""
        start = max(0, keyword_index - 5)
        end = min(len(words), keyword_index + 6)
        return " ".join(words[start:end])

    def find_context_mentions(self, text: str) -> Dict[str, List[str]]:
        """Find mentions of different contexts in the text"""
        text_lower = text.lower()
        words = text_lower.split()
        mentions = {category: [] for category in self.context_keywords.keys()}
        
        for category, keywords in self.context_keywords.items():
            for keyword in keywords:
                # Find all occurrences of the keyword
                keyword_indices = [i for i, word in enumerate(words) if keyword in word]
                
                # If keyword is found, add the context
                for idx in keyword_indices:
                    context = self.get_context_snippet(words, idx)
                    if context and context not in mentions[category]:
                        mentions[category].append(context)
        
        return mentions

    def analyze_comment(self, comment: str) -> CommentAnalysis:
        """Analyze a single comment for category, sentiment, and question detection"""
        # Detect if it's a question
        is_question = self.detect_question(comment)
        
        # Find context mentions
        context_mentions = self.find_context_mentions(comment)
        
        # Category classification
        category_labels = [
            "price, cost, expense, value for money",
            "product quality, durability, performance",
            "shipping, customer service, general feedback"
        ]
        category_result = self.category_classifier(comment, candidate_labels=category_labels)
        
        # Determine category based on confidence
        top_score = category_result["scores"][0]
        if top_score < 0.4:
            category = "other"
        else:
            if "price" in category_result["labels"][0]:
                category = "price"
            elif "quality" in category_result["labels"][0]:
                category = "quality"
            else:
                category = "other"
        
        # Modified sentiment analysis to handle questions
        if is_question:
            sentiment = 'neutral'
            score = 1.0
        else:
            # Original sentiment analysis logic for non-questions
            sentiment_result = self.sentiment_classifier(comment)[0]
            score = sentiment_result['score']
            label = sentiment_result['label'].lower()
            
            if label == 'positive':
                sentiment = 'positive' if score > 0.75 else 'neutral'
            else:
                sentiment = 'negative' if score > 0.75 else 'neutral'
            
        return CommentAnalysis(
            category=category,
            sentiment=sentiment,
            is_question=is_question,
            confidence=score,
            context_mentions=context_mentions
        )
    
    def process_comments(self, user_data: List[Dict]) -> Dict:
        """Process all comments and return comprehensive analysis"""
        self.reset_counters()
        
        for user in user_data:
            comment = user['comments']
            analysis = self.analyze_comment(comment)
            
            # Update basic counters
            self.category_sentiment_counts[analysis.category][analysis.sentiment] += 1
            self.total_sentiment_counts[analysis.sentiment] += 1
            
            # Update question counters
            if analysis.is_question:
                self.question_counts["total"] += 1
                self.question_counts["categories"][analysis.category] += 1
            
            # Update context counters
            for context, mentions in analysis.context_mentions.items():
                if mentions:
                    self.context_counts[context]["mentions"] += len(mentions)
                    # Only keep unique examples
                    for mention in mentions[:2]:  # Keep only up to 2 examples
                        if mention not in self.context_counts[context]["examples"]:
                            self.context_counts[context]["examples"].append(mention)
        
        return {
            'category_sentiment_counts': self.category_sentiment_counts,
            'total_sentiment_counts': self.total_sentiment_counts,
            'question_counts': self.question_counts,
            'context_counts': self.context_counts
        }
    
    def get_summary_report(self) -> str:
        """Generate a comprehensive summary report"""
        total_comments = sum(self.total_sentiment_counts.values())
        total_questions = self.question_counts["total"]
        
        report = [f"Analysis of {total_comments} comments:\n"]
        
        # Question Statistics
        report.append(f"Questions/Inquiries Analysis:")
        report.append(f"  - Total Questions: {total_questions} ({(total_questions/total_comments*100):.1f}% of all comments)")
        for category in self.categories:
            cat_questions = self.question_counts["categories"][category]
            if cat_questions > 0:
                report.append(f"  - {category.title()} Questions: {cat_questions}")
        
        # Context Mentions Analysis
        report.append("\nContext Analysis:")
        for context, data in self.context_counts.items():
            if data["mentions"] > 0:
                report.append(f"\n{context.title()} Mentions: {data['mentions']}")
                if data["examples"]:
                    report.append("  Example contexts:")
                    for example in data["examples"][:2]:
                        report.append(f"    - \"{example}\"")
        
        # Overall Sentiment Statistics
        report.append("\nOverall Sentiment Analysis:")
        for sentiment in self.sentiments:
            count = self.total_sentiment_counts[sentiment]
            percentage = (count / total_comments * 100) if total_comments > 0 else 0
            report.append(f"  - Total {sentiment.title()}: {count} ({percentage:.1f}%)")
        
        # Category Breakdown
        report.append("\nBreakdown by Category:")
        for category in self.categories:
            category_total = sum(self.category_sentiment_counts[category].values())
            if category_total > 0:
                report.append(f"\n{category.title()} Comments ({category_total}):")
                for sentiment in self.sentiments:
                    count = self.category_sentiment_counts[category][sentiment]
                    percentage = (count / category_total * 100) if category_total > 0 else 0
                    report.append(f"  - {sentiment.title()}: {count} ({percentage:.1f}%)")
        
        return "\n".join(report)

# Example usage with diverse comments including questions
if __name__ == "__main__":
    user_data = [
        {"comments": "What's the price of this product?"},                         # Price question
        {"comments": "How durable is this product?"},                             # Quality question
        {"comments": "Great value for the money, really worth every penny!"},      # Price positive
        {"comments": "The quality is terrible, it broke after a week"},            # Quality negative
        {"comments": "When will my order arrive?"},                               # Shipping question
        {"comments": "Does this come with a warranty?"},                          # Service question
        {"comments": "Too expensive for what you get"},                           # Price negative
        {"comments": "Customer service never responded to my emails"},             # Service negative
        {"comments": "Can you explain the features?"},                            # Features question
        {"comments": "The delivery was delayed but the product works fine"},
        {"comments": "What's the price of this product?"},                         # Price question
        {"comments": "How durable is this product?"},                             # Quality question
        {"comments": "Great value for the money, really worth every penny!"},      # Price positive
        {"comments": "The quality is terrible, it broke after a week"},            # Quality negative
        {"comments": "When will my order arrive?"},                               # Shipping question
        {"comments": "Does this come with a warranty?"},                          # Service question
        {"comments": "Too expensive for what you get"},                           # Price negative
        {"comments": "Customer service never responded to my emails"},             # Service negative
        {"comments": "Can you explain the features?"},                            # Features question
        {"comments": "The delivery was delayed but the product works fine"},
        {"comments": "What's the price of this product?"},                         # Price question
        {"comments": "How durable is this product?"},                             # Quality question
        {"comments": "Great value for the money, really worth every penny!"},      # Price positive
        {"comments": "The quality is terrible, it broke after a week"},            # Quality negative
        {"comments": "When will my order arrive?"},                               # Shipping question
        {"comments": "Does this come with a warranty?"},                          # Service question
        {"comments": "Too expensive for what you get"},                           # Price negative
        {"comments": "Customer service never responded to my emails"},             # Service negative
        {"comments": "Can you explain the features?"},                            # Features question
        {"comments": "The delivery was delayed but the product works fine"},
        {"comments": "Great value for the money, really worth every penny!"},           # Price positive
        {"comments": "The quality is terrible, it broke after a week"},                 # Quality negative
        {"comments": "Shipping was really fast and packaging was excellent"},           # Other positive
        {"comments": "Customer service never responded to my emails"},                  # Other negative
        {"comments": "Product arrived damaged due to poor packaging"},                  # Other negative
        {"comments": "Too expensive for what you get"},                                # Price negative
        {"comments": "Average product, nothing special about it"},                      # Quality neutral
        {"comments": "The delivery was delayed but the product works fine"},
        {"comments": "Absolutely love the cost-effectiveness of this product!"},  # Positive price
    {"comments": "Poor construction, started falling apart quickly."},        # Negative quality
    {"comments": "Quick delivery, though it costs more than I expected."},    # Neutral/Negative price
    {"comments": "The craftsmanship is top-notch, worth every cent!"},        # Positive quality
    {"comments": "This item is not worth the high price tag."},               # Negative price
    {"comments": "You get a lot for what you pay, fantastic deal!"},          # Positive price
    {"comments": "Material feels cheap and not durable."},                    # Negative quality
    {"comments": "Pricey, but the shipping speed made up for it."},           # Neutral/Negative price
    {"comments": "Superior quality, makes it a great buy!"},                  # Positive quality
    {"comments": "Overpriced for the mediocre features offered."},            # Negative price
    {"comments": "Money well spent, the product meets all my expectations."}, # Positive price
    {"comments": "Started malfunctioning within a month, not quality work."}, # Negative quality
    {"comments": "Costly for its standard, but arrived quicker than expected."}, # Neutral/Negative price
    {"comments": "Impressive quality at this price point!"},                  # Positive quality
    {"comments": "Too pricey for the quality or lack thereof."},              # Negative price
    {"comments": "Great bargain, highly recommend this purchase!"},           # Positive price
    {"comments": "Disappointed with the build, expected better."},            # Negative quality
    {"comments": "Fast shipping, but not sure if it justifies the price."},   # Neutral/Negative price
    {"comments": "Exceptional quality, will definitely buy again!"},          # Positive quality
    {"comments": "Not the best value, feels overpriced."} ,
    {"comments": "How long does the warranty last for this product?"},  # Other information
    {"comments": "Are there any color options available?"},             # Other information
    {"comments": "Is this product compatible with Android devices?"},   # Other information
    {"comments": "Can you explain the return policy for online purchases?"},  # Other information
    {"comments": "Does this item come with any accessories?"},          # Other information
    {"comments": "Is this model environmentally friendly or made with sustainable materials?"},  # Other information
    {"comments": "What are the dimensions of this product?"},           # Other information
    {"comments": "Can this be shipped internationally?"},               # Other information
    {"comments": "Is there a newer version of this product coming out soon?"},  # Other information
    {"comments": "What is the estimated delivery time for this item?"},# Mixed context,
    {"comments": "Delivery time for this item was very slow"}# Mixed context
    ]
    
    # Initialize and run analysis
    analyzer = CommentAnalyzer()
    results = analyzer.process_comments(user_data)
    
    # Print summary report
    print(analyzer.get_summary_report())