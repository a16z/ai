# AI Intro

Today, we regularly interact with so-called “smart” software and voice-controlled digital assistants like Siri and Alexa. We have sophisticated consumer-level devices that can clean (e.g., Roomba) or entertain (e.g., Cozmo). Universities and companies around the world have high-end systems or advanced prototypes in place that include everything from [self-driving cars] to [autonomous combat robots].

At the same time, the influx of new devices and exponential growth of data is matched on the cloud by the growth of increasingly sophisticated infrastructure at very large scale that allows companies to experiment on datasets and problems of a size and type that could not be attempted before.

These experiments are quickly turning into real-world solutions, allowing companies to provide new levels of functionality based on Artificial Intelligence (AI from now on) systems and algorithms that can be applied more broadly than they have ever been.

Al encompasses many "subfields", ranging from the general, like vision, learning and perception, to the specific, such as playing complex board games like Chess or Go, proving mathematical theorems, writing music, or diagnosing diseases.

One major field of AI, Machine Learning (ML from now on) is experiencing a technological renaissance driven largely, as we will see later, by increasing capabilities in large scale software systems and platforms that can support millions of connected nodes.

As part of this shift there has been a burst of new projects, systems, and services in all sizes. In particular, service infrastructure that can be deployed internally or used on-demand on the cloud to solve these problems.

## A Definition

There are many definitions of what AI is and isn’t. For our purposes, we can use a major difference that divides reasonably well "Classical AI" from "Modern AI", and their related paradigms for intelligence.

In Classical AI there was the assumption, often implicit, that intelligence is dictated by logic. To those attempting to build artificially intelligent systems, this meant that you could represent knowledge by using rules of inference, and if you wanted to get from A to B you would have symbols and variables that would constitute the inference. With few exceptions, it was widely assumed that "this is how things are" and the question was how to prove it or replicate it.

Using propositional logic to reason about the world is a natural first step since much of our rational process can be modeled using it.

Efforts based on these approaches eventually failed as widely applicable solutions. They succeeded in niche domains or small problems, or within environments in which the parameters for operation had been highly constrained or painstakingly assembled over long periods of time.

Modern AI approaches have put the focus on models based on biology and driven by data. While ‘rules’ and propositional logic may have their place in certain cases, these systems use vast data sets to create virtual constructs and mathematical abstractions, like vectors, that don't really have anything that we could remotely identify as a proposition or a rule.

If the question is "how does the network decide when a picture is of a cat or a dog" the answer is... the network itself. This is not to say that it's a black box, but there isn't a set of logical propositions or rules generated, or anything that looks remotely like it.

These systems excel at pattern recognition but they don’t, in an of themselves, have the capability to _reason_ about those patterns. A neural network may be able to differentiate between photos of cats and dogs, but without any additional systems won’t really know what a cat, a dog, or even a _photo_ is. It will know to receive inputs in a certain format (e.g. the array of bits that comprise a JPEG image) and then will be able to give us a probability that the input is either “thing one” or “thing two” by outputting another array of bits. It is up to external actors to give meaning to both the input and the output.

> Note: For more detailed discussion we recommend the first chapter of Russell & Norvig's _Artificial Intelligence, A Modern Approach, 3rd edition_ entitled "What is AI?"

## AI vs ML

These are two terms we’ll come back to repeatedly that deserve some clarification, namely: what is the difference between “Artificial Intelligence” and “Machine Learning”?

The easiest way to separate the two is as follows: if AI is about machines behaving “intelligently”, ML focuses on whether that intelligent behavior was learned without being explicitly programmed, or not. Simple as that.

Machine Learning is _not_ synonymous with Neural Networks or any other specific AI approach, but it is dependent on it. How and what a system learns is directly influenced by how that system works, so both the overall AI approach and specific AI technologies used are direct influences on the learning process.

The underlying AI approach also typically influences how much a system can learn and therefore how “smart” it can become. For example, a “classical” expert system, built on rules that are primarily represented as if-then-else clauses, could learn over time just like a neural network, by entering and leaving “learning mode” and accumulating rules based on a training set. The problem, however, is that the number of “rules” in the system grows with the amount of knowledge, and so does the time to process them. Therefore it becomes necessary to create increasingly complex (and in many cases arbitrary) decision-making systems that can eliminate lots of possible answers quickly, and even then, storage space, memory and processing time will all go up correlating by some degree to the amount of “knowledge.” In contrast, a neural network of a given size will always maintain the same parameters for memory, storage, and processing, regardless of how much “knowledge” it has stored or how many patterns it’s learned. This is a fundamental reason why biologically-inspired approaches like neural networks are superior at scale.

Different AI and ML approaches are packaged in ways that make it easy and inexpensive to get started or build prototypes via Web APIs, and the underlying systems are also available for more complex or custom work, and this packaging matters, as we’ll discuss later on. Next, we’ll look at some of the services  
