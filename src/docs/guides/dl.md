
# Machine Learning

Machine Learning can be generally defined as algorithms that are data-driven, as opposed to involving codification of behavior or knowledge in digital form.

For example, for a robot that had to navigate a flat grid, you could write relatively simple sets if-then-else rules to get the car from one end to the other. You would be in a sense "encoding" appropriate rules about driving, time to take, etc. With machine learning, the system would be, instead, learning "by example" -- you could simulate several paths taken and grade them according to time, fuel, etc, and the system will eventually learn and be able to predict (or, in a sense, _plan ahead_) what a reasonable route could be.

In recent years, however, a new term, "Deep Learning" has taken hold. It generally refers to machine learning systems based on multilayer data processing (typically through neural networks), that, additionally is done at a scale that leads to quantitatively different results.

# Deep Learning

According to [Wikipedia](https://en.wikipedia.org/wiki/Deep_learning):

> Deep learning (also known as deep structured learning, hierarchical learning or deep machine learning) is a branch of machine learning based on a set of algorithms that attempt to model high level abstractions in data by using a deep graph with multiple processing layers, composed of multiple linear and non-linear transformations

And what is a Neural Network? There are different ways of looking at them, as mechanisms that, by looking at data, "learn" complex functions that can result in that dataset and be predictive of other values. At the most basic level, neural networks _transform_: inputs in one dataspace into outputs in another.

# What's New, What Isn't

If you know a bit of the history of AI, you might wonder what's really new about all this, in essence, you could very reasonably ask: "Haven't We Tried This Before?"

The answer is: not really.

While the fundamental ideas are generally the same, the scale at which we are using them has changed, and that has brought quantitatively different (and better) results, in part because we can now test ideas we couldn't test before. Scale constraints created a barrier to evolution. As cloud computing has made large-scale experiments possible, the techniques have evolved and improved significantly.

Prof Geoff Hinton (Google and University of Toronto) discussed why previous approaches failed [at this point in the talk](https://youtu.be/VhmE_UXDOGs?t=1330). The first two reasons he identifies have to do with scale ("Our labeled datasets were thousands of times too small ") and compute capabilities ("Our computers were millions of times too slow") which clearly don't speak only to the speed of processors but compute capacity in general (ie., including processor, memory, storage, networking).

The difference in scale, and specifically the number of processing layers that enabled, is where the 'deep' of 'deep learning' comes into play.

## Why "Deep"

Jeff Dean (from Google) [echoes the idea](https://youtu.be/QSaZGT4-6EY?t=315) during a talk earlier this year: "Large-Scale Deep Learning for Intelligent Computer Systems" and [adds](https://youtu.be/QSaZGT4-6EY?t=561):

> "Deep refers to the number of layers [...]. I think of them as deep neural networks generally.""

This is the most common definition of what 'deep learning' stands for.

## Ways In Which Machines Learn

There are three major learning paradigms: _supervised_, _unsupervised_, and _reinforcement learning_.

**Supervised Learning** depends on a set of pre-existing data that is "labeled" in that we already know what the output of the network is expected to be for each pattern it is given. The process of learning can then use an objective function to quantify the mismatch between the expected and the observed results, and the network's weights can be adjusted accordingly.

**Unsupervised Learning** uses datasets that aren't labeled to identify clusters of data based on a cost function to be minimized. The function does not necessarily lead to a straight classification problem, but perhaps to a filtering or mapping of data.

**Reinforcement Learning** depends on interaction between the system and an environment, and while there are similar elements at play the goals are related to an accumulation of action and environmental responses that are useful for planning or control problems.

Forms of unsupervised and reinforcement learning are generally preferable, since supervised learning has obvious limitations. Most of the data that exists in the world is unlabeled, and the ability to explore and learn autonomously is crucial. Still, at the moment, the most common example of machine learning is _supervised learning_, which we'll discuss in a bit more detail next.
