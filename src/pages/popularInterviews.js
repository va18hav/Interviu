import google from "../assets/images/google.png";
import amazon from "../assets/images/amazon.png";
import meta from "../assets/images/meta.png";

const popularInterviews = [
    {
        id: 1,
        role: "Google SDE-II",
        name: "Google Software Development Engineer",
        company: "Google",
        icon: google,
        level: "Mid-Level",
        participants: "0",
        rating: 4.8,
        duration: "30 min",
        color: "cyan",
        questions: ["Explain how you would implement a queue data structure and optimize it for specific use cases",
            "Given a stream of data, find the longest consecutive sequence of numbers",
            "Solve a variation of the painter''s partition problem - allocate minimum resources",
            "Implement a solution using dynamic programming involving trees",
            "Design a data structure to handle updates in a data stream and efficiently find max, min, and current values",
            "Optimize a binary tree traversal problem with space-time trade-offs",
            "Solve a medium-level stack problem with multiple edge cases",
            "Implement Dijkstra''s algorithm variation for a graph problem",
            "Find all occurrences of a substring in a larger string - optimize from naive to advanced",
            "Explain the time and space complexity of priority queues and binary trees"
        ]
    },
    {
        id: 2,
        role: "Amazon SDE-III",
        name: "Amazon Software Development Engineer",
        company: "Amazon",
        icon: amazon,
        level: "Senior",
        participants: "0",
        rating: 4.9,
        duration: "45 min",
        color: "blue",
        questions: ["Design a global inventory management system that handles multi-region fault tolerance and consistency",
            "Implement a distributed rate limiter for an API gateway serving millions of requests per second",
            "Design a real-time notification system similar to Amazon SNS with guaranteed delivery",
            "Architect a serverless data pipeline for processing and analyzing clickstream data at scale",
            "Design a caching strategy for a product catalog with billions of items across multiple regions",
            "Implement a solution for handling eventual consistency in a distributed order management system",
            "Design a cost-optimized storage solution for storing and retrieving petabytes of user-generated content",
            "Architect a system to detect and prevent fraudulent transactions in real-time at Amazon scale",
            "Design a microservices architecture for migrating a monolithic e-commerce platform",
            "Implement a distributed lock mechanism for coordinating tasks across multiple services",
            "Design a search and recommendation engine that handles personalization for millions of users",
            "How would you design Amazon Prime Day infrastructure to handle 10x normal traffic?"

        ]
    },
    {
        id: 3,
        role: "Meta Senior Frontend Engineer",
        name: "Meta Senior Frontend Engineer",
        company: "Meta",
        icon: meta,
        level: "Senior",
        participants: "0",
        rating: 4.7,
        duration: "25 min",
        color: "purple",
        questions: ["Build a React component that implements infinite scrolling with virtualization for a news feed",
            "Implement debouncing and throttling from scratch and explain when to use each",
            "Design and implement a custom state management solution similar to Redux",
            "Explain how Virtual DOM works and optimize a React component that re-renders excessively",
            "Build a reusable autocomplete component with keyboard navigation and accessibility features",
            "Implement event delegation in vanilla JavaScript and explain its benefits",
            "Design a frontend architecture for a collaborative real-time editor like Google Docs",
            "Optimize the performance of a React application - discuss code splitting, lazy loading, and memoization",
            "Implement a custom hook for managing complex form state with validation",
            "Explain closures, prototypes, and the this keyword with practical examples",
            "Build a responsive image gallery with lazy loading and smooth animations",
            "Design a scalable frontend system for handling real-time chat with thousands of concurrent users",
            "Implement server-side rendering vs client-side rendering - explain trade-offs and when to use each",
            "Debug and fix a React component that has memory leaks and performance issues"
        ]
    }
];

export default popularInterviews;