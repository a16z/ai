# A Little History
We'll begin with a little history. If you are anxious to get to the practical bits, feel free to skip this section.

For starters, let's just assume artificial intelligence is about making computers smart in the way that we consider each other smart: that is, we can talk and undersatnd each other, we can take take sensory inputs and work out plans to navigate the world, we can manipulate objects and develop complex plans to achieve our goals, and so forth.

Researchers have been trying to endow machines with these human capabilities since antiquity. The Wikipedia article on the [history of artificial intelligence](https://en.wikipedia.org/wiki/History_of_artificial_intelligence) covers some of the early attempts. But most historians would date the beginning of AI as we know it today to the [Dartmouth Summer Research Project on Artificial Intelligence](https://en.wikipedia.org/wiki/Dartmouth_workshop) over the summer of 1956.

In the 60+ years since that kickoff, researchers have tried many different techniques to program computers to mimic human intelligence. To a first approximation, that six-decade history AI divides reasonably well into "Classical AI" from "Modern AI".

In Classical AI, researchers used logical rules to model intelligence. Building AI meant representing the world in a set of data structures (such as trees or lists or sets) and then using rules (such as *and*, *or*, *if-then-else*, and so on) to reason about that knowledge. For example, we could represent language as a set of words, and we could perform machine translation by translating those words from one language to another, and then reordering the words since we know that languages put their nouns and verbs and adjectives in different places. Or we could try to solve vision recognition problems by describing cats as "four legged animals with whiskers" and then decompose that into a set of sub problems (*find legs*, *find whiskers*) and those problems into more detailed problems ('find edges', *separate foreground and background*).

Researchers enjoyed many successes: so many in fact that Marvin Minsky famously said in 1967 that "[within a generation...the problem of creating 'artificial intellignece' will substantically be solved]"(https://en.wikipedia.org/wiki/History_of_artificial_intelligence#cite_note-61)

Unfortunately, efforts based on these approaches eventually failed as widely applicable solutions. They succeeded in niche domains or small problems, or within environments in which the parameters for operation had been highly constrained or painstakingly assembled over long periods of time. But they failed to generalize, either to reliably find all cats versus just some types of cats, or to other cases. Even if you built a fairly good cat detector, that didn't help you build a car detector. Because the niche solutions failed to genearlize, the research community grew so disillsioned that funding and startups would vanish for years at a time in a set of so-called "[AI winters](https://en.wikipedia.org/wiki/AI_winter)."

If Classical AI was about very smart researchers creating rules attempting to understand the world, Modern AI techniques focus on letting computers derive their own "rules" using lots and lots of data. Rather than explicilty telling a computer how to find a cat, we'll just show the computer lots of examples of cats, and see if the computer can construct a cat detector by figuring out what differentiates cats from dogs or muffins or couches or motorcycles.

The Modern AI approach is to get a data set, and then use a set of machine learning techinques with cool names like logistic regression, decision trees, Guassian Naive Bayes, random forest, k-nearest neighbors, or deep learning on that that data set. So the general approach is to we'd gather a bunch of pictures with cats and another set of pictures without cats, and feed enough of these pictures to the algorithms. Given enough data, these machine learning algorithms can do a very good job (in many cases, better than humans) of distinguishing cats from any picture. 

Researchers are excited about the Modern AI approach because it seems to work across many different domains; that is to say, modern AI technqiues such as deep learning seem to be generalizing to solve many different class of problems. For example, page through Jeff Dean's presentation on [Trends and Developments in Deep Learning Research](https://www.slideshare.net/AIFrontiers/jeff-dean-trends-and-developments-in-deep-learning-research) for examples of how Google uses this Modern AI approach in everything from photo recognition to Inbox's Smart Replies to better search to disease diagnosis.  



> Note: For more detailed discussion we recommend the first chapter of Russell & Norvig's _Artificial Intelligence, A Modern Approach, 3rd edition_ entitled "What is AI?"

[---------------------------------------]
[This should be another page]
[---------------------------------------]


# A Definition
Precisely defining artificial intellignece is tricky. John McCarthy proposed that AI is the simulation of human intelligence by machines for the [inaugural summr research project in 1956](https://en.wikipedia.org/wiki/Dartmouth_workshop)? Others have defined AI as the study of [intelligent agents](https://en.wikipedia.org/wiki/Intelligent_agent), human or not, that can perceive their environments and take actions to maximize their chances of achieving some goal. Jerry Kaplan wrestles with the question for an entire chapter in his book [Artificial Intelligence: What Everyone Needs a Know](http://jerrykaplan.com/books/) before giving up on a succinct definition.

Rather than try to define AI precisely, we'll simply differentiate AI's **goals** and **techinques**:
* On the one hand, AI has a set of goals such as recognizing what's in a picture (vision recognition), converting a recording of your voice into the words you meant (natural language processing), or finding the best way to get to grandmother's house (route planning). In this guide, we'll cover natural language processing, vision, and pattern recognition. But there are many goals, including autonomy, knowledge representation, logical reasoning, planning, learning, manipulating objects, classifying documents, and so on. 
* On the other hand, we have a toookit of computer science techniques (think algorithms and data structures) we use in trying to achieve those goals. In this guide, we'll use techniques such as deep learning and supervised learning. There are many other AI techniques, including symbolic computation, search and matheamtical optimziation, probabilisitc techniques, and many others.  

## AI vs ML
Some people use Artificial Intelligence and Machine Learning interchangeably. In this guide, we'll treat Machine Learning as a strict subet of Artificial Intelligence. 
* Machine Learning refers to a broad set of computer science techniques that let give, as Arthur Samuel put it in 1959, "computers the ability to learn without being explicitly programmed." There are many differen types of machine learning algorithms, including reinforcement learning, genetic algorithms, rule-based machine learning, learning classifier systems, and decision trees. The [Wikiepdia article](https://en.wikipedia.org/wiki/Machine_learning) has many more  examples. The current darling of these machine learning algorithms are deep learning algorithms which we'll discuss in detail (as well as code) later in this guide.
* Artificial Intelligence comprises ML techniques, but it also includes other techniques such as search, symbolic reasoning, logical reasoning, statistical techniques that aren't deep learning based, and behavior-based appraoches. 

While deep learning is deservedly enjoying its moment in the sun, we're particularly excited about ensemble technqiues that use a wide variety of machine learning and non-machine learning based approaches to solve problems. Google's AlphaGo program, for instance, uses Monte Carlo tree search in addition to convolutional neural networks (a special type of neural network) to guide the search process. We expect most autonomous driving systems to use traditional search techiqnues for route planning and deep learning for "safe path detection". 

## Strong vs weak AI, or narrow vs deep AI
One other distinction you might see as you continue your AI journey is between hard/soft, strong/weak, and deep/narrow AI. All of them basically distinguish between systems that work in a specific domain (soft, weak, narrow) such as vision recognition and language translation with systems that can genearlize across many specific problems and continuously learn. Google's DeepMind and OpenAI (in general) are working on hard/strong/deep AI. Google Brain (in general) is working on concrete capabilities that make all Google products better (e.g.,  better Inbox Smart Replies, better face and object detection in Google Photos, better search results in Google search, etc.). 
 
==== Probably a different page ====

# Using AI and ML technology in your software

With that in mind, let's give your software some AI superpowers.

The easiest way is to "add AI" is to call an API from your code, whether that API is exposed by a local software library or over the Web.

For example, this line of Python will ask the Clarifai service to predict what objects are in the picture metro-north.jpg:
'' model.predict_by_url(url='https://samples.clarifai.com/metro-north.jpg')

Here's another example. If you call an API that gives you the sentiment of a sentence like so:
'' GET /api/sentiment?phrase=Airplanes+with+the+shape+of+hawks+are+cool
''

Your code will get an answer like this, which means "this is an English sentence which has a positive (rather than negative sentiment) with a "sentiment strength" of 0.6, also on a scale of 0 to 1." Sounds like somone is thinks hawk-shaped airplanes are positive. 

'' {
''     "score": 0.6000000238418579,
''     "magnitude": 0.6000000238418579,
''     "sentences": [
''         {
''             "text": {
''                 "content": "Airplanes with the shape of hawks are cool.",
''                 "beginOffset": -1
''             },
''             "sentiment": {
''                 "magnitude": 0.6000000238418579,
''                 "score": 0.6000000238418579
''             }
''         }
''     ],
''     "language": "en"
'' }

If you application needs to work without an Internet connection, you can embed software libraries to call locally. For example, you can grab the [Stanford CoreNLP toolkit](http://stanfordnlp.github.io/CoreNLP/) to add language processing capabilities to your software, such as "part of speech tagging", which tries to identify where are the nouns, verbs, adjectives, adverbs and so are in your text.

Just as with regular programming, if you can't find a pre-built Web service or library to do what you want, you'll have to create your own special functions. These days, the most popular way to do this is by training a deep learning model with labeled data using something like Tensorflow or Keras or or MXnet. We'll walk through a few examples using a Web service called Clarifai and Google's TensorFlow later in this guide. 

As of this writing (March 2017), high-level APIs are very easy to consume but there aren't very many of them. Low-level APIs which allow you to build your own model are difficult to consume and there is a lot of art using them effectively. But the field is improving quickly and all the major pubic cloud providers (Amazon, Google, IBM) are working hard on making more high-level APIs and improving the tools you use to embed AI capabilities into your own code.  

## API vs. Library vs. SDK

When looking at what different companies/groups provide we will see there’s a lot of different acronyms and frequently overlapping acronyms used. Of these, the most common are:

* **API.** An API (Application Programming Interface) is a set of protocols, functions and definitions for building software. Traditionally an API defined abstractions: expected inputs and outputs for software and was implemented in concrete form in a _library_.
* **Library.** Actual implementation of an API, a library is generally embedded within the code that is using the API, but it may be separate and shared by multiple applications; these are called _dynamic shared libraries_  and are widely used by Operating Systems like Windows and MacOS to provide developers access to different types of services.
* **SDK.** SDKs (Software Development Kits) are generally considered in some way higher level than simply libraries, perhaps including multiple libraries, or different tools to make use of libraries easier, multiple language bindings, or so-called “wrappers” that can hide from programmers some of the complexity involved in using the library, by trading off simplicity for flexibility.

As a starting point, then, we can think of an API is a set of definitions, protocols, functions and capabilities, which are then implemented in one or more libraries which can then be released as part of an SDK.

The caveat is that this is a good starting point to think about these terms, but not an absolute. In particular “API” has become a somewhat overloaded term. For example, a company may provide a “Speech API” _via a web service_ and then supply additional libraries, bindings or SDKs that can be used with different environments and languages. What makes the “Speech API” in this case different than the more abstract version we discussed above is that it can be used directly without any intermediate libraries by making specially formatted HTTP requests; similar to the requests used by web browsers to obtain the data they use to render web pages.

Most of these APIs use [JSON](http://www.json.org/) (a few use XML) as a standard to transfer data back and forth. This makes it easy to use (and, if necessary, create) wrappers in different languages.

The pseudo-code example above follows a common pattern: call an API via REST, passing text, audio, images, or video, and receive back a JSON dictionary or array that contains the results of the analysis performed by the remote service.

**Fundamentally, these APIs are high level, fast, and straightforward to use.** The downside? They may be too inflexible for your needs, in which case you’ll need to delve more deeply into training your own models, as we’ll see later.

Pricing for Web APIs is usage-based and generally reasonable. They have good availability and uptime, although they rarely give you SLAs or other guarantees as to how they will perform. Many are in various “testing” states: “beta”, “alpha”, “preview” and so on.

As a final note in terms of compatibility or standards: there aren’t any. There’s really no direct way to “port” a system that uses one API to another without having to modify the requests and the response processing. On the other hand, the calls and responses are, as we can see, fairly straightforward, so switching services is not hard for small systems.
