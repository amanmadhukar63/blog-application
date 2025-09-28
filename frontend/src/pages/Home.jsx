import React from 'react';
import { Link } from 'react-router-dom';
import { Edit3, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const Home = () => {
  return (
    <div className="h-[70vh]">
      <section className="h-full py-12 md:py-20 px-4">
        <div className="h-full container mx-auto flex flex-col justify-between">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6">
              Share Your Stories with the World
            </h1>
            <p className="text-md md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl w-4/5 mx-auto">
              Create, publish, and discover amazing blog posts. Join our community of writers and readers.
            </p>
          </div>
          
          <div className="flex flex-col items-center sm:flex-row gap-3 md:gap-4 justify-center">
            <Button size="lg" className="w-2/3 sm:w-auto shadow-xl">
              <Link to="/explore" className='flex items-center'>
                Explore Blogs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-2/3 sm:w-auto shadow-xl">
              <Link to="/create-blog" className='flex items-center'>
                Start Writing
                <Edit3 className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
