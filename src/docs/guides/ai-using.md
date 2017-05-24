# Giving Your Software AI Superpowers

With that in mind, let's give your software some AI superpowers.

The easiest way to "add AI" is to call an API from your code, whether that API is exposed by a local software library or over the Web.

For example, this HTTP request sends a sentence to a sentiment analyzer over the Web:

`` GET /api/sentiment?phrase=Airplanes+with+the+shape+of+hawks+are+cool
``

Your code will get an answer like below, which means the sentiment of is positive. More precisely, the answer you get back is "this is an English sentence which has a positive (negative sentiments have a negative score) with a "sentiment strength" of 0.6, with 0 being weak and 1 being strong". So if you are an airplane designer, may we suggest a hawk shape next time you have a clean sheet of paper out?

```
{
     "score": 0.6000000238418579,
     "magnitude": 0.6000000238418579,
     "sentences": [
         {
             "text": {
                 "content": "Airplanes with the shape of hawks are cool.",
                 "beginOffset": -1
             },
             "sentiment": {
                 "magnitude": 0.6000000238418579,
                 "score": 0.6000000238418579
             }
         }
     ],
     "language": "en"
 }
```

If your application needs to work without an Internet connection, you can embed software libraries to call locally. For example, you can grab the [Stanford CoreNLP toolkit](http://stanfordnlp.github.io/CoreNLP/) to add language processing capabilities to your software, such as "part of speech tagging", which tries to identify where are the nouns, verbs, adjectives, adverbs and so are in your text.

Just as with regular programming, if you can't find a pre-built Web service or library to do what you want, you'll have to create your own special functions. These days, the most popular way to do this is by training a machine learning model with labeled data using something such as [scikit-learn](http://scikit-learn.org/stable/#) or [Spark's MLlib](http://spark.apache.org/mllib/) (for a wide collection of machine learning techniques) or [Tensorflow](https://www.tensorflow.org/), [Keras](https://keras.io/), [Caffe2](https://caffe2.ai/) or [MXnet](http://mxnet.io/) (for deep learning models). We'll walk through a few examples using a Web service called [Clarifai](https://www.clarifai.com/) and Google's TensorFlow later in this guide.

As of this writing (April 2017), high-level APIs are very easy to consume but there aren't very many of them. Low-level APIs which allow you to build your own model are difficult to consume and there is a lot of art using them effectively. But the field is improving quickly and all the major public cloud providers (Amazon, Google, IBM) are working hard on making more high-level APIs and improving the tools you use to embed AI capabilities into your own code.

## API vs. Library vs. SDK

When looking at what different companies/groups provide we will see there’s a lot of different acronyms and frequently overlapping acronyms used. Of these, the most common are:

* **API.** An API (Application Programming Interface) is a set of protocols, functions and definitions for building software. Traditionally an API defined abstractions: expected inputs and outputs for software and was implemented in concrete form in a _library_.
* **Library.** Actual implementation of an API, a library is generally embedded within the code that is using the API, but it may be separate and shared by multiple applications; these are called _dynamic shared libraries_  and are widely used by Operating Systems like Windows and MacOS to provide developers access to different types of services.
* **SDK.** SDKs (Software Development Kits) are generally considered in some way higher level than simply libraries, perhaps including multiple libraries, or different tools to make use of libraries easier, multiple language bindings, or so-called "wrappers" that can hide from programmers some of the complexity involved in using the library, by trading off simplicity for flexibility.

As a starting point, then, we can think of an API is a set of definitions, protocols, functions and capabilities, which are then implemented in one or more libraries which can then be released as part of an SDK.

The caveat is that this is a good starting point to think about these terms, but not an absolute. In particular, "API" has become a somewhat overloaded term. For example, a company may provide a "Speech API" _via a web service_ and then supply additional libraries, bindings or SDKs that can be used with different environments and languages. What makes the "Speech API" in this case different than the more abstract version we discussed above is that it can be used directly without any intermediate libraries by making specially formatted HTTP requests; similar to the requests used by web browsers to obtain the data they use to render web pages.

Most of these APIs use [JSON](http://www.json.org/) (a few use XML) as a standard to transfer data back and forth. This makes it easy to use (and, if necessary, create) wrappers in different languages.

The pseudo-code example above follows a common pattern: call an API via REST, passing text, audio, images, or video, and receive back a JSON dictionary or array that contains the results of the analysis performed by the remote service.

**Fundamentally, these APIs are high level, fast, and straightforward to use.** The downside? They may be too inflexible for your needs, in which case you’ll need to delve more deeply into training your own models, as we’ll see later.

Pricing for Web APIs is usage-based and generally reasonable. They have good availability and uptime, although they rarely give you SLAs or other guarantees as to how they will perform. Many are in various development states: "beta," "alpha," "preview," and so on.

As a final note in terms of compatibility or standards: there aren’t any. There’s really no direct way to "port" a system that uses one API to another without having to modify the requests and the response processing. On the other hand, the calls and responses are, as we can see, fairly straightforward, so switching services is not hard for small systems.
