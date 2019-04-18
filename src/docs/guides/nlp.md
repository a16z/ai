# Natural Language Processing

Natural Language Processing (NLP) will enable better understanding all around: we'll talk to our computers; our computers will understand us; and we'll have the [Star Trek Universal Communicator](http://memory-alpha.wikia.com/wiki/Universal_translator) in our ears translating any language into our native language in real time (and vice versa).

Before we get to long, philosophical, and emotional natural conversations with our computers (as in the movie [Her](http://www.imdb.com/title/tt1798709/), we can build a lot of extremely useful language-enabled applications that help do things like understand whether someone is getting angry on a support call, write better job descriptions, and disambiguating words whose meaning change depending on context (see this Wikipedia page for a [fun list of examples](https://en.wikipedia.org/wiki/List_of_linguistic_example_sentences) including one of my favorite perfectly grammatical sentences: [Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo](https://en.wikipedia.org/wiki/Buffalo_buffalo_Buffalo_buffalo_buffalo_buffalo_Buffalo_buffalo).

Scroll down this page to see modern AI services in action figuring out the emotional tilt of a sentence, translating English into Chinese, and more.

This branch of AI includes such capabilities as:
* **Automatic speech recognition (ASR)**, which converts what you say into computer-readable text, also called "speech to text"
* **Text to speech**, which goes the other way and gives computer an increasingly human-sounding voice
* **Language detection** which figures out what language a document is written in
* **Machine translation**, which translates text from any language to any language. Some language pairs work better than others, mostly because of the availability of data sets.
* **Sentiment analysis**, which figures out the emotional tilt of text
* **Entity extraction**, which highlights all the "things, places, people, and products" in a piece of text
* **Information extraction**, which finds relationships between extracted entities, such as "who did what to whom and how did they do it"?
* **Document analysis**, which categorizes documents, figures out what they are talking about (topic modeling), and makes the content easy to search (find documents about "fund raising" even if the documents never contain that exact phrase)
* **Natural language generation**, which generates well-formed sentences so that when you are chatting with your bot, it sounds like a real person
* **Summarization**, which generates readable summaries of arbitrary text documents, preserving as much of the meaning as possible
* **Question answering**, which answers questions from people about a dataset. Part of the challenge is figuring out which questions mean the same thing. In bots, a hot topic these days is "intent categorization", which is about trying to figure out what the user is trying to accomplish (e.g., book a flight, schedule a meeting, make a withdrawal)

Let's explore a few of these capabilities by calling real-world APIs, some from the open source community and others from the major public cloud providers such as Google, Microsoft, and IBM. You can type your own sentence or use of our pre-canned examples. Check the"I'm not a robot" box, and hit analyze. Click on the API Name to see the results that come back. It's fun! For example, click the IBM Watson Developer Cloud answer for sentiment analysis. It's like the entire cast (and friends) of Pixar's [*Inside Out*](http://www.imdb.com/title/tt2096673/) is evaluating your sentence.

Also, a quick shout out to the fabulous Delip Rao ([@deliprao](http://twitter.com/deliprao)) of [Joostware](http://joostware.com/) for his review of this entire guide, but especially this section. Delip knows NLP, among many other AI technologies. Thanks, Delip!

## Sentiment Analysis

A common natural language processing task involves understanding the affect or sentiment of text, also known as sentiment analysis. For example, the following sentences:

* "Seeing the F-117 Nighthawk was cool."
* "Airplanes with the shape of hawks are cool."
* "Seeing a hawk flying at night is cool."

All use similar nouns, have significantly different meanings,  but communicate a similar feeling, or _sentiment_. Understanding sentiment without depending on, or even understanding, meaning, can be extremely useful. For example, a system can monitor conversations of customers with technical support and derive a general degree of "happiness", "anger" or other emotions expressed in the communication.

To see responses from different services to the same query, check out our [comparison page for Sentiment APIs](/test/phrase/sentiment-analysis).

## Entity Analysis and Extraction

Another important area in NLP deals with language _entities_. Types of analysis range from understanding syntax to extracting actual entities, identifying and labeling them by type (e.g. person, organization, location, events, product, etc). As in other cases the response data, structure, and accuracy varies wildly from one service to the next.

To see responses from different services to the same query, check out our [comparison page for Entity APIs](/test/phrase/entity-analysis).

## A Key Feature: Retraining

A key element to look at is whether the service in question supports training for new intents or models. Many general purpose text analysis systems don’t go further, but more focused services, like [https://recast.ai](https://recast.ai) and [https://api.ai](https://api.ai) do. When looking at the example results you will notice that "out of the box" those services respond with fewer or no entities, compared to the services of Google and others. The key difference is that they are oriented towards supporting conversations and custom entity and training sets. So while they may require some more work to be immediately useful, they are actually _more_ powerful in the long run since they support evolution and customization specific to a domain or niche.

## Language Analysis and Detection

While automated translation is an interesting application, language detection is a service that can be useful in many different situations — imagine, instead of having to ask a person what language they’d like to choose, they can simply speak or write and a service can use that information to automatically route to the correct language.

To see responses from different services to the same query, see the [comparison page for Language Analysis APIs](/test/phrase/language-analysis).

## Language Generation and Translation

**Generating language** allows a computer to interact with humans in their own language. Generating spoken language is generally called _Speech Synthesis_. It's important to note that understanding speech or language is not required for generating it.

**Translating between languages** may or may not involve understanding, and may also involve different degrees of flexibility.
