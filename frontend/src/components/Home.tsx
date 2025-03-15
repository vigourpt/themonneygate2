import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { Button } from './Button';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to Money Gate</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your all-in-one platform for tool generation, monetization, and keyword research.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Tool Generator</CardTitle>
            <CardDescription>Create powerful tools with our AI-powered generator</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Build custom tools tailored to your specific needs without writing a single line of code.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/tool-generator">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tool Monetization</CardTitle>
            <CardDescription>Turn your tools into revenue streams</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Monetize your created tools through subscriptions, one-time payments, or usage-based pricing.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/tool-monetization">Learn More</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keyword Research</CardTitle>
            <CardDescription>Optimize your tools for discovery</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Find the perfect keywords to help users discover your tools and maximize your reach.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/keyword-research">Explore</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
        <Button size="lg" asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
