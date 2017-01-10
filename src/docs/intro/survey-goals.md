# Survey Parameters

## Target Audience

The target audience for this survey includes people who have technical knowledge but are not necessarily on the bleeding edge of technology. Some examples:

* A software developer trying to get an understanding of the basic choices and solutions one can take to approach this space when starting a new project that will involve these technologies
* A technical product manager that has heard that Machine Learning could help improve the product she is responsible for but doesn’t have the time to go through all the options
* A data scientist looking to leverage existing data sets to arrive at new, useful insights

## To Cloud or Not To Cloud?

Additionally, we believe that in the vast majority of cases you _would not_ be creating your own million-node neural network within your own infrastructure. In the age of cloud computing this is already less common than it used to be, but it’s still frequent to find services and systems that are packaged for deployment to AWS or similar.

In the case of AI/ML, services already provided by companies (most big, some small) can cover basic needs needs, and eventually, should you need so much computing power/storage/memory/etc you'll need to do a custom deployment of a distributed processing system of high cost, high complexity, or both.

Those cases are rare, however, and as a general rule a DIY deployment should _not_ be the starting point when thinking about implementing AI or ML in your company or product. Unless your particular advantage or innovation lies in your AI layer, or specific techniques that are not yet public, you will almost invariably be better off by using the platforms that already exist, perhaps by themselves — or in combination.

## Key Items

The paragraphs above should already give you an idea of what parameters we used to choose services & platforms to cover. We also used the following list to select the services we'd choose and how we'd evaluate them.

* _Focus on hosted solutions_. Cloud-based, fully hosted services were favored for a simple reason: the people that would and could deploy their own infrastructure (e.g. directly using [Tensorflow](https://www.tensorflow.org/) or [Apache Singa](https://singa.incubator.apache.org)) would also be less likely to find something immediately useful in this survey.

Additionally, in every case cloud-hosted solutions are backed by open-source projects. If you feel you have outgrown the hosted Tensorflow provided by Google (for example) you can move on to deploy your own.

* _Focus on solutions that don't require a significant operational commitment_. Does the solution require you to manage the details of the service, or is it maintained and scaled for you? Do you need monitoring for it? When implementing a pilot program or a small scale test, these are important points. The less you have to worry about, the better.

* _Consider SLAs, constraints and limitations_. Do the solutions provide any kind of SLAs? What are the costs/constraints involved?

* _Data Control & Access_. This is an important item. It involves ownership and access of data, privacy issues, backups, exports, etc. For example, if Google stops supporting TensorFlow tomorrow, do you lose everything? What is recoverable? Who "owns" the training set, data, etc?

* _Price & Terms_. Not just for the product, but in terms of evolution. Can you start free or small and grow? Or are you forced to talk to a sales rep to run a Hello World app?

* _Project activity & relevance_. How actively is it in development? How many resources are being put against it? How crucial is it for the company? E.g. for a startup that only does that it would be critical, for IBM it may be a drop in a bucket, and therefore have fewer resources against it.

## Language/Platform

We selected JavaScript and Node.js as language and runtime platform respectively.

Ok, ok. Put away your pitchforks! Please.

We absolutely understand JS/Node.js has its fans as well as its detractors (one needs only to look at the [ES6 Compatibility Table](https://kangax.github.io/compat-table/es6/) to go a little nuts), and sometimes someone can be both! What's undeniable is that JavaScript is both universally available in both clients and servers as well as being fairly well known.

We love Python, Scala, Go, C, Swift, Java, Haskell, ML, Prolog, APL (well, maybe not APL) and many other languages and environments but for most of the sample code here we'll use JavaScript.

For CSS and styles we will use [Bootstrap](http://getbootstrap.com) version 3. We aimed for a straightforward, practical design that would work well in mobile devices.

## Runtime

Since one of our goals was to be able to show live examples, we needed a deployment platform. For that purpose we chose [Heroku](http://www.heroku.com), as a "neutral" provider of cloud runtime services. Other providers (e.g. Google, Microsoft, Amazon) also have their own AI/ML APIs and services and support different (usually easier) integrations between these services and their own platforms. Using a separate 3rd party service puts everyone on a level playing field.

Additionally, Heroku supports multiple languages and has a free tier, which should allow people to clone, fork and run this project easily.

Once again -- with all of these caveats, if there's something you feel we should take a look at, please don't hesitate to [contact us](/contact).

## Structure

The content is divided into sections which are (individually) a relatively quick read.

For details on the survey, you can start with the [survey goals](/docs/intro/survey-goals) and a brief [introduction to AI](/docts/intro/ai).

We have divided content into top-level categories for easier browsing: such as [Natural Language Processing](/docs/guides/nlp), [Vision](/docs/guides/vision), or [Deep Learning](/docs/intro/dl).

Whenever possible we have included live examples throughout the various sections. We also encourage you to fork the github repository and experiment! Most APIs are easy to setup and include free tiers for experimentation.
