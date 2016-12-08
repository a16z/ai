# Survey Parameters

Throughout the survey we will focus on technologies and techniques and not on specific solutions or systems. For examples, we will prefer cloud-based solutions. This is not just because they are easier to use for common examples/use cases but also because that very focus makes it easier to get started for people new to these areas.

## To Cloud or Not To Cloud?

Additionally, we believe that in the vast majority of cases you _would not_ be creating your own thousand-node neural network within your own infrastructure. For other types of services this may be less common, but AI/ML is not common. Services already provided by companies (most big, some small) can cover those needs, and eventually, should you need so much computing power/storage/memory/etc you'll need to do a custom deployment of a distributed processing system of high complexity.

Those cases are rare, however, and a DIY deployment should _not_ be the starting point when thinking about implementing AI or ML in your company. Unless your particular advantage or innovation lies in your AI layer, or specific techniques that are not yet public, you will almost invariably be better off by using the platforms that already exist, perhaps by themselves or in combination.

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

We selected JavaScript and Node.js as language and platform respectively.

Put away your pitchforks! Please.

We absolutely understand JS/Node.js has its fans as well as its detractors (one needs only to look at the [ES6 Compat Table](https://kangax.github.io/compat-table/es6/) to go a little nuts), and sometimes someone can be both! What's undeniable is that JavaScript is both universally available in both clients and servers as well as being fairly well known.

We love Python, Scala, Go, C, Swift, Java, Haskell, ML, Prolog, APL (well, maybe not APL.) and many other languages and environments but for most of the sample code here we'll use JavaScript.

For CSS and styles we will use [Bootstrap](http://getbootstrap.com) version 3. This choice is also almost certainly controversial for many reasons, but hopefully we'll get over that too.

## Runtime

For runtime platform we chose [Heroku](http://www.heroku.com), as a "neutral" provider of cloud runtime services. Other providers (e.g. Google, Microsoft, Amazon) also have their own AI/ML APIs and services and support different (usually easier) integrations between these services and their own platforms. Using a separate 3rd party service puts everyone on a level playing field.

Additionally, Heroku supports multiple languages and has a free tier, which will allow people to clone, fork and run this project without problems if needed.

Once again -- with all of these caveats, if there's something you feel we should take a look at, please don't hesitate to [contact us](/contact).
