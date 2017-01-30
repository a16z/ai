# How We Picked the Products to Survey 

## Target Audience

To pick a representative set of products and services to include, we did a few things. First, we thought about our audience as people who are actively involved in building software:
* A **software developer** trying to get a broad overview of the products and services available
* A **business analyst**, **product manager** or **marketing manager** who has heard that Machine Learning could help improve the product she is responsible for but doesn’t have the time to go through all the options
* A **data scientist** looking to broaden their toolkit from basic statistical techniques to the latest and great AI toolkits
* A **line of business leader** trying to figure out the right way for their organization to put intelligence into their team's software, proceses, and culture  


## Cloud First

Next, we mostly chose cloud services over software that you'd run on premise. We believe most people will begin their AI journeys cloud services rather than creating and managing million-node neural networks in their own data centers. 

Even if you eventually outgrow a publicly available AI cloud service, your experience using the cloud services will help inform the design and scaling of your own AI infrastructure.

We chose a few of the most popular services to include in this survey (as of the time of writing, which was mostly December 2016), but we're well aware this is a fast changing list.

Since one of our goals was to be able to show live examples, we needed a deployment platform. For that purpose we chose [Heroku](http://www.heroku.com), as a "neutral" provider of cloud runtime services. Other providers (e.g. Google, Microsoft, Amazon, IBM) also have their own AI/ML APIs and services and support different (usually easier) integrations between these services and their own platforms. Using a separate 3rd party service puts everyone on a level playing field.

Additionally, Heroku supports multiple languages and has a free tier, which should allow people to clone, fork and run this project easily. To encourage cloning and forking, we chose the [very permissive MIT License](https://opensource.org/licenses/MIT). 

As with any of the other products included in this survey, don't consider their inclusion as an explicit endorsement (or non-endorsement) from a16z. 


## Code Samples

We chose to write our code samples in JavaScript on Node.js. Please put away your pitchforks. The great news about consuming AI services is that most library providers support the language you (or your develoeprs) like whether that's Python, Scala, Go, C++, Swift, Java, Haskell, and so on. 

For CSS and styles we will use [Bootstrap](http://getbootstrap.com) version 3. We aimed for a straightforward, practical design that would work well in mobile devices.


## Further Things to Evaluate When You Start Paying For Services

The paragraphs above should already give you an idea of what parameters we used to choose services & platforms to cover. We also used the following list to select the services we'd choose and how we'd evaluate them.

* _Focus on hosted solutions_. Cloud-based, fully hosted services were favored for a simple reason: the people that would and could deploy their own infrastructure (e.g. directly using [Tensorflow](https://www.tensorflow.org/) or [Apache Singa](https://singa.incubator.apache.org)) would also be less likely to find something immediately useful in this survey.

Additionally, in every case cloud-hosted solutions are backed by open-source projects. If you feel you have outgrown the hosted Tensorflow provided by Google (for example) you can move on to deploy your own.

* _Focus on solutions that don't require a significant operational commitment_. Does the solution require you to manage the details of the service, or is it maintained and scaled for you? Do you need monitoring for it? When implementing a pilot program or a small scale test, these are important points. The less you have to worry about, the better.

* _Consider SLAs, constraints and limitations_. Do the solutions provide any kind of SLAs? What are the costs/constraints involved?

* _Data Control & Access_. This is an important item. It involves ownership and access of data, privacy issues, backups, exports, etc. For example, if Google stops supporting TensorFlow tomorrow, do you lose everything? What is recoverable? Who "owns" the training set, data, etc?

* _Price & Terms_. Not just for the product, but in terms of evolution. Can you start free or small and grow? Or are you forced to talk to a sales rep to run a Hello World app?

* _Project activity & relevance_. How actively is it in development? How many resources are being put against it? How crucial is it for the company? E.g. for a startup that only does that it would be critical, for IBM it may be a drop in a bucket, and therefore have fewer resources against it.







