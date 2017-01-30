# Natural Language Processing (NLP)

Natural Language Processing will enable better understanding all around: we'll talk to our computers; our computers will talk to us; and we'll have the [Star Trek Universal Communicator](http://memory-alpha.wikia.com/wiki/Universal_translator) in our ears translating any langauge into our native language in real time (and vice versa). Before we get to natural conversations with our computers, there are a lot of applications that help do things like understand whether someone is getting angry on a support call, write better job descriptions, and disambiguating words whose meaning change depending on context (see this Wikipedia page for a [fun list of examples](https://en.wikipedia.org/wiki/List_of_linguistic_example_sentences) including one of my favorite perfectly grammatical sentences: "[Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo]"(https://en.wikipedia.org/wiki/Buffalo_buffalo_Buffalo_buffalo_buffalo_buffalo_Buffalo_buffalo)

...
This branch of AI includes such capabilities as:
* **Speech to text**, which converts what you say into computer-readable text
* **Speech synthesis**, which goes the other way and gives computer an increasingly human-sounding voice
* **Language detection** which figures out what language a document is written in
* **Language translation**, which translates text from any language to any language
* ** Sentiment analysis**, which figures out the emotional tilt of text
* **Entity extraction**, which highlights all the "things, places, people, and products" in a piece of text

the ability to understand language either in audio or text form is a fundamental technology in both human-computer interaction and AI. Applications for it are literally everywhere, since nearly every human interaction can happen via language. Even if language is not the primary mode of interaction, speech can often serve as an effective addition in multi-modal interfaces. NLP also includes translation and language generation.

Speech recognition converts spoken speech into text or commands. Speech recognition has an immediate use for dictation applications, in which the system can transcribe what is being said. Often, though, the intended use of speech is for commands and interaction, which relaxes some constraints, e.g. highly accurate detection of every word and nuance, but tightens others, in particular response time. Recognition is generally done either _asynchronously_, meaning the speech is saved and the audio files are processed afterwards, or _streaming_ in which recognition is done and improved on the fly.

Whether text was written by humans or transcribed via speech recognition, **understanding** it enables computers to derive meaning from language input and act on it, or allows them to present alternatives for action to a person or other agent.

There are many degrees of "understanding" that can be achieved, from analyzing the sentiment behind a phrase or text to extracting information, disambiguating, or understanding the actual meaning.

## Sentiment Analysis

A basic form of natural language processing has to do with sentiment analysis. For example, the following sentences:

* “Seeing the F-117 Nighthawk was cool."
* "Airplanes with the shape of hawks are cool."
* "Seeing a hawk flying at night is cool."

All use similar nouns, have significantly different meanings,  but communicate a similar feeling, or _sentiment_. Understanding sentiment without depending on, or even understanding, meaning, can be extremely useful. For example, a system can monitor conversations of customers with technical support and derive a general degree of "happiness", "anger" or other emotions expressed in the communication. This type of analysis can be even more useful in the aggregate, whether combining multiple messages from a single person or from multiple people.

To see responses from different services to the same query, check out our [comparison page for Sentiment APIs](/test/phrase/sentiment-analysis).

## Entity Analysis and Extraction

Another important area in NLP deals with language _entities_. Types of analysis range from understanding syntax to extracting actual entities, identifying and labeling them by type (e.g. person, organization, location, events, product, etc). As in other cases the response data, structure, and accuracy varies wildly from one service to the next.

To see responses from different services to the same query, check out our [comparison page for Entity APIs](/test/phrase/entity-analysis).

## A Key Feature: Retraining

A key element to look at is whether the service in question supports training for new intents or models. Many general purpose text analysis systems don’t go further, but more focused services, like [https://recast.ai](https://recast.ai) and [https://api.ai](https://api.ai) do. When looking at the example results you will notice that “out of the box” those services respond with fewer or no entities, compared to the services of Google and others. The key difference is that they are oriented towards supporting conversations and custom entity and training sets. So while they may require some more work to be immediately useful, they are actually _more_ powerful in the long run since they support evolution and customization specific to a domain or niche.

## Language Analysis and Detection

While automated translation is an interesting application, language detection is a service that can be useful in many different situations — imagine, instead of having to ask a person what language they’d like to choose, they can simply speak or write and a service can use that information to automatically route to the correct language. 

To see responses from different services to the same query, see the [comparison page for Language Analysis APIs](/test/phrase/language-analysis).

## Language Generation and Translation

**Generating language** allows a computer to interact with humans in their own language. Generating spoken language is generally called _Speech Synthesis_. It's important to note that understanding speech or language is not required for generating it.

**Translating between languages** may or may not involve understanding, and may also involve different degrees of flexibility.

## API Examples

Here’s a collection of API examples referenced in this section

* [Sentiment Analysis](/test/phrase/sentiment-analysis)
* [Entity Extraction](/test/phrase/entity-analysis)
* [Language Detection](/test/phrase/language-analysis)
