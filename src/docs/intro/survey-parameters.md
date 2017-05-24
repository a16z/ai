# How We Picked Our Examples

The good news is that there are hundreds of products, cloud services, frameworks, libraries and other tools that will help you add AI to your software. This makes curating a list to present in a short introductory text like this a challenge.

Here's how we picked our examples. First, we wanted to survey the most popular offerings, letting the wisdom of the crowd do the first rough sort. Next, we mostly chose cloud services over software that you'd run on premise. We believe most people will begin their AI journeys using cloud services rather than creating and managing million-node neural networks in their own data centers. Even if you eventually outgrow a publicly available AI cloud service, your experience using it will help inform the design and scaling of your own AI infrastructure. Finally, we picked a few products from startups and the open source community so that you can compare and contrast results from the big public cloud providers.

## Our Deployment Platform

Since one of our goals was to be able to show live examples, we needed a deployment platform. For that purpose we chose [Heroku](http://www.heroku.com), as a "neutral" provider of cloud runtime services. Other providers (e.g. Google, Microsoft, Amazon, IBM) also have their own AI/ML APIs and services and support different (usually easier) integrations between these services and their own platforms. Using a separate 3rd party service puts everyone on a level playing field.

Additionally, Heroku supports multiple languages and has a free tier, which should allow people to clone, fork and run this project easily. To encourage cloning and forking, we chose the [very permissive MIT License](https://opensource.org/licenses/MIT).

We're not recommending any specific product over another. Our portfolio companies have had success with all of the products we mention. Our goals are to share what's possible and to encourage others to experiment--and do the same.

## Code Samples

The first few examples don't require you to understand programming at all, though being able to read [JSON](http://www.json.org/) is handy. Even if you've never done that before, JSON is written to be "easy for humans to read and write" so you'll pick it up along the way.

Where we do provide code samples, we offer them in JavaScript on Node.js. Please put away your pitchforks. The great news about consuming AI services is that most library providers support the language you (or your engineers) prefer, whether that's Python, Scala, Go, C++, Swift, Java, Haskell, or name-your-favorite-language-here.

For CSS and styles we will use [Bootstrap](http://getbootstrap.com) version 3. We aimed for a straightforward, practical design that would work well in mobile devices.

## Further Things to Evaluate When You Start Paying For Services

If we inspire you to try adding some AI to your own software (and we hope we do!), here are a few criteria to consider in selecting paid services:

* **Try a cloud service first**. For the same reason SaaS is easier to get started with compared to on-premise software, try a hosted service first. Only when you discover that it doesn't do what you want or its accuracy with your data set is where you need it to be should you deploy your own infrastructure (e.g. by building a [Tensorflow](https://www.tensorflow.org/) or [Apache Singa](https://singa.incubator.apache.org)) cluster. Additionally, in every case cloud-hosted solutions are backed by open-source projects. If you feel you have outgrown the hosted Tensorflow provided by Google (for example) you can move on to deploy your own.

* **Focus on solutions that don't require a significant operational commitment**. Does the solution require you to manage the details of the service, or is it maintained and scaled for you? Do you need monitoring for it? When implementing a pilot program or a small scale test, these are important points. The less you have to worry about, the better.

* **Consider SLAs, constraints and limitations**. Do the solutions provide any kind of SLAs? What are the costs/constraints involved?

* **Data ownership and lock-in**. This is an important item. Make sure you understand who owns the data and whether the company providing a service is using your data in a way you are comfortable with. Are they using it to train models that they would then offer to your competitors? What happens if they decide to stop offering their service? What happens with your models? How do you get your data sets and trained models off the service?

* **Price & Terms**. Pay attention not only to the "getting started" plans, but understand the pricing at scale. Does that makes sense for your business given that your own product has a price point and a cost of sales? Can you start free or small and grow? Or are you forced to talk to a sales rep to run a "Hello World" app?

* **Project activity & relevance**. How actively is a product, commercial or open source, being developed? In either case, take a quick look at [StackOverflow](http://www.stackoverflow.com/) to gauge the activity around it. For open source projects, check out the [Github](http://www.github.com/) activity and be wary of projects with few contributors, forks, or stars. How important is a particular service to the company that's offering it? For startups, developer success on their API might be life or death. On the other hand, a big company might easily decide to discontinue support for an API if it's not strategic to them.

With all the preliminaries behind us, let's get cooking.
