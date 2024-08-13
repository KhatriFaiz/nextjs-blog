import { Button } from "./ui/button";
import { Input } from "./ui/input";

const HeroSection = () => {
  return (
    <section className="mt-20">
      <div className="py-24 max-w-screen-lg mx-auto">
        <h1 className="text-center text-7xl font-semibold flex flex-col gap-2">
          <span className="block">
            Dive into{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-pink-600">
              Deep End
            </span>
          </span>
          <span className="block">
            Ignite Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-pink-600">
              Imagination
            </span>
          </span>
        </h1>
        <p className="text-center mt-6">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium
          eligendi, corporis eaque dolorum expedita mollitia et molestiae culpa
          in, delectus tempora dicta voluptatum at vero adipisci? Deserunt
          mollitia voluptatem dolorum.
        </p>
        <div className="flex justify-center mt-12">
          <div className="flex gap-3 w-full max-w-md">
            <Input placeholder="Enter your email" />
            <Button bg="gradient">Subscribe</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
