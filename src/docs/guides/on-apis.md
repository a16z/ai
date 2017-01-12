# On APIs, Packaging and Complexity

Before we start looking at machine learning, it’s useful to spend a minute discussing the different ways in which these solutions present themselves.

These differences in packaging and delivery mechanisms have consequences in any field, but in AI/ML in particular they display a unique imbalance: things go very quickly from being very easy to being very, very hard, with little in between.

You will be able to notice this drastic difference between the APIs available for the topics we just covered and what comes next for Machine Learning. In this section we discuss why this is the case as well as the impact that choosing a specific path or solution can have when leveraging these technologies.

## API vs. Library vs. SDK

When looking at what different companies/groups provide we will see there’s a lot of different acronyms and frequently overlapping acronyms used. Of these, the most common are:

* **API.** An API (Application Programming Interface) is a set of protocols, functions and definitions for building software. Traditionally an API defined abstractions: expected inputs and outputs for software and was implemented in concrete form in a _library_.
* **Library.** Actual implementation of an API, a library is generally embedded within the code that is using the API, but it may be separate and shared by multiple applications; these are called _dynamic shared libraries_  and are widely used by Operating Systems like Windows and MacOS to provide developers access to different types of services.
* **SDK.** SDKs (Software Development Kits) are generally considered in some way higher level than simply libraries, perhaps including multiple libraries, or different tools to make use of libraries easier, multiple language bindings, or so-called “wrappers” that can hide from programmers some of the complexity involved in using the library, by trading off simplicity for flexibility.

As a starting point, then, we can think of an API is a set of definitions, protocols, functions and capabilities, which are then implemented in one or more libraries which can then be released as part of an SDK.

The caveat is that this is a good starting point to think about these terms, but not an absolute. In particular “API” has become a somewhat overloaded term. For example, a company may provide a “Speech API” _via a web service_ and then supply additional libraries, bindings or SDKs that can be used with different environments and languages. What makes the “Speech API” in this case different than the more abstract version we discussed above is that it can be used directly without any intermediate libraries by making specially formatted HTTP requests; similar to the requests used by web browsers to obtain the data they use to render web pages.

## The Complexity Chasm in AI/ML Services

In AI/ML, most APIs out there are web APIs, in the examples we saw in previous sections. These APIs tend to simplify drastically the use of particular technologies by hiding or pre-setting most of the details. Consequently, they are less flexible but easier to use.

This is because AI/ML systems depend on context and training to do anything useful at all. For example, you can train a speech recognition system for general colloquial language in English, but re-training it for a different language, or a specific domain in which highly specific/technical vocabulary is used is a non-trivial task.

For example, consider the first sentence of the Wikipedia page on the [Lockheed SR-71 Blackbird]:

> The Lockheed SR-71 "Blackbird" was a long-range, Mach 3+ strategic reconnaissance aircraft that was operated by the United States Air Force.

This is what a popular Speech-To-Text service transcribed when that sentence was read out loud:

> looking SR-71 Blackbird what's the new Arrangement 3 plus the digit reconnaissance aircraft that was operated by the United States Air Force

Domain-specific speech can easily confuse general speech recognition systems because it tends to use specialized vocabulary with difficult pronunciation, as well as modify significantly the meaning of words depending on context.

Slang, accents, and colloquialisms can also easily “confuse” these systems. So if we take the first two sentences of _Ulysses_ by James Joyce:

> Stately, plump Buck Mulligan came from the stairhead, bearing a bowl of lather on which a mirror and a razor lay crossed. A yellow dressinggown, ungirdled, was sustained gently behind him on the mild morning air.

when read out loud they are interpreted by the same Speech-To-Text system as

> stately Young Buck Mulligan came from the stairhead bearing in Boulder on which a mirror and a razor across a yellow dressing gown and gargled with this time change thing behind it on the mild morning air

Alexa, Siri, Google Now, and other systems are actually systems that operate in a fairly narrow band of everyday language. Because it’s common language it seems as if they are good at general speech recognition, but they are not, as can be seen when they fail, often spectacularly. Deviation from what they expect as typical inputs quickly reduces the effectiveness of the translation and can lead to [spectacular (and hilarious) failures].

This isn’t limited to speech — just like humans, any AI system requires training to be effective. There are Web APIs that allow you to send them an image and quickly return a set of terms that identify what the image is about, perhaps objects in it, etc. Using these systems is very easy, as [we’ve seen], but if your needs don’t match what the API provides then you have no way to train the system to operate differently.

This is where Machine Learning comes in.  
