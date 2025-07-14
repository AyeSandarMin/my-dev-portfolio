
const About = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6 lg:px-12 py-20">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">About Me</h1>
        
        <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error nulla
            sed eius omnis quisquam dolorem ullam, neque, magni harum voluptates
            sapiente! Ut in eveniet minima eius maiores ipsum, veritatis tempore!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error nulla
            sed eius omnis quisquam dolorem ullam, neque, magni harum voluptates
            sapiente! Ut in eveniet minima eius maiores ipsum, veritatis tempore!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error nulla
            sed eius omnis quisquam dolorem ullam, neque, magni harum voluptates
            sapiente! Ut in eveniet minima eius maiores ipsum, veritatis tempore!
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
            <span className="text-2xl font-bold text-blue-600">5+</span>
            <p className="text-sm text-gray-500">Years Experience</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
            <span className="text-2xl font-bold text-purple-600">100+</span>
            <p className="text-sm text-gray-500">Projects</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
            <span className="text-2xl font-bold text-green-600">50+</span>
            <p className="text-sm text-gray-500">Happy Clients</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
