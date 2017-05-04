# On APIs, Part II: Packaging and Complexity

## A Good Starting Point

Most of these APIs are at minimum a good starting point to experiment with what’s possible or to implement specific functionality, and many of them are reliable enough, even in beta form, that they can be effectively integrated into commercial products. The APIs that don’t support training are useful for one-step interactions, or to perform a second layer of aggregation on the results they provide. Their simplicity is both their strength and their weakness.

## The Complexity Chasm in (many) AI/ML Services

APIs sometimes simplify drastically the use of particular technologies by hiding or pre-setting most of the details. Consequently, they are less flexible but easier to use.

AI/ML systems, just like humans, depend on context and training to be effective. For example, you can train a speech recognition system for general colloquial language in English, but re-training it for a different language, or a specific domain in which highly specific/technical vocabulary is used is a non-trivial task.

Consider the first sentence of the Wikipedia page on the [Lockheed SR-71 Blackbird]:

> The Lockheed SR-71 "Blackbird" was a long-range, Mach 3+ strategic reconnaissance aircraft that was operated by the United States Air Force.

This is what one Speech-To-Text service transcribed when that sentence was read out loud:

> looking SR-71 Blackbird what's the new Arrangement 3 plus the digit reconnaissance aircraft that was operated by the United States Air Force

Domain-specific speech can easily confuse general speech recognition systems because it uses specialized vocabulary with difficult pronunciation, as well as modify significantly the meaning of words depending on context.

Slang, accents, and colloquialisms can also easily "confuse" these systems. So if we take the first two sentences of _Ulysses_ by James Joyce:

> Stately, plump Buck Mulligan came from the stairhead, bearing a bowl of lather on which a mirror and a razor lay crossed. A yellow dressinggown, ungirdled, was sustained gently behind him on the mild morning air.

when read out loud they were interpreted by one Speech-To-Text system as

> stately Young Buck Mulligan came from the stairhead bearing in Boulder on which a mirror and a razor across a yellow dressing gown and gargled with this time change thing behind it on the mild morning air

## Smaller Services = More Flexibility

As we mentioned above, smaller, more focused services built by startups like [https://recast.ai](https://recast.ai) do support training for different domains and intents in straightforward fashion. [Clarifai](https://clarifai.com) does the same for images, providing a robust platform that can adapt more easily to specific niches. Some of the services provided by the bigger companies, like IBM’s [Visual Recognition Service](http://www.ibm.com/watson/developercloud/visual-recognition/api/v3/#classify\_an\_image) provide somewhat easier mechanisms to update models and classifiers.

Alexa, Siri, Google Now, and others are actually systems that operate in a fairly narrow band of everyday language. Because it’s everyday language it _seems_ as if they are good at _general_ speech recognition, but they are not. Deviation from what they expect as typical inputs quickly reduces the effectiveness of the translation and can lead to [spectacular (and hilarious) failures].

This is where Machine Learning comes in.  
